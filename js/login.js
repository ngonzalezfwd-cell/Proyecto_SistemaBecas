/**
 * Lógica para el inicio de sesión.
 * Maneja tanto credenciales quemadas para staff como usuarios registrados.
 */

import { StorageService } from './storage.js';

const db = new StorageService();
const form = document.getElementById('login-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // --- Special Roles Bypass ---
    // Admin
    
    if (email === 'gnaomy276@gmail.com' && password === '123456') {
        const adminUser = { fullName: 'Administrador Principal', email, role: 'admin' };
        localStorage.setItem('edugrant_current_user', JSON.stringify(adminUser));
        alert("¡Bienvenido, Administrador!");
        window.location.href = 'index.html';
        return;
    }

    if (email === 'gnaomy267@gmail.com' && password === '123456') {
        const evalUser = { fullName: 'Evaluador Experto', email, role: 'evaluator' };
        localStorage.setItem('edugrant_current_user', JSON.stringify(evalUser));
        alert("¡Bienvenido, Evaluador!");
        window.location.href = 'index.html';
        return;
    }

    // --- Standard User Check ---
    const users = JSON.parse(localStorage.getItem('edugrant_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Ensure standard users are applicants
        user.role = 'applicant';
        localStorage.setItem('edugrant_current_user', JSON.stringify(user));
        alert(`¡Hola de nuevo, ${user.fullName}!`);
        window.location.href = 'index.html';
    } else {
        alert("Correo o contraseña incorrectos.");
    }
});
