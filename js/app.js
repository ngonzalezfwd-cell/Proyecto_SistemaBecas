
import { StorageService } from './storage.js';

const db = new StorageService();

// State
let currentUser = null;

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
    checkSession();
    renderDashboard();
    setupNavigation();
    setupForm();
    setupViews();
    updateUserInterface();
});

function checkSession() {
    currentUser = JSON.parse(localStorage.getItem('edugrant_current_user'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Update Profile UI
    document.getElementById('user-name').textContent = currentUser.fullName;
    document.getElementById('user-avatar').textContent = currentUser.fullName.charAt(0).toUpperCase();

    const roleLabels = {
        'admin': 'Administrador',
        'evaluator': 'Evaluador',
        'applicant': 'Postulante'
    };
    document.getElementById('user-role').textContent = roleLabels[currentUser.role] || 'Usuario';
}
// --- Navigation ---
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-target');

            // --- Permissions Guard ---
            if (targetId === 'scholarship-management' && currentUser.role !== 'admin') {
                alert("Acceso exclusivo para Administradores.");
                return;
            }
            if (targetId === 'evaluations' && !['admin', 'evaluator'].includes(currentUser.role)) {
                alert("Acceso restringido a Evaluadores o Administradores.");
                return;
            }
            if (targetId === 'reports' && currentUser.role !== 'admin') {
                alert("Acceso exclusivo para Administradores.");
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
            if (activeView) {
                activeView.classList.remove('hidden');
                activeView.classList.add('active');
            }

            // Update Title & Refresh Data
            updateViewContent(targetId);
        });
    });

    switchRoleBtn.addEventListener('click', () => {
        if (confirm("Para cambiar de cuenta debes cerrar sesión. ¿Continuar?")) {
            localStorage.removeItem('edugrant_current_user');
            window.location.href = 'login.html';
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('edugrant_current_user');
        window.location.href = 'login.html';
    });
}

function updateViewContent(targetId) {
    switch (targetId) {
        case 'dashboard':
            pageTitle.textContent = 'Becas Disponibles';
            renderDashboard();
            break;
        case 'apply':
            pageTitle.textContent = 'Nueva Postulación';
            populateScholarshipSelect();
            break;
        case 'history':
            pageTitle.textContent = 'Mi Historial';
            renderHistoryTable();
            break;
        case 'scholarship-management':
            pageTitle.textContent = 'Gestión de Becas';
            renderScholarshipMgmtTable();
            break;
        case 'evaluations':
            pageTitle.textContent = 'Panel de Evaluación';
            renderAdminTable();
            break;
        case 'reports':
            pageTitle.textContent = 'Estadísticas del Sistema';
            renderReports();
            break;
    }
}

