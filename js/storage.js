
import { SCHOLARSHIPS, MOCK_APPLICATIONS } from './data.js';

const KEY_APPLICATIONS = 'edugrant_applications';
const KEY_SCHOLARSHIPS = 'edugrant_scholarships';
const KEY_INIT = 'edugrant_initialized';

export class StorageService {

    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem(KEY_INIT)) {
            console.log("Seeding initial data...");
            localStorage.setItem(KEY_SCHOLARSHIPS, JSON.stringify(SCHOLARSHIPS));
            localStorage.setItem(KEY_APPLICATIONS, JSON.stringify(MOCK_APPLICATIONS));
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
}
