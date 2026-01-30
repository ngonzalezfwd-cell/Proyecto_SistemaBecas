// JS Logic for Login
import { StorageService } from './storage.js';

const db = new StorageService();
const form = document.getElementById('login-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Get users from localStorage (Simulation)
    const users = JSON.parse(localStorage.getItem('edugrant_users') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Save current user for the session (Simulation)
        localStorage.setItem('edugrant_current_user', JSON.stringify(user));
        
        alert(`¡Bienvenido de nuevo, ${user.fullName}!`);
        
        // Redirect to main app
        window.location.href = 'index.html';
    } else {
        alert("Correo o contraseña incorrectos.");
    }
});
