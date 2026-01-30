
import { StorageService } from './storage.js';

const db = new StorageService();

// Estado global de la aplicación

let currentUser = null;

// DOM Elements
const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-link');
const pageTitle = document.getElementById('page-title');
const scholarshipGrid = document.getElementById('scholarships-container');
const scholarshipSelect = document.getElementById('scholarship-select');
const form = document.getElementById('application-form');
const evalMgmtTableBody = document.getElementById('evaluators-mgmt-table-body');
const evalCrudModal = document.getElementById('evaluator-modal');
const evalCrudForm = document.getElementById('evaluator-form');

// --- Inicialización: Se ejecuta cuando el DOM está listo ---

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    renderDashboard();
    setupNavigation();
    setupForm();
    setupViews();
    updateUserInterface();

});

function checkSession() {
    // Verificar si el usuario está logueado

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

    // Set default view based on role
    if (currentUser.role === 'admin') {

        switchView('scholarship-management');

    } else if (currentUser.role === 'evaluator') {

        switchView('evaluations');
    } else {
        switchView('dashboard');
    }
}

// Helper para cambiar vistas programáticamente
function switchView(targetId) {
    const link = Array.from(navLinks).find(l => l.getAttribute('data-target') === targetId);
    if (!link) return;

    // Actualizar UI del Nav
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Cambiar la visibilidad de las secciones
    views.forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('active');
    });
    const activeView = document.getElementById(targetId);
    if (activeView) {
        activeView.classList.remove('hidden');
        activeView.classList.add('active');
    }

    // Actualizar título y contenido
    updateViewContent(targetId);
}

// --- Navegación: Controla el cambio de vistas y permisos ---
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-target');

            // --- Permissions Guard ---
            if (targetId === 'scholarship-management' && currentUser.role !== 'admin') {
                alert("Acceso exclusivo para Administradores.");
                return;
            }
            if (targetId === 'evaluators-management' && currentUser.role !== 'admin') {
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

            switchView(targetId);
        });
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
        case 'evaluators-management':
            pageTitle.textContent = 'Gestión de Evaluadores';
            renderEvaluatorMgmtTable();
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
    // Ocultar enlaces de navegación según el rol
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        const target = link.getAttribute('data-target');
        let isVisible = false;

        if (currentUser.role === 'admin') {
            // El Admin solo ve gestión y reportes
            isVisible = ['scholarship-management', 'reports', 'evaluators-management', 'evaluations'].includes(target);
        } else if (currentUser.role === 'evaluator') {
            // El Evaluador solo ve evaluaciones
            isVisible = ['evaluations'].includes(target);
        } else {
            // El Postulante ve inicio, postular e historial
            isVisible = ['dashboard', 'apply', 'history'].includes(target);
        }

        link.style.setProperty('display', isVisible ? 'block' : 'none', 'important');
    });

    // Dynamic Hero Content
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroSearch = document.getElementById('hero-search-bar');

    if (heroTitle && heroSubtitle) {
        if (currentUser.role === 'admin') {
            heroTitle.textContent = 'Panel de Gestión Administrativa';
            heroSubtitle.textContent = 'Crea becas y gestiona evaluadores con facilidad.';
            heroSearch.style.display = 'none';
        } else if (currentUser.role === 'evaluator') {
            heroTitle.textContent = 'Panel de Revisión Académica';
            heroSubtitle.textContent = 'Evalúa postulaciones y toma decisiones hoy mismo.';
            heroSearch.style.display = 'none';
        } else {
            heroTitle.textContent = 'Encuentra la beca de tus sueños';
            heroSubtitle.textContent = ''; // Leave empty for applicants as they have the search bar
            heroSearch.style.display = 'flex';
        }
    }
}

