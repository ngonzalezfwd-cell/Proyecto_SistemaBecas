import { StorageService } from './storage.js';

const db = new StorageService();

// State
let currentUserRole = 'applicant'; // 'applicant' | 'admin'

// DOM Elements
const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-link');
const pageTitle = document.getElementById('page-title');
const switchRoleBtn = document.getElementById('switch-role-btn');
const scholarshipGrid = document.getElementById('scholarships-container');
const scholarshipSelect = document.getElementById('scholarship-select');
const form = document.getElementById('application-form');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    setupNavigation();
    setupForm();
    setupAdmin();
    updateUserInterface();
});

// --- Navigation ---
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-target');

            // Simple guard for Admin tab
            if (targetId === 'admin' && currentUserRole !== 'admin') {
                alert("Acceso denegado: Solo para administradores.");
                return;
            }

            // Update UI
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch View
            views.forEach(view => {
                view.classList.add('hidden');
                view.classList.remove('active');
            });
            const activeView = document.getElementById(targetId);
            activeView.classList.remove('hidden');
            activeView.classList.add('active');

            // Update Title & Refresh Data
            switch (targetId) {
                case 'dashboard':
                    pageTitle.textContent = 'Becas Disponibles';
                    renderDashboard();
                    break;
                case 'apply':
                    pageTitle.textContent = 'Formulario de Postulación';
                    populateScholarshipSelect();
                    break;
                case 'admin':
                    pageTitle.textContent = 'Panel de Administración';
                    renderAdminTable();
                    break;
                case 'reports':
                    pageTitle.textContent = 'Reportes y Estadísticas';
                    renderReports();
                    break;
            }
        });
    });

    switchRoleBtn.addEventListener('click', () => {
        currentUserRole = currentUserRole === 'applicant' ? 'admin' : 'applicant';
        updateUserInterface();
        // Go back to dashboard on role switch
        document.querySelector('[data-target="dashboard"]').click();
    });
}

function updateUserInterface() {
    const roleLabel = document.querySelector('.user-profile .role');
    const roleAvatar = document.querySelector('.user-profile .avatar');

    if (currentUserRole === 'admin') {
        roleLabel.textContent = "Administrador";
        roleAvatar.textContent = "A";
        roleAvatar.style.backgroundColor = "var(--danger-color)";
        switchRoleBtn.textContent = "Cambiar a Estudiante";
    } else {
        roleLabel.textContent = "Estudiante";
        roleAvatar.textContent = "U";
        roleAvatar.style.backgroundColor = "var(--primary-color)";
        switchRoleBtn.textContent = "Cambiar a Admin";
    }
}

// --- Features: Dashboard ---
function renderDashboard() {
    const scholarships = db.getScholarships();
    scholarshipGrid.innerHTML = scholarships.map(sch => `
        <div class="card">
            <h3>${sch.title}</h3>
            <p>${sch.description}</p>
            <div style="margin-bottom: 1rem;">
                <strong>Requisitos:</strong>
                <ul style="padding-left: 1.2rem; color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
                    <li>Promedio mín: ${sch.requirements.minGPA}</li>
                    <li>Edad máx: ${sch.requirements.maxAge} años</li>
                    ${sch.requirements.maxIncome ? `<li>Ingreso máx: $${sch.requirements.maxIncome}</li>` : ''}
                </ul>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                <span style="font-weight: bold; color: var(--primary-color);">${sch.amount}</span>
                <button class="btn-primary" onclick="window.location.hash = ''; goToApply(${sch.id})">Postular</button>
            </div>
        </div>
    `).join('');
}

// Global helper to jump to apply form from dashboard
window.goToApply = (scholarshipId) => {
    const applyBtn = document.querySelector('[data-target="apply"]');
    applyBtn.click();
    // Pre-select the scholarship after a small delay to ensure render
    setTimeout(() => {
        scholarshipSelect.value = scholarshipId;
    }, 50);
};

// --- Features: Application Form ---
function populateScholarshipSelect() {
    const scholarships = db.getScholarships();
    // Keep the first option
    scholarshipSelect.innerHTML = '<option value="">-- Seleccione una opción --</option>';
    scholarships.forEach(sch => {
        const option = document.createElement('option');
        option.value = sch.id;
        option.textContent = sch.title;
        scholarshipSelect.appendChild(option);
    });
}

