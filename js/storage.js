
import { SCHOLARSHIPS, MOCK_APPLICATIONS } from './data.js';

const KEY_APPLICATIONS = 'edugrant_applications';
const KEY_SCHOLARSHIPS = 'edugrant_scholarships';
const KEY_INIT = 'edugrant_initialized';

export class StorageService {

    constructor() {
        this.init();
    }

    init() {
        const hasInit = localStorage.getItem(KEY_INIT);
        const storedSch = JSON.parse(localStorage.getItem(KEY_SCHOLARSHIPS) || "[]");

        // Si no hay datos o si hemos agregado nuevas becas por defecto en data.js
        if (!hasInit || storedSch.length < SCHOLARSHIPS.length) {
            console.log("Actualizando catálogo de becas...");

            // Mantenemos las becas que el usuario haya podido crear manualmente,
            // pero nos aseguramos de que las 'default' de data.js estén presentes.
            const mergedScholarships = [...SCHOLARSHIPS];

            // Si el usuario ya tenía becas custom (con IDs altos), las preservamos
            storedSch.forEach(s => {
                if (!mergedScholarships.find(ms => ms.id === s.id)) {
                    mergedScholarships.push(s);
                }
            });

            localStorage.setItem(KEY_SCHOLARSHIPS, JSON.stringify(mergedScholarships));
            if (!localStorage.getItem(KEY_APPLICATIONS)) {
                localStorage.setItem(KEY_APPLICATIONS, JSON.stringify(MOCK_APPLICATIONS));
            }
            localStorage.setItem(KEY_INIT, 'true');
        }
    }

    // --- Scholarship Management (Admin) ---
    getScholarships() {
        const data = localStorage.getItem(KEY_SCHOLARSHIPS);
        return data ? JSON.parse(data) : [];
    }

    addScholarship(scholarship) {
        const list = this.getScholarships();
        list.push(scholarship);
        localStorage.setItem(KEY_SCHOLARSHIPS, JSON.stringify(list));
    }

    updateScholarship(id, updatedData) {
        const list = this.getScholarships();
        const index = list.findIndex(s => s.id === id);
        if (index !== -1) {
            list[index] = { ...list[index], ...updatedData };
            localStorage.setItem(KEY_SCHOLARSHIPS, JSON.stringify(list));
            return true;
        }
        return false;
    }

    deleteScholarship(id) {
        const list = this.getScholarships();
        const newList = list.filter(s => s.id !== id);
        localStorage.setItem(KEY_SCHOLARSHIPS, JSON.stringify(newList));
    }

    // --- Application Management ---
    getApplications() {
        const data = localStorage.getItem(KEY_APPLICATIONS);
        return data ? JSON.parse(data) : [];
    }

    getUserApplications(email) {
        const apps = this.getApplications();
        return apps.filter(a => a.applicantEmail === email);
    }

    addApplication(application) {
        const apps = this.getApplications();
        apps.unshift(application);
        localStorage.setItem(KEY_APPLICATIONS, JSON.stringify(apps));
    }

    updateApplication(appId, updatedData) {
        const apps = this.getApplications();
        const appIndex = apps.findIndex(a => a.id === appId);
        if (appIndex !== -1) {
            apps[appIndex] = { ...apps[appIndex], ...updatedData };
            localStorage.setItem(KEY_APPLICATIONS, JSON.stringify(apps));
            return true;
        }
        return false;
    }

    deleteApplication(id) {
        const apps = this.getApplications();
        const newApps = apps.filter(a => a.id !== id);
        localStorage.setItem(KEY_APPLICATIONS, JSON.stringify(newApps));
    }

    getStats() {
        const apps = this.getApplications();
        return {
            total: apps.length,
            pending: apps.filter(a => a.status === 'pending' || a.status === 'enviada').length,
            approved: apps.filter(a => a.status === 'approved' || a.status === 'aprobada').length,
            rejected: apps.filter(a => a.status === 'rejected' || a.status === 'rechazada').length
        };
    }
}
