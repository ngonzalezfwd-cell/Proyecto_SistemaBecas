/**
 * UI Interactions
 * Gonzalez hizo tal cambio: Implementación de efecto scroll en navbar y lógica visual.
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});
