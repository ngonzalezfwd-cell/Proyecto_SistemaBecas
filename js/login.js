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
        messageDiv.textContent = `¡Bienvenido, ${title} ${user.fullName}!`;

        // Disable button to prevent double submit
        document.querySelector('.btn-auth-primary').disabled = true;

        setTimeout(() => {
            window.location.href = '../pages/index.html';
        }, 1500);
    };

    // --- Role Detection by Email Pattern ---
    if (email.includes('admin')) {
        // Mock Admin Login (Accepts any password for demo, or match specific)
        // For security in a real app, validation should be backend-side.
        const adminUser = { fullName: 'Administrador', email, role: 'admin' };
        loginSuccess(adminUser, 'Administrador', 'text-success');
        return;
    }

    if (email.includes('evaluador') || email.includes('evaluator')) {
        const evalUser = { fullName: 'Evaluador', email, role: 'evaluator' };
        loginSuccess(evalUser, 'Evaluador', 'text-success');
        return;
    }

    // --- Standard User Check (Applicants) ---
    const users = JSON.parse(localStorage.getItem('edugrant_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        user.role = 'applicant';
        loginSuccess(user, 'Estudiante', 'text-success');
    } else if (email.endsWith('@gmail.com')) {
        // --- NEW RULE: Any Gmail user can join ---
        // Create an implicit user account
        const implicitUser = {
            id: 'user_' + Date.now(),
            fullName: 'Estudiante ' + email.split('@')[0], // Extract name from email
            email: email,
            role: 'applicant',
            password: password // Keep for session
        };

        // Optionally save them to DB so they persist? User said "puede unirse", implying registration.
        // Let's look up if they exist first (already done), if not, add them.
        users.push(implicitUser);
        localStorage.setItem('edugrant_users', JSON.stringify(users));

        loginSuccess(implicitUser, 'Nuevo Estudiante', 'text-success');
    } else {
        messageDiv.style.color = 'var(--error-color, #ef4444)';
        messageDiv.textContent = "Correo no registrado o contraseña incorrecta.";
    }
});
