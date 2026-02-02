// JS Logic for Login
import { StorageService } from './storage.js';

const db = new StorageService();
const form = document.getElementById('login-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.toLowerCase();
    const password = document.getElementById('login-password').value;
    const messageDiv = document.getElementById('login-message');

    // Helper to handle login success
    const loginSuccess = (user, title, colorClass) => {
        localStorage.setItem('edugrant_current_user', JSON.stringify(user));

        messageDiv.style.color = 'var(--success-color, #10b981)'; // Green

        let welcomeName = user.fullName;
        if (user.role === 'admin') welcomeName = 'Administrador';
        if (user.role === 'evaluator') welcomeName = 'Evaluador';

        messageDiv.textContent = `¡Bienvenido, ${welcomeName}!`;

        // Disable button to prevent double submit
        document.querySelector('.btn-auth-primary').disabled = true;

        setTimeout(() => {
            window.location.href = '../pages/index.html';
        }, 1500);
    };

    // --- Standard User Check (Applicants, Admin, Evaluators) ---
    const users = JSON.parse(localStorage.getItem('edugrant_users') || '[]');
    const user = users.find(u => u.email === email);

    // --- GOLDEN RULE EXCEPTIONS (Cuentas de Prueba) ---

    // 1. Admin Exception: admin@admin.com (Any password)
    if (email === 'admin@admin.com') {
        const adminUser = user || { id: 'admin_test', fullName: 'Administrador', email, role: 'admin' };
        loginSuccess(adminUser, 'Administrador', 'text-success');
        return;
    }

    // 2. Evaluator Exception: tormentionrex@evaluador.com (Password: undertale)
    if (email === 'tormentionrex@evaluador.com' && password === 'undertale') {
        const evalUser = user || { id: 'eval_test', fullName: 'Evaluador', email, role: 'evaluator' };
        loginSuccess(evalUser, 'Evaluador', 'text-success');
        return;
    }

    // --- Regular User Check (Must be registered in localStorage) ---
    if (user) {
        if (user.password === password) {
            // Determine role title for the welcome message
            let roleTitle = 'Estudiante';
            if (user.role === 'admin') roleTitle = 'Administrador';
            if (user.role === 'evaluator') roleTitle = 'Evaluador';

            loginSuccess(user, roleTitle, 'text-success');
        } else {
            messageDiv.style.color = 'var(--error-color, #ef4444)';
            messageDiv.textContent = "Contraseña incorrecta. Por favor intente de nuevo.";
        }
    } else {
        // User not found in localStorage and doesn't match specific test accounts
        messageDiv.style.color = 'var(--error-color, #ef4444)';
        messageDiv.textContent = "Esta cuenta no está registrada. Por favor regístrese primero.";
    }
});
