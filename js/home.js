/**
 * FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA HOME
 * 
 * 1. Manejo del video hero (fallback)
 * 2. Animaciones específicas
 * 3. Formulario de contacto
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== MANEJO DEL VIDEO HERO =====
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Verificar si el video puede reproducirse
        heroVideo.addEventListener('error', function() {
            this.classList.add('no-video');
        });
        
        // Alternativa para algunos navegadores móviles
        if (heroVideo.readyState > 0) {
            const isPlaying = heroVideo.currentTime > 0 && !heroVideo.paused && 
                            !heroVideo.ended && heroVideo.readyState > 2;
            
            if (!isPlaying) {
                heroVideo.classList.add('no-video');
            }
        }
    }
    
    // ===== FORMULARIO DE CONTACTO =====
    const formularioContacto = document.querySelector('.formulario-contacto');
    
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí iría el código para enviar el formulario
            // Por ahora solo mostraremos un mensaje
            alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
            this.reset();
        });
    }
    
    // ===== ANIMACIONES DE SCROLL =====
    // Podemos añadir animaciones cuando los elementos son visibles
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar las secciones que queremos animar
    document.querySelectorAll('.seccion').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});