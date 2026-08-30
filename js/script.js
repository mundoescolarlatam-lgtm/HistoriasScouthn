// Smooth scroll
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

// Animación de entrada
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section, .featured-card, .gallery-item, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Manejo del formulario
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! Te contactaremos pronto. 🔥');
    this.reset();
});

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

// Inicialización de FlexSlider
$(window).on('load', function() {
    $('.flexslider').flexslider({
        animation: "slide",
        controlNav: true,
        directionNav: true,
        slideshowSpeed: 5000,
        animationSpeed: 600,
        touch: true
    });
});

// Filtro e interactividad de la Línea de Tiempo
$(document).ready(function() {
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
                $(item).fadeIn(300);
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            } else {
                $(item).fadeOut(200);
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
});

// Menú móvil responsivo (Hamburguesa)
$(document).ready(function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Crear el overlay dinámicamente si no existe
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('menu-overlay');
        document.body.appendChild(overlay);
    }

    function toggleMenu() {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
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

    // Cerrar el menú automáticamente al hacer clic en un enlace del menú
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
});