function setupForm() {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const scholarshipId = parseInt(scholarshipSelect.value);
        if (!scholarshipId) {
            alert("Por favor seleccione una beca.");
            return;
        }

        const scholarship = db.getScholarships().find(s => s.id === scholarshipId);

        // Gather Data
        const formData = {
            id: 'app_' + Date.now(),
            scholarshipId: scholarshipId,
            applicantName: document.getElementById('full-name').value,
            age: parseInt(document.getElementById('age').value),
            gpa: parseFloat(document.getElementById('gpa').value),
            income: parseFloat(document.getElementById('income').value),
            motivation: document.getElementById('motivation').value,
            status: 'pending',
            date: new Date().toISOString()
        };

        // --- VALIDATION LOGIC ---
        const req = scholarship.requirements;
        let errors = [];

        if (formData.gpa < req.minGPA) errors.push(`El promedio mínimo es ${req.minGPA}. Tienes ${formData.gpa}.`);
        if (formData.age > req.maxAge) errors.push(`La edad máxima es ${req.maxAge}. Tienes ${formData.age}.`);
        if (req.maxIncome && formData.income > req.maxIncome) errors.push(`El ingreso excede el límite de $${req.maxIncome}.`);

        if (errors.length > 0) {
            alert(`No cumples con los requisitos:\n- ${errors.join('\n- ')}`);
            // Automatically reject? Or just block submission?
            // "Validar automáticamente requisitos" usually implies blocking or auto-rejecting. 
            // Let's block submission for better UX.
            return;
        }

        // Save
        db.addApplication(formData);
        alert("¡Postulación enviada con éxito!");
        form.reset();
        // Go back to dashboard
        document.querySelector('[data-target="dashboard"]').click();
    });
}

// --- Features: Admin Panel ---
function renderAdminTable() {
    const apps = db.getApplications();
    const scholarships = db.getScholarships();
    const tbody = document.getElementById('applications-table-body');

    // Update Stats
    const stats = db.getStats();
    document.getElementById('stat-pending').textContent = stats.pending;
    document.getElementById('stat-evaluated').textContent = stats.approved + stats.rejected;

    tbody.innerHTML = apps.map(app => {
        const sch = scholarships.find(s => s.id === app.scholarshipId);
        const date = new Date(app.date).toLocaleDateString();

        let statusClass = 'status-pending';
        if (app.status === 'approved') statusClass = 'status-approved';
        if (app.status === 'rejected') statusClass = 'status-rejected';

        const statusLabel = {
            'pending': 'Pendiente',
            'approved': 'Aprobada',
            'rejected': 'Rechazada'
        }[app.status];

        return `
            <tr>
                <td>
                    <div style="font-weight: 500;">${app.applicantName}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${date}</div>
                </td>
                <td>${sch ? sch.title : 'Desconocida'}</td>
                <td>${app.gpa}</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>
                    <button class="btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" 
                        onclick="openEvaluation('${app.id}')">
                        Evaluar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// --- Features: Evaluation Modal ---
const modal = document.getElementById('evaluation-modal');
const closeModal = document.querySelector('.close-modal');
const btnApprove = document.getElementById('btn-approve');
const btnReject = document.getElementById('btn-reject');
let currentEvalAppId = null;

window.openEvaluation = (appId) => {
    currentEvalAppId = appId;
    const app = db.getApplications().find(a => a.id === appId);
    const sch = db.getScholarships().find(s => s.id === app.scholarshipId);

    const details = document.getElementById('modal-details');
    details.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <p><strong>Candidato:</strong> ${app.applicantName}</p>
            <p><strong>Beca:</strong> ${sch.title}</p>
            <p><strong>Promedio:</strong> ${app.gpa}</p>
            <p><strong>Edad:</strong> ${app.age}</p>
            <p><strong>Ingreso:</strong> $${app.income}</p>
        </div>
        <div style="background: var(--secondary-bg); padding: 1rem; border-radius: 6px;">
            <strong>Motivación:</strong>
            <p style="margin-top: 0.5rem; font-style: italic;">"${app.motivation}"</p>
        </div>
    `;

    modal.classList.remove('hidden');
};

function setupAdmin() {
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));

    btnApprove.addEventListener('click', () => {
        if (currentEvalAppId) {
            db.updateStatus(currentEvalAppId, 'approved');
            modal.classList.add('hidden');
            renderAdminTable(); // Refresh table
        }
    });

    btnReject.addEventListener('click', () => {
        if (currentEvalAppId) {
            db.updateStatus(currentEvalAppId, 'rejected');
            modal.classList.add('hidden');
            renderAdminTable(); // Refresh table
        }
    });
}

// --- Features: Reports ---
function renderReports() {
    const apps = db.getApplications();
    const stats = db.getStats();

    // Simple HTML Report
    const reportHTML = `
        <div class="stats-row">
            <div class="stat-card">
                <h4>Total Solicitudes</h4>
                <span class="stat-number">${stats.total}</span>
            </div>
            <div class="stat-card">
                <h4>Tasa de Aprobación</h4>
                <span class="stat-number" style="color: var(--success-color);">
                    ${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </span>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h4>Detalle de Postulantes</h4>
            <ul style="margin-top: 1rem; list-style-type: disc; padding-left: 1.5rem;">
                ${apps.map(a => `<li>${a.applicantName} - ${a.status.toUpperCase()}</li>`).join('')}
            </ul>
        </div>
    `;

    document.getElementById('reports-content').innerHTML = reportHTML;
}