// --- Funcionalidad: Dashboard - Renderiza las tarjetas de becas ---
function renderDashboard() {
    const scholarships = db.getScholarships();
    scholarshipGrid.innerHTML = scholarships.map(sch => `
        <div class="card scholarship-card">
            <div class="card-header-flex">
                <h3 class="card-title-sm">${sch.title}</h3>
                <span class="status-badge badge-sm ${sch.status === 'Abierta' ? 'status-approved' : 'status-rejected'}">
                    ${sch.status}
                </span>
            </div>
            <p class="color-text-muted text-sm mb-1rem">${sch.description}</p>
            
            <div class="card-info-grid">
                <div>
                    <strong class="info-label">Tipo</strong>
                    <span>${sch.type || 'N/A'}</span>
                </div>
                <div>
                    <strong class="info-label">Monto</strong>
                    <span class="info-value-primary">${sch.amount}</span>
                </div>
                <div>
                    <strong class="info-label">Apertura</strong>
                    <span>${sch.startDate || 'N/A'}</span>
                </div>
                <div>
                    <strong class="info-label">Cierre</strong>
                    <span>${sch.endDate || 'N/A'}</span>
                </div>
            </div>

            <div class="card-requirements-box">
                <strong class="req-title">Requisitos:</strong>
                <ul class="req-list">
                    <li>Promedio mín: <strong>${sch.requirements.minGPA}</strong></li>
                    <li>Edad máx: <strong>${sch.requirements.maxAge} años</strong></li>
                    ${sch.requirements.maxIncome ? `<li>Ingreso máx: <strong>$${sch.requirements.maxIncome}</strong></li>` : ''}
                </ul>
            </div>

            <div class="mt-auto">
                ${currentUser.role === 'applicant' && sch.status === 'Abierta'
            ? `<button class="btn-primary btn-full" onclick="goToApply(${sch.id})">Postular a esta Beca</button>`
            : sch.status === 'Cerrada'
                ? `<button class="btn-secondary btn-full" disabled>Convocatoria Cerrada</button>`
                : `<button class="btn-secondary btn-full" disabled>Modo Visualización</button>`
        }
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

// --- Funcionalidad: Historial del Postulante ---
function renderHistoryTable() {
    const apps = db.getUserApplications(currentUser.email);
    const scholarships = db.getScholarships();
    const tbody = document.getElementById('history-table-body');

    if (apps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No tienes postulaciones registradas.</td></tr>';
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

// --- Funcionalidad: Formulario de Aplicación ---
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

// --- Funcionalidad: Gestión de Becas (Admin) ---
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
    document.getElementById('sch-type').value = sch.type || 'Académica';
    document.getElementById('sch-start-date').value = sch.startDate || '';
    document.getElementById('sch-end-date').value = sch.endDate || '';
    document.getElementById('sch-status').value = sch.status || 'Abierta';
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

// --- Features: Evaluator Management (Admin) ---
function renderEvaluatorMgmtTable() {
    const list = db.getEvaluators();
    if (!evalMgmtTableBody) return;
    evalMgmtTableBody.innerHTML = list.map(ev => `
        <tr>
            <td>${ev.fullName}</td>
            <td>${ev.email}</td>
            <td>
                <button class="btn-danger" onclick="deleteEval('${ev.email}')">Borrar</button>
            </td>
        </tr>
    `).join('');
}

window.deleteEval = (email) => {
    if (confirm(`¿Seguro que quieres eliminar al evaluador ${email}?`)) {
        db.deleteEvaluator(email);
        renderEvaluatorMgmtTable();
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
            type: document.getElementById('sch-type').value,
            startDate: document.getElementById('sch-start-date').value,
            endDate: document.getElementById('sch-end-date').value,
            status: document.getElementById('sch-status').value,
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

    // Evaluator Modal
    const addEvalBtn = document.getElementById('add-evaluator-btn');
    if (addEvalBtn) {
        addEvalBtn.addEventListener('click', () => {
            evalCrudForm.reset();
            evalCrudModal.classList.remove('hidden');
        });
    }

    const closeEvalModal = document.querySelector('.close-modal-eval');
    if (closeEvalModal) {
        closeEvalModal.addEventListener('click', () => evalCrudModal.classList.add('hidden'));
    }

    if (evalCrudForm) {
        evalCrudForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const evalData = {
                fullName: document.getElementById('eval-name').value,
                email: document.getElementById('eval-email').value,
                password: document.getElementById('eval-password').value
            };

            db.addEvaluator(evalData);
            evalCrudModal.classList.add('hidden');
            renderEvaluatorMgmtTable();
        });
    }

    // Evaluation Modal
    document.querySelector('.close-modal').addEventListener('click', () => evalModal.classList.add('hidden'));
    document.getElementById('btn-approve').addEventListener('click', () => finalizeEvaluation('approved'));
    document.getElementById('btn-reject').addEventListener('click', () => finalizeEvaluation('rejected'));
}

// --- Funcionalidad: Evaluación de Solicitudes (Admin y Evaluador) ---
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

// --- Reportes y Estadísticas ---
function renderReports() {
    const stats = db.getStats();
    document.getElementById('reports-content').innerHTML = `
        <div class="stats-row">
            <div class="stat-card"><h4>Total</h4><span class="stat-number">${stats.total}</span></div>
            <div class="stat-card"><h4>Aprobadas</h4><span class="stat-number">${stats.approved}</span></div>
        </div>
        <p class="reports-success-rate">Tasa de éxito: ${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%</p>
    `;
}
