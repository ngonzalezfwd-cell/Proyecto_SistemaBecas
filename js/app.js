
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

// --- Filter Logic ---
function initFilters() {
    const btnFilter = document.getElementById('btn-filter');
    const filterProvince = document.getElementById('filter-province');
    const filterInstitution = document.getElementById('filter-institution');
    const filterLevel = document.getElementById('filter-level');

    if (!btnFilter) return;

    const applyFilters = () => {
        const province = filterProvince.value;
        const institution = filterInstitution.value;
        const level = filterLevel.value;

        const allScholarships = db.getScholarships();
        const filtered = allScholarships.filter(s => {
            const matchProv = !province || s.province === province;
            const matchInst = !institution || s.institution === institution;
            const matchLevel = !level || s.educationLevel === level;
            return matchProv && matchInst && matchLevel;
        });

        renderDashboard(filtered);

        // Auto-scroll to results if button clicked
        // document.getElementById('dashboard-view').scrollIntoView({ behavior: 'smooth' });
    };

    btnFilter.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submit if in form
        applyFilters();
        // Optional: Scroll to dashboard
        const dashboard = document.querySelector('.scholarship-grid');
        if (dashboard) dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Optional: Live filter on change (User didn't explicitly ask, but good UX)
    // [filterProvince, filterInstitution, filterLevel].forEach(select => {
    //     select.addEventListener('change', applyFilters);
    // });
}

window.resetFilters = function () {
    document.getElementById('filter-province').value = "";
    document.getElementById('filter-institution').value = "";
    document.getElementById('filter-level').value = "";
    renderDashboard(); // Show all
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    updateUserInterface(); // Set initial state
    renderDashboard(); // Render initial list
    initFilters(); // Setup filters
    setupNavigation();
    setupForm();
    setupViews();
    setupHelpModal();
    injectModal(); // Ensure modal is injected on load
    initFooterTabs(); // Dynamic footer tabs
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

        // Admin sees everything
        if (currentUser.role === 'admin') {
            link.style.display = 'block';
            return;
        }

        // Evaluator sees Evaluations + Standard Views
        if (currentUser.role === 'evaluator') {
            if (target === 'scholarship-management' || target === 'reports') {
                link.style.display = 'none'; // Admin only
            } else {
                link.style.display = 'block'; // Includes evaluations, dashboard, apply, history
            }
            return;
        }

        // Applicant (Standard User)
        if (currentUser.role === 'applicant') {
            if (['scholarship-management', 'reports', 'evaluations'].includes(target)) {
                link.style.display = 'none';
            } else {
                link.style.display = 'block';
            }
        }
    });

    // Special behavior for Hero
    const hero = document.querySelector('.hero-custom'); // Updated class name
    if (hero) {
        // Everyone sees the hero based on current design, or maybe hide for internal roles?
        // User said "admin puede ver absolutamente todo", so let's keep it visible for all for now,
        // or hide it for admin/evaluator if it implies "Dashboard focus".
        // Usually Landing properties are for Applicants.
        // Let's keep it visible for everyone as "Inicio".
        hero.style.display = 'flex';
    }

    // Hide Switch Role Button (Deprecated in favor of login detection)
    if (switchRoleBtn) {
        switchRoleBtn.style.display = 'none';
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

function getProvinceName(code) {
    const map = {
        'sanjose': 'San José',
        'alajuela': 'Alajuela',
        'cartago': 'Cartago',
        'heredia': 'Heredia',
        'guanacaste': 'Guanacaste',
        'puntarenas': 'Puntarenas',
        'limon': 'Limón'
    };
    return map[code] || code;
}

// --- Modal Logic ---
function injectModal() {
    // Check for the new ID to avoid duplicates
    if (document.getElementById('scholarship-details-modal')) return;

    const modalHtml = `
    <div id="scholarship-details-modal" class="modal-overlay" style="z-index: 9999;">
        <div class="modal-content" style="max-height: 85vh; display: flex; flex-direction: column;">
            <div class="modal-header" style="flex-shrink: 0;">
                <div>
                    <h2 id="detail-modal-title">Título de la Beca</h2>
                    <div class="modal-location" id="detail-modal-province">San José</div>
                </div>
                <button class="btn-close-modal" onclick="closeDetailsModal()">&times;</button>
            </div>
            
            <div class="modal-body" style="overflow-y: auto; flex-grow: 1; padding-right: 1.5rem;">
                <!-- Main Info Section -->
                <div class="detail-row">
                    <div class="detail-label">Definición:</div>
                    <div class="detail-value" id="detail-modal-description">Descripción...</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Nivel al que aplica:</div>
                    <div class="detail-value" id="detail-modal-level">Grado</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Porcentaje:</div>
                    <div class="detail-value" id="detail-modal-coverage">100%</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Duración:</div>
                    <div class="detail-value" id="detail-modal-duration">8 semestres</div>
                </div>

                <!-- Extended Information Section (User Requested Slider/Scroll) -->
                <div class="detail-row" style="display: block; border-bottom: 1px solid #f1f5f9; padding-top: 2rem;">
                     <h4 style="color: #475569; margin-bottom: 1rem; font-size: 1rem;">Detalles Adicionales</h4>
                     <div id="detail-modal-extra" style="color: #334155; line-height: 1.8; font-size: 0.95rem;">
                        <!-- Long text will go here -->
                     </div>
                </div>

                <!-- Requirements -->
                <div class="detail-row" style="border-bottom:none;"> 
                    <div class="detail-label">Requisitos:</div>
                    <div class="detail-value" id="detail-modal-requirements">
                        <!-- List injected here -->
                    </div>
                </div>
            </div>

            <div class="modal-footer" style="flex-shrink: 0;">
                <button class="btn-secondary" onclick="closeDetailsModal()" style="margin:0; margin-right: 10px;">Cerrar</button>
                <button id="btn-detail-apply" class="btn-apply-modal">Postular</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Close on click outside
    document.getElementById('scholarship-details-modal').addEventListener('click', (e) => {
        if (e.target.id === 'scholarship-details-modal') closeDetailsModal();
    });
}

window.openModal = function (id) {
    const all = db.getScholarships();
    const sch = all.find(s => s.id === id);
    if (!sch) {
        console.error("No se encontró la beca con ID:", id);
        return;
    }

    // Safety checks
    const safeReq = sch.requirements || { minGPA: 'N/A', maxAge: 'N/A' };
    const safeCoverage = sch.coverage || (sch.amount ? `${sch.amount}` : 'No especificado');
    const safeDuration = sch.duration || 'Según plan de estudios aprobado';

    // Populate new modal IDs
    document.getElementById('detail-modal-title').textContent = sch.title;
    document.getElementById('detail-modal-province').textContent = getProvinceName(sch.province);
    document.getElementById('detail-modal-description').textContent = sch.description || "Descripción no disponible.";

    // Capitalize level
    const levelBase = sch.educationLevel ? (sch.educationLevel.charAt(0).toUpperCase() + sch.educationLevel.slice(1)) : 'No especificado';
    document.getElementById('detail-modal-level').textContent = `${levelBase}. Aplica para estudiantes de nuevo ingreso y regulares.`;

    document.getElementById('detail-modal-coverage').textContent = safeCoverage;
    document.getElementById('detail-modal-duration').textContent = safeDuration;

    // Generate Extra Text to force scroll (Simulated "More Info" requested by user)
    // In a real app, this would be a field in data.js. For now, we simulate it or use description if long.
    // Dynamic Extra Details (Unique per scholarship)
    const extraInfo = sch.extraDetails ? sch.extraDetails : `
        <p>No hay detalles adicionales registrados para esta beca. Por favor consulte directamente con la institución otorgante o revise los requisitos generales.</p>
    `;
    document.getElementById('detail-modal-extra').innerHTML = extraInfo;

    // Requirements
    const reqList = `
        <ul style="padding-left: 1rem; margin: 0;">
            <li>Promedio mínimo: ${safeReq.minGPA}</li>
            <li>Edad máxima: ${safeReq.maxAge} años</li>
            ${safeReq.maxIncome ? `<li>Ingreso familiar máx: ${safeReq.maxIncome}` : ''}
        </ul>
    `;
    document.getElementById('detail-modal-requirements').innerHTML = reqList;

    // Apply Button
    const btnApply = document.getElementById('btn-detail-apply');
    if (btnApply) {
        btnApply.onclick = () => {
            closeDetailsModal();
            goToApply(sch.id);
        };
    }

    const modal = document.getElementById('scholarship-details-modal');
    if (modal) {
        modal.classList.add('active');
    }
};

window.closeDetailsModal = function () {
    const modal = document.getElementById('scholarship-details-modal');
    if (modal) modal.classList.remove('active');
};

function renderDashboard(scholarshipsToRender = null) {
    // Inject modal if not present
    injectModal();

    // --- FORCE DATA REFRESH (Versioning) ---
    const CURRENT_DATA_VERSION = 'v10_details_added';
    const savedVersion = localStorage.getItem('edugrant_data_version');

    if (savedVersion !== CURRENT_DATA_VERSION) {
        console.log("Detectada nueva versión de datos. Actualizando...");
        localStorage.removeItem('edugrant_scholarships'); // Borra datos viejos
        localStorage.setItem('edugrant_data_version', CURRENT_DATA_VERSION); // Guarda nueva versión
        location.reload(); // Recarga para leer de data.js
        return;
    }

    const scholarships = scholarshipsToRender || db.getScholarships();

    if (scholarships.length === 0) {
        scholarshipGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: #64748b;">No se encontraron becas con esos filtros.</p>
                <button class="btn-secondary" onclick="resetFilters()">Ver todas</button>
            </div>
        `;
        return;
    }

    scholarshipGrid.innerHTML = scholarships.map(sch => {
        const deadlineInfo = getDeadlineInfo(sch.deadline);
        const catClass = `cat-${sch.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
        const provinceName = getProvinceName(sch.province);

        return `
        <div class="card scholarship-card" onclick="openModal(${sch.id})" style="cursor: pointer; transition: transform 0.2s;">
            <!-- Image Section -->
            <div style="width: 100%; height: 160px; overflow: hidden; border-radius: 8px 8px 0 0; margin-bottom: 1rem;">
                <img src="${sch.image || '../imgs/default-scholarship.jpg'}" alt="${sch.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>

            <div class="category-tag ${catClass}">${sch.category}</div>
            
            <h3 style="margin-bottom: 0.2rem;">${sch.title}</h3>
            
            <!-- Location Indicator -->
            <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${provinceName}
            </p>

            <p style="
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;  
                overflow: hidden;
                font-size: 0.95rem;
                color: #475569;
                line-height: 1.5;
                height: 4.5em; /* Fallback height */
            ">${sch.description}</p>
            
            <div class="requirements-container">
                <strong>Requisitos:</strong>
                <ul class="requirements-list">
                    <li>Promedio mín: ${sch.requirements.minGPA}</li>
                    <li>Edad máx: ${sch.requirements.maxAge || 'N/A'}</li>
                </ul>
            </div>

            <!-- Footer info -->
            <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-weight: 600; color: var(--primary-color); font-size: 0.95rem;">${sch.amount}</span>
                    ${deadlineInfo ? `<span style="font-size: 0.75rem; color: #64748b;">${deadlineInfo.text}</span>` : ''}
                </div>
                <span 
                    class="btn-text" 
                    onclick="event.stopPropagation(); goToApply(${sch.id});" 
                    style="color: #3b82f6; font-weight: bold; cursor: pointer; font-size: 0.95rem; display: flex; align-items: center; gap: 4px; transition: color 0.2s;"
                    onmouseover="this.style.color='#2563eb'" 
                    onmouseout="this.style.color='#3b82f6'"
                >
                    Postular &rarr;
                </span>
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

    // Disable buttons if already finalized? Only if NOT Admin
    const isFinal = ['aprobada', 'rechazada'].includes(app.status);
    const shouldDisable = isFinal && currentUser.role !== 'admin';

    document.getElementById('btn-review').disabled = shouldDisable;
    document.getElementById('btn-approve').disabled = shouldDisable;
    document.getElementById('btn-reject').disabled = shouldDisable;

    // Admin Delete Button Injection
    const actionsDiv = document.querySelector('#evaluation-modal .modal-actions');
    let deleteBtn = document.getElementById('btn-delete-app');

    if (currentUser.role === 'admin') {
        if (!deleteBtn) {
            deleteBtn = document.createElement('button');
            deleteBtn.id = 'btn-delete-app';
            deleteBtn.className = 'btn-danger';
            deleteBtn.innerText = 'Eliminar';
            deleteBtn.style.background = '#dc2626'; // Darker red to distinguish
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.onclick = () => {
                if (confirm("¿Está seguro de que desea eliminar esta postulación permanentemente? Esta acción no se puede deshacer.")) {
                    db.deleteApplication(currentEvalAppId);
                    evalModal.classList.add('hidden');
                    renderAdminTable();
                    alert("Postulación eliminada del sistema.");
                }
            };
            actionsDiv.appendChild(deleteBtn);
        }
        deleteBtn.style.display = 'inline-block';
    } else {
        if (deleteBtn) deleteBtn.style.display = 'none';
    }

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
        alert(`Solicitud actualizada a estado: ${status.toUpperCase()}`);
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

// --- Footer Logic (Dynamic) ---
const FOOTER_DATA = {
    'San José': {
        address: 'San Pedro, Montes de Oca. Edificio EduGrant, Piso 3.<br><span style="font-size: 0.85rem; color: #64748b;">Bloque 21. Ecocampus.</span>',
        phones: ['(+506) 2234-5678', '(+506) 2234-9900'],
        emails: ['decano.sj@edugrant.cr', 'bienestar.sj@edugrant.cr', 'info@edugrant.cr']
    },
    'Heredia': {
        address: 'Campus Omar Dengo, Frente a Plaza Heredia.<br><span style="font-size: 0.85rem; color: #64748b;">Edificio de Ciencias Sociales, Aula 4.</span>',
        phones: ['(+506) 2277-3000', '(+506) 2277-3500'],
        emails: ['decano.heredia@edugrant.cr', 'bienestar.heredia@edugrant.cr', 'info@edugrant.cr']
    },
    'Alajuela': {
        address: 'Sede Interuniversitaria, Desamparados de Alajuela.<br><span style="font-size: 0.85rem; color: #64748b;">Contiguo a la UTN, Módulo B.</span>',
        phones: ['(+506) 2435-5000', '(+506) 2435-5050'],
        emails: ['decano.alajuela@edugrant.cr', 'bienestar.alajuela@edugrant.cr', 'info@edugrant.cr']
    },
    'Cartago': {
        address: 'Campus Tecnológico Central, Cartago.<br><span style="font-size: 0.85rem; color: #64748b;">Edificio de Vida Estudiantil, 2do Piso.</span>',
        phones: ['(+506) 2550-2000', '(+506) 2550-2200'],
        emails: ['decano.cartago@edugrant.cr', 'bienestar.cartago@edugrant.cr', 'info@edugrant.cr']
    },
    'Puntarenas': {
        address: 'El Roble, Puntarenas. Frente al Liceo.<br><span style="font-size: 0.85rem; color: #64748b;">Sede del Pacífico, Oficina 12.</span>',
        phones: ['(+506) 2661-1000', '(+506) 2661-1500'],
        emails: ['decano.puntarenas@edugrant.cr', 'bienestar.puntarenas@edugrant.cr', 'info@edugrant.cr']
    }
};

function initFooterTabs() {
    const tabs = document.querySelectorAll('.footer-tab');

    // Default load (San José)
    updateFooterContent('San José');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');
            // Update content
            updateFooterContent(tab.textContent.trim());
        });
    });
}

function updateFooterContent(provinceName) {
    const data = FOOTER_DATA[provinceName];
    if (!data) return;

    const locContainer = document.getElementById('footer-location');
    const phoneContainer = document.getElementById('footer-phones');
    const emailContainer = document.getElementById('footer-emails');

    if (locContainer) locContainer.innerHTML = `<p>${data.address}</p>`;

    if (phoneContainer) {
        phoneContainer.innerHTML = data.phones.map(p => `<p>${p}</p>`).join('');
    }

    if (emailContainer) {
        emailContainer.innerHTML = data.emails.map(e => `<p>${e}</p>`).join('');
    }
}
