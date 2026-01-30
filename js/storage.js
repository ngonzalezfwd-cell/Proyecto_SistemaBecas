
import { SCHOLARSHIPS, MOCK_APPLICATIONS } from './data.js';

const KEY_APPLICATIONS = 'edugrant_applications';
const KEY_INIT = 'edugrant_initialized';

export class StorageService {

    constructor() {

        this.init();
    }

    init() {
        
        if (!localStorage.getItem(KEY_INIT)) {
            // Seed initial data
            console.log("Seeding initial data...");
            localStorage.setItem(KEY_APPLICATIONS, JSON.stringify(MOCK_APPLICATIONS));
            localStorage.setItem(KEY_INIT, 'true');
        }
    }

    getScholarships() {
        return SCHOLARSHIPS;
    }

    getApplications() {
        const data = localStorage.getItem(KEY_APPLICATIONS);
        return data ? JSON.parse(data) : [];
    }

    addApplication(application) {
        const apps = this.getApplications();
        apps.unshift(application); // Add to top
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
