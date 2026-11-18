// Navegación suave con soporte nativo y compatibilidad.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animaciones de entrada progresivas (degradación limpia sin IntersectionObserver).
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                instance.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.featured-card, .gallery-item, .timeline-item, .video-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// Manejo del formulario
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const type = document.getElementById('tipo').value;
        const message = document.getElementById('mensaje').value;
        
        const emailTo = 'historiascouthn@gmail.com';
        const subject = encodeURIComponent(`Contacto Historias Scouts: ${type}`);
        const body = encodeURIComponent(`Nombre: ${name}\nCorreo de contacto: ${email}\n\nMensaje:\n${message}`);
        
        // Abrir cliente de correo
        window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
        
        alert('¡Gracias! Se abrirá tu aplicación de correo para enviar tu mensaje a historiascouthn@gmail.com. 🔥');
        this.reset();
    });
}

// Efecto hover en galería
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
});

// Actualizar año en footer
const yearSpan = document.querySelector('.footer p');
if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = yearSpan.innerHTML.replace('2024', currentYear);
}

// Filtro e interactividad de la línea de tiempo (sin dependencias adicionales)
{
    const searchInput = document.getElementById('timeline-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function filterTimeline() {
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        
        timelineItems.forEach(item => {
            const h3Element = item.querySelector('h3');
            const pElement = item.querySelector('p');
            const dateElement = item.querySelector('.timeline-date');
            const locElement = item.querySelector('.timeline-location');
            
            const titleText = h3Element ? h3Element.textContent.toLowerCase() : '';
            const bodyText = pElement ? pElement.textContent.toLowerCase() : '';
            const dateText = dateElement ? dateElement.textContent.toLowerCase() : '';
            const locationText = locElement ? locElement.textContent.toLowerCase() : '';
            const itemEpoch = item.getAttribute('data-epoch');
            
            const matchesSearch = titleText.includes(searchText) || 
                                  bodyText.includes(searchText) || 
                                  dateText.includes(searchText) || 
                                  locationText.includes(searchText);
                                  
            const matchesFilter = activeFilter === 'all' || itemEpoch === activeFilter;
            
            if (matchesSearch && matchesFilter) {
                item.hidden = false;
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            } else {
                item.hidden = true;
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterTimeline);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterTimeline();
        });
    });
}

// Menú móvil responsivo (hamburguesa)
{
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!navToggle || !navMenu) return;
    
    // Crear el overlay dinámicamente si no existe
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('menu-overlay');
        document.body.appendChild(overlay);
    }

    function toggleMenu() {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(navMenu.classList.contains('open')));
        overlay.classList.toggle('active');
        
        // Evitar el scroll de la página detrás cuando el menú está abierto
        if (navMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu?.classList.contains('open')) toggleMenu();
    });

    // Cerrar el menú automáticamente al hacer clic en un enlace del menú
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) toggleMenu();
        });
    });
}
