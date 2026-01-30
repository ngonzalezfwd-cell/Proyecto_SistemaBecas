
import { SCHOLARSHIPS, MOCK_APPLICATIONS } from './data.js';

const KEY_APPLICATIONS = 'edugrant_applications';
const KEY_SCHOLARSHIPS = 'edugrant_scholarships';
const KEY_USERS = 'edugrant_users';
const KEY_INIT = 'edugrant_initialized';

/**
 * Servicio de Almacenamiento: Centraliza todas las interacciones con LocalStorage.
 */
export class StorageService {

    constructor() {
        this.init();
    }

    init() {
        // Enforce re-seed to apply enriched data structure (type, dates, status)
        const currentVersion = 'v2_enriched';
        const storageVersion = localStorage.getItem('edugrant_version');

        if (!localStorage.getItem(KEY_INIT) || storageVersion !== currentVersion) {
            console.log("Seeding initial data...");
            localStorage.setItem(KEY_SCHOLARSHIPS, JSON.stringify(SCHOLARSHIPS));
            localStorage.setItem(KEY_APPLICATIONS, JSON.stringify(MOCK_APPLICATIONS));
            localStorage.setItem(KEY_INIT, 'true');
            localStorage.setItem('edugrant_version', currentVersion);
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

    updateStatus(appId, newStatus) {
        const apps = this.getApplications();
        const appIndex = apps.findIndex(a => a.id === appId);
        if (appIndex !== -1) {
            apps[appIndex].status = newStatus;
            localStorage.setItem(KEY_APPLICATIONS, JSON.stringify(apps));
            return true;
        }
        return false;
    }

    getStats() {
        const apps = this.getApplications();
        return {
            total: apps.length,
            pending: apps.filter(a => a.status === 'pending').length,
            approved: apps.filter(a => a.status === 'approved').length,
            rejected: apps.filter(a => a.status === 'rejected').length
        };
    }

    // --- User/Evaluator Management (Admin) ---
    getUsers() {
        const data = localStorage.getItem(KEY_USERS);
        return data ? JSON.parse(data) : [];
    }

    getEvaluators() {
        const users = this.getUsers();
        return users.filter(u => u.role === 'evaluator');
    }

    addEvaluator(evaluator) {
        const users = this.getUsers();
        evaluator.role = 'evaluator';
        users.push(evaluator);
        localStorage.setItem(KEY_USERS, JSON.stringify(users));
    }

    deleteEvaluator(email) {
        const users = this.getUsers();
        const newUsers = users.filter(u => !(u.email === email && u.role === 'evaluator'));
        localStorage.setItem(KEY_USERS, JSON.stringify(newUsers));
    }
}
