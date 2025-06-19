/**
 * FUNCIONALIDADES COMPARTIDAS ENTRE PÁGINAS
 * 
 * 1. Manejo del menú hamburguesa
 * 2. Funciones de utilidad comunes
 * 3. Inicializaciones compartidas
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== MANEJO DEL MENÚ HAMBURGUESA =====
    const menuBtn = document.querySelector('.menu-hamburguesa');
    const menuNav = document.querySelector('.menu-navegacion');
    
    if (menuBtn && menuNav) {
        menuBtn.addEventListener('click', function() {
            // Alternar estado del menú
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            menuNav.classList.toggle('activo');
            
            // Animación de hamburguesa a X
            this.classList.toggle('abierto');
        });
        
        // Cerrar menú al hacer clic en enlace (solo en móvil)
        const navLinks = document.querySelectorAll('.menu-navegacion a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    menuNav.classList.remove('activo');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    menuBtn.classList.remove('abierto');
                }
            });
        });
    }
    
    // ===== AJUSTE RESPONSIVO DEL MENÚ =====
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            // En desktop, asegurar que el menú esté cerrado
            if (menuNav) menuNav.classList.remove('activo');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.classList.remove('abierto');
            }
        }
    });
    
    // ===== FUNCIONES DE UTILIDAD =====
    
    /**
     * Carga un archivo JSON desde el servidor
     * @param {string} url - Ruta al archivo JSON
     * @returns {Promise} - Promesa con los datos
     */
    window.cargarJSON = async function(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error al cargar JSON:', error);
            return null;
        }
    };
    
    /**
     * Formatea una fecha a formato legible
     * @param {string} fechaStr - Cadena de fecha
     * @returns {string} - Fecha formateada
     */
    window.formatearFecha = function(fechaStr) {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaStr).toLocaleDateString('es-PE', opciones);
    };
});