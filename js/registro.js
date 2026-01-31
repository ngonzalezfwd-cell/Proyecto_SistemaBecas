// JS Logic for Registration
import { StorageService } from './storage.js';

const db = new StorageService();
const form = document.getElementById('register-form');




// Setup Dynamic Role Visibility
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('reg-email');
    const roleContainer = document.querySelector('#reg-role').closest('.form-group'); // Get parent div
    const roleSelect = document.getElementById('reg-role');

    // Init: Hide by default
    roleContainer.style.display = 'none';

    emailInput.addEventListener('input', (e) => {
        const email = e.target.value.toLowerCase();

        // Reset options visibility (re-build options)
        roleSelect.innerHTML = ''; // Clear

        if (email.includes('admin')) {
            // Admin sees ALL: Student, Evaluator, Admin
            roleContainer.style.display = 'block';
            addOption(roleSelect, 'applicant', 'Estudiante / Postulante');
            addOption(roleSelect, 'evaluator', 'Evaluador de Becas');
            addOption(roleSelect, 'admin', 'Administrador de Becas');
            roleSelect.value = 'admin'; // Auto-select helpful
        }
        else if (email.includes('evaluador') || email.includes('evaluator')) {
            // Evaluator sees: Student, Evaluator
            roleContainer.style.display = 'block';
            addOption(roleSelect, 'applicant', 'Estudiante / Postulante');
            addOption(roleSelect, 'evaluator', 'Evaluador de Becas');
            roleSelect.value = 'evaluator';
        }
        else {
            // Student: Hidden
            roleContainer.style.display = 'none';
            // Default select value to applicant just in case it's submitted
            addOption(roleSelect, 'applicant', 'Estudiante / Postulante');
        }
    });

    function addOption(select, value, text) {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = text;
        select.appendChild(opt);
    }
});

// Re-attach submit handler properly
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('reg-fullname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    const roleSelect = document.getElementById('reg-role');
    // If hidden, force 'applicant'. If visible, take value.
    const isVisible = roleSelect.closest('.form-group').style.display !== 'none';
    const role = isVisible ? roleSelect.value : 'applicant';

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
