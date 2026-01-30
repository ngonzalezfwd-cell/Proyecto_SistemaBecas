
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
    setupHelpModal();
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
            window.switchView(targetId);
        });
    });

    const mainLogo = document.getElementById('main-logo');
    if (mainLogo) {
        mainLogo.addEventListener('click', () => {
            window.switchView('dashboard');
        });
    }

    window.switchView = function (targetId) {
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
        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('data-target') === targetId) l.classList.add('active');
        });

        // Switch View
        views.forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active');
        });

        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.remove('hidden');
            targetView.classList.add('active');
        }

        // Update Title & Refresh Data
        updateViewContent(targetId);
    };

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
            renderHistory();
            break;
        case 'user-guide':
            pageTitle.textContent = 'Guía de Usuario';
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
function getDeadlineInfo(deadlineStr) {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const diff = deadline - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 3) return { class: 'deadline-urgent', text: `¡Solo quedan ${days} días!` };
    if (days <= 10) return { class: 'deadline-warning', text: `Quedan ${days} días` };
    return { class: 'deadline-safe', text: `${days} días restantes` };
}

function renderDashboard() {
    const scholarships = db.getScholarships();
    scholarshipGrid.innerHTML = scholarships.map(sch => {
        const deadlineInfo = getDeadlineInfo(sch.deadline);
        const catClass = `cat-${sch.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;

        return `
        <div class="card scholarship-card">
            <div class="category-tag ${catClass}">${sch.category}</div>
            <h3>${sch.title}</h3>
            <p>${sch.description}</p>
            
            <div class="requirements-container">
                <strong>Requisitos:</strong>
                <ul class="requirements-list">
                    <li>Promedio mín: ${sch.requirements.minGPA}</li>
                    <li>Edad máx: ${sch.requirements.maxAge} años</li>
                    ${sch.requirements.maxIncome ? `<li>Ingreso máx: ₡${sch.requirements.maxIncome.toLocaleString()}</li>` : ''}
                </ul>
            </div>

            ${deadlineInfo ? `
            <div class="deadline-badge ${deadlineInfo.class}">
                <span>⏳</span> ${deadlineInfo.text}
            </div>` : ''}

            <div class="card-footer">
                <span class="scholarship-amount">${sch.amount}</span>
                ${currentUser.role === 'applicant' ? `<button class="btn-primary" onclick="goToApply(${sch.id})">Postular</button>` : ''}
            </div>
        </div>
    `;
    }).join('');
}

window.goToApply = (scholarshipId) => {
    const applyBtn = document.querySelector('[data-target="apply"]');
    if (applyBtn) applyBtn.click();
    setTimeout(() => {
        if (scholarshipSelect) scholarshipSelect.value = scholarshipId;
    }, 50);
};

// --- Features: Applicant History ---
function renderHistory() {
    const apps = db.getUserApplications(currentUser.email);
    const scholarships = db.getScholarships();
    const tbody = document.getElementById('history-table-body');

    if (apps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No tienes postulaciones registradas.</td></tr>';
        return;
    }

    tbody.innerHTML = apps.map(app => {
        const sch = scholarships.find(s => s.id === app.scholarshipId);
        const date = new Date(app.date).toLocaleDateString();

        const statusMap = {
            'enviada': { label: 'Enviada', class: 'status-pending' },
            'revision': { label: 'En Revisión', class: 'status-warning' },
            'aprobada': { label: 'Aprobada', class: 'status-approved' },
            'rechazada': { label: 'Rechazada', class: 'status-rejected' }
        };
        const status = statusMap[app.status] || { label: app.status, class: 'status-pending' };

        return `
            <tr>
                <td>${sch ? sch.title : 'Desconocida'}</td>
                <td>${date}</td>
                <td><span class="status-badge ${status.class}">${status.label}</span></td>
                <td>
                    ${app.status === 'aprobada' || app.status === 'rechazada' ?
                `<button class="btn-secondary" onclick="viewResult('${app.id}')">Ver Detalle</button>` : '---'}
                </td>
            </tr>
        `;
    }).join('');
}

window.viewResult = (appId) => {
    const app = db.getApplications().find(a => a.id === appId);
    const total = (app.scoreEcon || 0) + (app.scoreAcad || 0) + (app.scoreSocial || 0);
    alert(`Resultado de tu Postulación:\n\nEstado: ${app.status.toUpperCase()}\n\nPuntaje Total: ${total} puntos\n(Econ: ${app.scoreEcon || 0}, Acad: ${app.scoreAcad || 0}, Soc: ${app.scoreSocial || 0})\n\nObservaciones:\n${app.observations || 'Sin observaciones adicionales.'}`);
};

// --- Features: Application Form ---
function populateScholarshipSelect() {
    const scholarships = db.getScholarships();
    scholarshipSelect.innerHTML = '<option value="">-- Seleccione una opción --</option>';
    scholarships.forEach(sch => {
        const option = document.createElement('option');
        option.value = sch.id;
        option.textContent = `${sch.title} - (${sch.amount})`;
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
            studentId: document.getElementById('student-id').value,
            applicantName: document.getElementById('full-name').value,
            applicantEmail: currentUser.email,
            age: parseInt(document.getElementById('age').value),
            phone: document.getElementById('phone').value,
            education: document.getElementById('education').value,
            gpa: parseFloat(document.getElementById('gpa').value),
            income: parseFloat(document.getElementById('income').value),
            motivation: document.getElementById('motivation').value,
            status: 'pending',
            date: new Date().toISOString()
        };

        const existingApps = db.getUserApplications(currentUser.email);
        if (existingApps.some(app => app.scholarshipId === scholarshipId)) {
            alert("Usted ya ha enviado una postulación para esta beca anteriormente. No se permiten postulaciones duplicadas.");
            return;
        }

        const req = scholarship.requirements;
        let errors = [];
        if (formData.gpa < req.minGPA) errors.push(`Promedio insuficiente (Mín: ${req.minGPA})`);
        if (formData.age > req.maxAge) errors.push(`Edad fuera de rango (Máx: ${req.maxAge})`);
        if (req.maxIncome && formData.income > req.maxIncome) errors.push(`Ingreso familiar excede el límite (Máx: ₡${req.maxIncome.toLocaleString()})`);

        // Regla de Negocio: Marcado automático del sistema
        formData.systemRecommendation = errors.length === 0 ? "Apta" : "No apta";
        formData.status = 'enviada'; // Estado inicial

        if (errors.length > 0) {
            if (!confirm(`El sistema detecta que no cumples con los siguientes requisitos:\n- ${errors.join('\n- ')}\n\n¿Deseas enviar la solicitud de todas formas para revisión manual?`)) {
                return;
            }
        }

        db.addApplication(formData);
        alert("¡Postulación enviada con éxito! Estado: Enviada.");
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
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => evalModal.classList.add('hidden'));

    document.getElementById('btn-review').addEventListener('click', () => finalizeEvaluation('revision'));
    document.getElementById('btn-approve').addEventListener('click', () => finalizeEvaluation('aprobada'));
    document.getElementById('btn-reject').addEventListener('click', () => finalizeEvaluation('rechazada'));

    // Score Calculation Listeners
    ['score-econ', 'score-acad', 'score-social'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                const total = parseInt(document.getElementById('score-econ').value || 0) +
                    parseInt(document.getElementById('score-acad').value || 0) +
                    parseInt(document.getElementById('score-social').value || 0);
                document.getElementById('total-score').value = `${total} puntos`;
            });
        }
    });
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
        const statusMap = {
            'enviada': { label: 'Enviada', class: 'status-pending' },
            'revision': { label: 'En Revisión', class: 'status-warning' },
            'aprobada': { label: 'Aprobada', class: 'status-approved' },
            'rechazada': { label: 'Rechazada', class: 'status-rejected' }
        };
        const status = statusMap[app.status] || { label: app.status, class: 'status-pending' };

        return `
            <tr>
                <td>${app.applicantName}</td>
                <td>${sch ? sch.title : '---'}</td>
                <td>${app.gpa}</td>
                <td><span class="status-badge ${status.class}">${status.label}</span></td>
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
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
                <p><strong>Candidato:</strong> ${app.applicantName}</p>
                <p><strong>Identificación:</strong> ${app.studentId || 'N/A'}</p>
                <p><strong>Ingreso:</strong> ₡${(app.income || 0).toLocaleString()}</p>
                <p><strong>Promedio:</strong> ${app.gpa}</p>
            </div>
            <div style="background: #f1f5f9; padding: 0.8rem; border-radius: 6px; border-left: 4px solid ${app.systemRecommendation === 'Apta' ? '#10b981' : '#ef4444'};">
                <p style="margin:0;"><strong>Sugerencia Sistema:</strong></p>
                <span class="status-badge ${app.systemRecommendation === 'Apta' ? 'status-approved' : 'status-rejected'}">${app.systemRecommendation}</span>
            </div>
        </div>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
        <p><strong>Beca:</strong> ${sch ? sch.title : '---'}</p>
        <p><strong>Motivación:</strong> "${app.motivation}"</p>
    `;

    // Reset/Load evaluation fields
    document.getElementById('score-econ').value = app.scoreEcon || 0;
    document.getElementById('score-acad').value = app.scoreAcad || 0;
    document.getElementById('score-social').value = app.scoreSocial || 0;
    document.getElementById('total-score').value = `${(app.scoreEcon || 0) + (app.scoreAcad || 0) + (app.scoreSocial || 0)} puntos`;
    document.getElementById('eval-observations').value = app.observations || '';

    // Disable buttons if already finalized
    const isFinal = ['aprobada', 'rechazada'].includes(app.status);
    document.getElementById('btn-review').disabled = isFinal;
    document.getElementById('btn-approve').disabled = isFinal;
    document.getElementById('btn-reject').disabled = isFinal;

    evalModal.classList.remove('hidden');
};

function finalizeEvaluation(status) {
    if (currentEvalAppId) {
        const evaluationData = {
            status: status,
            scoreEcon: parseInt(document.getElementById('score-econ').value || 0),
            scoreAcad: parseInt(document.getElementById('score-acad').value || 0),
            scoreSocial: parseInt(document.getElementById('score-social').value || 0),
            observations: document.getElementById('eval-observations').value
        };

        db.updateApplication(currentEvalAppId, evaluationData);
        alert(`Solicitud actualizada a estado: ${status}`);
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

// Gonzalez: Función para redirigir al formulario desde las tarjetas de inicio
window.goToApply = function (scholarshipId) {
    if (!currentUser || currentUser.role !== 'applicant') {
        alert("Solo los postulantes registrados pueden solicitar becas.");
        return;
    }

    const applyLink = Array.from(navLinks).find(l => l.getAttribute('data-target') === 'apply');
    if (applyLink) {
        applyLink.click();

        // Pequeño delay para asegurar que el select se haya poblado
        setTimeout(() => {
            if (scholarshipSelect) {
                scholarshipSelect.value = scholarshipId;
                // Disparar evento change por si hay lógica asociada
                scholarshipSelect.dispatchEvent(new Event('change'));
            }
        }, 100);
    }
};

// Gonzalez: Lógica del Carrusel Hero
// Gonzalez: Lógica del Carrusel Hero
let slideIndex = 0;
let slideInterval;

function setupCarousel() {
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dots = document.querySelectorAll('.carousel-dots .dot');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlides(slideIndex -= 1);
            resetAutoSlide();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlides(slideIndex += 1);
            resetAutoSlide();
        });
    }
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlides(slideIndex = index);
            resetAutoSlide();
        });
    });

    showSlides(slideIndex);
    startAutoSlide();
}

function showSlides(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length === 0) return;

    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        showSlides(slideIndex += 1);
    }, 5000); // Cambia cada 5 segundos
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Inicializar carrusel
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        setupCarousel();
    }, 100);
});
// Gonzalez: Lógica para el Modal de Ayuda y Guía de Pasos
function setupHelpModal() {
    const helpModal = document.getElementById('help-modal');
    const openBtn = document.getElementById('open-help-btn');
    const closeBtn = document.getElementById('close-help-modal');
    const goToGuideBtn = document.getElementById('go-to-guide-btn');
    const understoodBtn = document.getElementById('help-understood-btn');
    const returnToFormBtn = document.getElementById('return-to-form-btn');

    if (openBtn) {
        openBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => helpModal.classList.add('hidden'));
    }
    if (understoodBtn) {
        understoodBtn.addEventListener('click', () => helpModal.classList.add('hidden'));
    }
    if (goToGuideBtn) {
        goToGuideBtn.addEventListener('click', () => {
            helpModal.classList.add('hidden');
            window.switchView('user-guide');
        });
    }
    if (returnToFormBtn) {
        returnToFormBtn.addEventListener('click', () => {
            window.switchView('apply');
        });
    }

    // Lógica visual simple para los pasos
    const formInputs = document.querySelectorAll('#application-form input, #application-form select, #application-form textarea');
    const steps = document.querySelectorAll('.step-item');

    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (input.id === 'scholarship-select') {
                updateStepUI(0);
            } else if (['student-id', 'full-name', 'age', 'phone', 'education'].includes(input.id)) {
                updateStepUI(1);
            } else if (['gpa', 'income', 'motivation'].includes(input.id)) {
                updateStepUI(2);
            }
        });
    });

    function updateStepUI(index) {
        steps.forEach((s, i) => {
            if (i <= index) s.classList.add('active');
            else s.classList.remove('active');
        });
    }
}
