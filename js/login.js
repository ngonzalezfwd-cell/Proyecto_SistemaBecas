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

    // --- Standard User Check (Applicants, Admin, Evaluators) ---
    const users = JSON.parse(localStorage.getItem('edugrant_users') || '[]');
    const user = users.find(u => u.email === email);

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
        // User not found in localStorage
        messageDiv.style.color = 'var(--error-color, #ef4444)';
        messageDiv.textContent = "Esta cuenta no está registrada. Por favor regístrese primero.";
    }
});
