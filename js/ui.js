/**
 * UI Interactions
 * Gonzalez hizo tal cambio: Implementación de efecto scroll en navbar y lógica visual.
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');

    function updateNavbar() {
        const isDashboard = document.getElementById('dashboard').classList.contains('active');
        const isScrolled = window.scrollY > 50;

        if (!isDashboard || isScrolled) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Escuchar scroll
    window.addEventListener('scroll', updateNavbar);

    // Escuchar cambios de vista (usando un MutationObserver para detectar cambios en las clases de las vistas)
    const observer = new MutationObserver(updateNavbar);
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        observer.observe(view, { attributes: true, attributeFilter: ['class'] });
    });

    // Ejecución inicial
    updateNavbar();
});