function updateUserInterface() {
    // Hide nav links based on role
    navLinks.forEach(link => {
        const target = link.getAttribute('data-target');
        if (target === 'scholarship-management' || target === 'reports') {
            link.style.display = currentUser.role === 'admin' ? 'block' : 'none';
        }
        if (target === 'evaluations') {
            link.style.display = ['admin', 'evaluator'].includes(currentUser.role) ? 'block' : 'none';
        }
        if (target === 'history' || target === 'apply') {
            link.style.display = currentUser.role === 'applicant' ? 'block' : 'none';
        }
    });

    // Special behavior for Hero and Switch button
    const hero = document.querySelector('.hero');
    if (currentUser.role !== 'applicant') {
        if (hero) hero.style.display = 'none';
        switchRoleBtn.textContent = "Cambiar a Postulante";
    } else {
        if (hero) hero.style.display = 'block';
        switchRoleBtn.textContent = "Cambiar a Admin/Eval";
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
                ${currentUser.role === 'applicant' ? `<button class="btn-primary" onclick="goToApply(${sch.id})">Postular</button>` : ''}
            </div>
        </div>
    `).join('');
}

window.goToApply = (scholarshipId) => {
    const applyBtn = document.querySelector('[data-target="apply"]');
    if (applyBtn) applyBtn.click();
    setTimeout(() => {
        if (scholarshipSelect) scholarshipSelect.value = scholarshipId;
    }, 50);
};

// --- Features: Applicant History ---
function renderHistoryTable() {
    const apps = db.getUserApplications(currentUser.email);
    const scholarships = db.getScholarships();
    const tbody = document.getElementById('history-table-body');

    if (apps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No tienes postulaciones registradas.</td></tr>';
        return;
    }

    tbody.innerHTML = apps.map(app => {
        const sch = scholarships.find(s => s.id === app.scholarshipId);
        const date = new Date(app.date).toLocaleDateString();
        const statusLabels = { 'pending': 'Pendiente', 'approved': 'Aprobada', 'rejected': 'Rechazada' };
        const statusClasses = { 'pending': 'status-pending', 'approved': 'status-approved', 'rejected': 'status-rejected' };

        return `
            <tr>
                <td>${sch ? sch.title : 'Desconocida'}</td>
                <td>${date}</td>
                <td><span class="status-badge ${statusClasses[app.status]}">${statusLabels[app.status]}</span></td>
            </tr>
        `;
    }).join('');
}

// --- Features: Application Form ---
function populateScholarshipSelect() {
    const scholarships = db.getScholarships();
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
        if (!scholarshipId) { alert("Seleccione una beca."); return; }

        const scholarship = db.getScholarships().find(s => s.id === scholarshipId);
        const formData = {
            id: 'app_' + Date.now(),
            scholarshipId: scholarshipId,
            applicantName: document.getElementById('full-name').value,
            applicantEmail: currentUser.email,
            age: parseInt(document.getElementById('age').value),
            gpa: parseFloat(document.getElementById('gpa').value),
            income: parseFloat(document.getElementById('income').value),
            motivation: document.getElementById('motivation').value,
            status: 'pending',
            date: new Date().toISOString()
        };

        const req = scholarship.requirements;
        let errors = [];
        if (formData.gpa < req.minGPA) errors.push(`Promedio insuficiente (Mín: ${req.minGPA})`);
        if (formData.age > req.maxAge) errors.push(`Edad excede límite (Máx: ${req.maxAge})`);

        if (errors.length > 0) {
            alert(`No cumples requisitos:\n- ${errors.join('\n- ')}`);
            return;
        }

        db.addApplication(formData);
        alert("¡Postulación enviada!");
        form.reset();
        document.querySelector('[data-target="history"]').click();
    });
}

// --- Features: Scholarship Management (Admin) ---
let currentSchEditingId = null;
const schModal = document.getElementById('scholarship-modal');
const schForm = document.getElementById('scholarship-form');

function renderScholarshipMgmtTable() {
    const list = db.getScholarships();
    const tbody = document.getElementById('scholarships-mgmt-table-body');
    tbody.innerHTML = list.map(sch => `
        <tr>
            <td>${sch.title}</td>
            <td>${sch.amount}</td>
            <td>
                <button class="btn-secondary" onclick="editSch(${sch.id})">Editar</button>
                <button class="btn-danger" onclick="deleteSch(${sch.id})">Borrar</button>
            </td>
        </tr>
    `).join('');
}

window.editSch = (id) => {
    const sch = db.getScholarships().find(s => s.id === id);
    currentSchEditingId = id;
    document.getElementById('sch-modal-title').textContent = "Editar Beca";
    document.getElementById('sch-id').value = sch.id;
    document.getElementById('sch-title').value = sch.title;
    document.getElementById('sch-desc').value = sch.description;
    document.getElementById('sch-amount').value = sch.amount;
    document.getElementById('sch-min-gpa').value = sch.requirements.minGPA;
    document.getElementById('sch-max-age').value = sch.requirements.maxAge;
    document.getElementById('sch-max-income').value = sch.requirements.maxIncome || '';
    schModal.classList.remove('hidden');
};

window.deleteSch = (id) => {
    if (confirm("¿Seguro que quieres eliminar esta beca?")) {
        db.deleteScholarship(id);
        renderScholarshipMgmtTable();
    }
};

function setupViews() {
    // Scholarship Modal
    document.getElementById('add-scholarship-btn').addEventListener('click', () => {
        currentSchEditingId = null;
        schForm.reset();
        document.getElementById('sch-modal-title').textContent = "Nueva Beca";
        schModal.classList.remove('hidden');
    });

    document.querySelector('.close-modal-sch').addEventListener('click', () => schModal.classList.add('hidden'));

    schForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const schData = {
            id: currentSchEditingId || Date.now(),
            title: document.getElementById('sch-title').value,
            description: document.getElementById('sch-desc').value,
            amount: document.getElementById('sch-amount').value,
            requirements: {
                minGPA: parseFloat(document.getElementById('sch-min-gpa').value),
                maxAge: parseInt(document.getElementById('sch-max-age').value),
                maxIncome: parseFloat(document.getElementById('sch-max-income').value) || null
            }
        };

        if (currentSchEditingId) {
            db.updateScholarship(currentSchEditingId, schData);
        } else {
            db.addScholarship(schData);
        }

        schModal.classList.add('hidden');
        renderScholarshipMgmtTable();
    });

    // Evaluation Modal
    document.querySelector('.close-modal').addEventListener('click', () => evalModal.classList.add('hidden'));
    document.getElementById('btn-approve').addEventListener('click', () => finalizeEvaluation('approved'));
    document.getElementById('btn-reject').addEventListener('click', () => finalizeEvaluation('rejected'));
}

// --- Features: Evaluation (Admin & Evaluator) ---
const evalModal = document.getElementById('evaluation-modal');
let currentEvalAppId = null;

function renderAdminTable() {
    const apps = db.getApplications();
    const scholarships = db.getScholarships();
    const tbody = document.getElementById('applications-table-body');
    const stats = db.getStats();

    document.getElementById('stat-pending').textContent = stats.pending;
    document.getElementById('stat-evaluated').textContent = stats.approved + stats.rejected;

    tbody.innerHTML = apps.map(app => {
        const sch = scholarships.find(s => s.id === app.scholarshipId);
        const statusLabel = { 'pending': 'Pendiente', 'approved': 'Aprobada', 'rejected': 'Rechazada' }[app.status];
        const statusClass = { 'pending': 'status-pending', 'approved': 'status-approved', 'rejected': 'status-rejected' }[app.status];

        return `
            <tr>
                <td>${app.applicantName}</td>
                <td>${sch ? sch.title : '---'}</td>
                <td>${app.gpa}</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>
                    <button class="btn-secondary" onclick="openEvaluation('${app.id}')">Evaluar</button>
                </td>
            </tr>
        `;
    }).join('');
}

window.openEvaluation = (appId) => {
    currentEvalAppId = appId;
    const app = db.getApplications().find(a => a.id === appId);
    const sch = db.getScholarships().find(s => s.id === app.scholarshipId);

    document.getElementById('modal-details').innerHTML = `
        <p><strong>Candidato:</strong> ${app.applicantName}</p>
        <p><strong>Beca:</strong> ${sch ? sch.title : '---'}</p>
        <p><strong>Promedio:</strong> ${app.gpa}</p>
        <p><strong>Motivación:</strong> "${app.motivation}"</p>
    `;
    evalModal.classList.remove('hidden');
};

function finalizeEvaluation(status) {
    if (currentEvalAppId) {
        db.updateStatus(currentEvalAppId, status);
        evalModal.classList.add('hidden');
        renderAdminTable();
    }
}

// --- Reports ---
function renderReports() {
    const stats = db.getStats();
    document.getElementById('reports-content').innerHTML = `
        <div class="stats-row">
            <div class="stat-card"><h4>Total</h4><span class="stat-number">${stats.total}</span></div>
            <div class="stat-card"><h4>Aprobadas</h4><span class="stat-number">${stats.approved}</span></div>
        </div>
        <p style="margin-top:1rem;">Tasa de éxito: ${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%</p>
    `;
}
