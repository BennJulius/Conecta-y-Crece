/**
 * FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA TALLERES
 * 
 * 1. Sección "¿Quiénes pueden usarlas?"
 * 2. Tarjetas emocionales
 * 3. Semáforo del estrés
 * 4. Muro de frases incompletas
 * 5. Actividad anti-estrés (dado virtual)
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== SECCIÓN "¿QUIÉNES PUEDEN USARLAS?" =====
    const usuarios = [
        {
            nombre: "Familias",
            img: "img/usuarios/familias.jpg",
            desc: "Padres, madres y tutores que buscan herramientas para prevenir el consumo de alcohol en adolescentes"
        },
        {
            nombre: "Psicólogos",
            img: "img/usuarios/psicologos.jpg",
            desc: "Profesionales que trabajan con adolescentes y necesitan recursos para sus sesiones"
        },
        {
            nombre: "Grupos de apoyo",
            img: "img/usuarios/grupos.jpg",
            desc: "Comunidades que brindan soporte emocional y orientación"
        },
        {
            nombre: "Docentes",
            img: "img/usuarios/docentes.jpg",
            desc: "Educadores que desean abordar el tema en las aulas"
        },
        {
            nombre: "Adolescentes",
            img: "img/usuarios/adolescentes.jpg",
            desc: "Jóvenes que buscan herramientas para manejar la presión social"
        }
    ];

    // Modificar la generación de usuarios
    const listaUsuarios = document.getElementById('lista-usuarios');
        
    if (listaUsuarios) {
        usuarios.forEach(usuario => {
            const usuarioHTML = `
                <div class="usuario-item-mejorado">
                    <div class="usuario-texto">
                        <h3>${usuario.nombre}</h3>
                        <p>${usuario.desc}</p>
                    </div>
                    <div class="usuario-imagen">
                        <img src="${usuario.img}" alt="${usuario.nombre}">
                    </div>
                </div>
            `;
            listaUsuarios.insertAdjacentHTML('beforeend', usuarioHTML);
        });
    }

    // ===== TARJETAS EMOCIONALES CON PREVISUALIZACIÓN DE PDF =====
    const tarjetas = [
        {
            texto: "¿Cuándo fue la última vez que reíste mucho?",
            pdf: "tarjeta-1.pdf"
        },
        {
            texto: "¿Qué te gustaría hacer más seguido con tu familia?",
            pdf: "tarjeta-2.pdf"
        },
        {
            texto: "¿Te cuesta decir lo que sientes cuando estás mal? ¿Por qué?",
            pdf: "tarjeta-3.pdf"
        },
        {
            texto: "¿A quién acudes cuando necesitas apoyo?",
            pdf: "tarjeta-4.pdf"
        },
        {
            texto: "¿Te resulta fácil pedir perdón? ¿Por qué sí o no?",
            pdf: "tarjeta-5.pdf"
        },
        {
            texto: "¿Qué te gustaría cambiar o mejorar en la comunicación en casa?",
            pdf: "tarjeta-6.pdf"
        }
    ];

    const gridTarjetas = document.getElementById('grid-tarjetas');

    if (gridTarjetas) {
        tarjetas.forEach((tarjeta, index) => {
            const tarjetaHTML = `
                <div class="tarjeta" data-pdf="${tarjeta.pdf}">
                    <p>${tarjeta.texto}</p>
                    
                    <!-- Previsualización PDF (contenedor) -->
                    <div class="pdf-preview-container" id="preview-${index}">
                        <canvas class="pdf-preview-canvas"></canvas>
                    </div>
                    
                    <!-- Botón de descarga -->
                    <a href="recursos/tarjetas-emocionales/${tarjeta.pdf}" class="btn-descarga" download>
                        <i class="fas fa-download"></i> Descargar
                    </a>
                    
                    <!-- Botón para mostrar/ocultar PDF -->
                    <button class="btn-toggle-preview" data-target="preview-${index}">
                        <i class="fas fa-eye"></i> Ver PDF
                    </button>
                </div>
            `;
            gridTarjetas.insertAdjacentHTML('beforeend', tarjetaHTML);
            
            // Cargar PDF después de crear la tarjeta
            cargarMiniaturaPDF(tarjeta.pdf, `preview-${index}`);
        });
    }

    /**
     * Renderiza una miniatura del PDF en el contenedor especificado
     * @param {string} pdfFile - Nombre del archivo PDF
     * @param {string} containerId - ID del contenedor donde renderizar
     */
    async function cargarMiniaturaPDF(pdfFile, containerId) {
        try {
            const pdfPath = `recursos/tarjetas-emocionales/${pdfFile}`;
            const loadingTask = pdfjsLib.getDocument(pdfPath);
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            
            // Ajustar vista para miniatura
            const viewport = page.getViewport({ scale: 0.5 });
            const canvas = document.querySelector(`#${containerId} canvas`);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            }).promise;
            
        } catch (error) {
            console.error(`Error al cargar PDF ${pdfFile}:`, error);
        }
    }

    // Eventos para mostrar/ocultar previsualización
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-toggle-preview')) {
            const btn = e.target.closest('.btn-toggle-preview');
            const targetId = btn.dataset.target;
            const preview = document.getElementById(targetId);
            
            preview.classList.toggle('visible');
            btn.innerHTML = preview.classList.contains('visible') ? 
                '<i class="fas fa-eye-slash"></i> Ocultar PDF' : 
                '<i class="fas fa-eye"></i> Ver PDF';
        }
    });

    // ===== SEMÁFORO DEL ESTRÉS =====
    const luces = document.querySelectorAll('.luz');
    const estadoDisplay = document.getElementById('estado-semaforo');
    const recomendacionesDiv = document.getElementById('recomendaciones');
    const body = document.body;
    let audioRelajacion = null;
    
    if (luces.length > 0) {
        // Configurar recomendaciones para cada estado
        const recomendaciones = {
            rojo: [
                "Respira profundamente 5 veces",
                "Toma un descanso de 5 minutos",
                "Escucha música relajante",
                "Bebe un poco de agua"
            ],
            amarillo: [
                "Identifica qué te está estresando",
                "Habla con alguien sobre cómo te sientes",
                "Haz algunos estiramientos",
                "Escribe tus pensamientos en un papel"
            ],
            verde: [
                "¡Mantén esa actitud positiva!",
                "Comparte tu energía con los demás",
                "Aprovecha para hacer algo productivo",
                "Disfruta del momento"
            ]
        };
        
        luces.forEach(luz => {
            luz.addEventListener('click', function() {
                // Remover clase activa de todas las luces
                luces.forEach(l => l.classList.remove('activa'));
                
                // Activar la luz seleccionada
                this.classList.add('activa');
                
                // Mostrar estado
                const estado = this.dataset.estado;
                estadoDisplay.textContent = estado;
                
                // Mostrar recomendaciones
                let color = this.classList.contains('rojo') ? 'rojo' : 
                          this.classList.contains('amarillo') ? 'amarillo' : 'verde';
                
                let htmlRecomendaciones = '<h4>Recomendaciones:</h4><ul>';
                recomendaciones[color].forEach(item => {
                    htmlRecomendaciones += `<li>${item}</li>`;
                });
                htmlRecomendaciones += '</ul>';
                recomendacionesDiv.innerHTML = htmlRecomendaciones;
                
                // Si es rojo, activar modo relajación
                if (color === 'rojo') {
                    body.classList.add('modo-relajacion');
                    
                    // Reproducir sonido relajante (opcional)
                    if (!audioRelajacion) {
                        audioRelajacion = new Audio('sounds/relajacion.mp3');
                        audioRelajacion.loop = true;
                    }
                    audioRelajacion.play();
                } else {
                    body.classList.remove('modo-relajacion');
                    if (audioRelajacion) {
                        audioRelajacion.pause();
                    }
                }
            });
            
            // Efecto hover
            luz.addEventListener('mouseenter', function() {
                if (!this.classList.contains('activa')) {
                    this.style.opacity = 'scale(1.05)';
                }
            });
            
            luz.addEventListener('mouseleave', function() {
                if (!this.classList.contains('activa')) {
                    this.style.opacity = 'scale(1)';
                }
            });
        });

        // Control de sonido del semáforo
        const toggleSonidoBtn = document.getElementById('toggle-sonido');
        let sonidoActivado = true;

        if (toggleSonidoBtn) {
            toggleSonidoBtn.addEventListener('click', function() {
                sonidoActivado = !sonidoActivado;
                
                if (sonidoActivado) {
                    this.innerHTML = '<i class="fas fa-volume-up"></i> Silenciar';
                    if (audioRelajacion) audioRelajacion.volume = 1;
                } else {
                    this.innerHTML = '<i class="fas fa-volume-mute"></i> Activar sonido';
                    if (audioRelajacion) audioRelajacion.volume = 0;
                }
            });
        }
    }

    // ===== MURO DE FRASES INCOMPLETAS =====
    const frases = [
        {
            texto: "Hoy me sentí <input type='text' class='input-frase' data-id='1-1'> cuando <input type='text' class='input-frase' data-id='1-2'>.",
            id: "1"
        },
        {
            texto: "Me hace sentir bien cuando alguien me dice <input type='text' class='input-frase' data-id='2'>.",
            id: "2"
        },
        {
            texto: "Cuando alguien me interrumpe yo <input type='text' class='input-frase' data-id='3'>.",
            id: "3"
        },
        {
            texto: "Una emoción que no me gusta sentir es <input type='text' class='input-frase' data-id='4-1'> porque <input type='text' class='input-frase' data-id='4-2'>.",
            id: "4"
        },
        {
            texto: "Si mi emoción de hoy fuera un color, sería <input type='text' class='input-frase' data-id='5'>.",
            id: "5"
        },
        {
            texto: "Un lugar donde me siento seguro(a) es <input type='text' class='input-frase' data-id='6'>.",
            id: "6"
        }
    ];

    const frasesContainer = document.getElementById('frases-container');
    const guardarBtn = document.getElementById('guardar-frases');
    const verInformeBtn = document.getElementById('ver-informe');
    const informeDiv = document.getElementById('informe');
    let respuestas = {};
    
    if (frasesContainer) {
        // Cargar respuestas guardadas si existen
        if (localStorage.getItem('frasesIncompletas')) {
            respuestas = JSON.parse(localStorage.getItem('frasesIncompletas'));
        }
        
        // Generar frases en el DOM
        frases.forEach(frase => {
            const fraseHTML = `
                <div class="frase" data-id="${frase.id}">
                    <p>${frase.texto}</p>
                </div>
            `;
            frasesContainer.insertAdjacentHTML('beforeend', fraseHTML);
        });
        
        // Rellenar inputs con respuestas guardadas
        if (Object.keys(respuestas).length > 0) {
            const inputs = document.querySelectorAll('.input-frase');
            inputs.forEach(input => {
                if (respuestas[input.dataset.id]) {
                    input.value = respuestas[input.dataset.id];
                }
            });
        }
        
        // Guardar respuestas
        guardarBtn.addEventListener('click', function() {
            const inputs = document.querySelectorAll('.input-frase');
            inputs.forEach(input => {
                respuestas[input.dataset.id] = input.value;
            });
            
            localStorage.setItem('frasesIncompletas', JSON.stringify(respuestas));
            alert('Tus respuestas han sido guardadas.');
        });
        
        // Mostrar/ocultar informe
        verInformeBtn.addEventListener('click', function() {
            if (informeDiv.style.display === 'none' || !informeDiv.style.display) {
                generarInforme();
                informeDiv.style.display = 'block';
                this.textContent = 'Ocultar Informe';
            } else {
                informeDiv.style.display = 'none';
                this.textContent = 'Ver Mi Informe';
            }
        });
        
        // Función para generar el informe
        function generarInforme() {
            let html = '<h3>Mi Informe de Frases</h3>';
            
            // Frase 1
            if (respuestas['1-1'] || respuestas['1-2']) {
                html += `<p>Hoy me sentí <strong>${respuestas['1-1'] || '______'}</strong> cuando <strong>${respuestas['1-2'] || '______'}</strong>.</p>`;
            }
            
            // Frase 2
            if (respuestas['2']) {
                html += `<p>Me hace sentir bien cuando alguien me dice <strong>${respuestas['2']}</strong>.</p>`;
            }
            
            // Frase 3
            if (respuestas['3']) {
                html += `<p>Cuando alguien me interrumpe yo <strong>${respuestas['3']}</strong>.</p>`;
            }
            
            // Frase 4
            if (respuestas['4-1'] || respuestas['4-2']) {
                html += `<p>Una emoción que no me gusta sentir es <strong>${respuestas['4-1'] || '______'}</strong> porque <strong>${respuestas['4-2'] || '______'}</strong>.</p>`;
            }
            
            // Frase 5
            if (respuestas['5']) {
                html += `<p>Si mi emoción de hoy fuera un color, sería <strong>${respuestas['5']}</strong>.</p>`;
            }
            
            // Frase 6
            if (respuestas['6']) {
                html += `<p>Un lugar donde me siento seguro(a) es <strong>${respuestas['6']}</strong>.</p>`;
            }
            
            informeDiv.innerHTML = html;
        }
    }

    // ===== ACTIVIDAD ANTI-ESTRÉS (DADO VIRTUAL) =====
    const dado = document.getElementById('dado');
    const lanzarBtn = document.getElementById('lanzar-dado');
    const accionDiv = document.getElementById('accion-dado');
    
    if (dado && lanzarBtn) {
        const acciones = [
            "Abrazar al de tu costado",
            "Ponerte en cuclillas",
            "Saltar",
            "Bailar",
            "Parate y alzar los brazos",
            "Pararte con los brazos extendidos"
        ];
        
        lanzarBtn.addEventListener('click', function() {
            // Deshabilitar botón durante la animación
            this.disabled = true;
            accionDiv.textContent = "";
            
            // Animación de giro
            let giros = 0;
            const animacion = setInterval(() => {
                const rotX = Math.random() * 360;
                const rotY = Math.random() * 360;
                const rotZ = Math.random() * 360;
                dado.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
                giros++;
                
                if (giros > 20) {
                    clearInterval(animacion);
                    mostrarResultado();
                    this.disabled = false;
                }
            }, 100);
        });
        
        // En la función mostrarResultado del dado
        function mostrarResultado() {
            const resultado = Math.floor(Math.random() * 6) + 1;
            const rotaciones = [
                {x: 0, y: 0},    // Cara 1
                {x: 0, y: 180},  // Cara 2
                {x: 0, y: 90},   // Cara 3
                {x: 0, y: -90},  // Cara 4
                {x: 90, y: 0},   // Cara 5
                {x: -90, y: 0}   // Cara 6
            ];
            
            dado.style.transition = 'transform 0.8s cubic-bezier(0.17, 0.84, 0.44, 1)';
            dado.style.transform = `rotateX(${rotaciones[resultado-1].x}deg) rotateY(${rotaciones[resultado-1].y}deg)`;
            
            accionDiv.innerHTML = `
                <h4>¡Acción Anti-Estrés!</h4>
                <p><strong>‎                               ${acciones[resultado-1]}</strong></p>
            `;
            
            const audio = new Audio('sounds/dado.mp3');
            audio.volume = 0.3;
            audio.play();
        }
    }
});

