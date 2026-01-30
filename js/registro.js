// JS Logic for Registration
import { StorageService } from './storage.js';

const db = new StorageService();
const form = document.getElementById('register-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('reg-fullname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const role = document.getElementById('reg-role').value;

    // Restricted Emails
    const restrictedEmails = ['gnaomy276@gmail', 'tormentionrex@gmail.com'];
    if (restrictedEmails.includes(email.toLowerCase())) {
        alert("Este correo está reservado para uso del sistema.");
        return;
    }

    // Basic Validation
    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Check if user already exists (Simulation)
    const users = JSON.parse(localStorage.getItem('edugrant_users') || '[]');
    if (users.find(u => u.email === email)) {
        alert("El correo electrónico ya está registrado.");
        return;
    }

    // Save User Data (Simulation)
    const newUser = {
        id: 'user_' + Date.now(),
        fullName,
        email,
        password, // In a real app, never store plain text passwords
        role,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('edugrant_users', JSON.stringify(users));

    alert("¡Registro exitoso! Redirigiendo al inicio...");

    // Redirect to login (both in Html folder)
    window.location.href = 'login.html';
});
