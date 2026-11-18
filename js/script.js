/**
 * HISTORIAS SCOUTS DE HONDURAS - JAVASCRIPT DINÁMICO (ESTILO PRIXIMA)
 * Interactividad: Contadores animados, Filtro de galería y línea de tiempo,
 * Lightbox modal, Navbar dinámico, Scroll suave y formulario.
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. NAVBAR DINÁMICO & SCROLLSPY
    // =========================================================================
    const navbar = document.querySelector('.navbar-scout');
    const backToTopBtn = document.querySelector('.btn-back-to-top');
    const navLinks = document.querySelectorAll('.navbar-scout .nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar scrolled state
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Scrollspy active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Back to top click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Cerrar menú móvil al hacer clic en un enlace
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show') && window.bootstrap) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    }


    // =========================================================================
    // 3. FILTRO DE GALERÍA DE RECUERDOS (PORTFOLIO PRIXIMA)
    // =========================================================================
    const portfolioFilterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            portfolioFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // =========================================================================
    // 4. LIGHTBOX MODAL NAVEGABLE PARA FOTOGRAFÍAS HISTÓRICAS
    // =========================================================================
    const lightbox = document.getElementById('scoutLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxTag = document.getElementById('lightboxTag');

    if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
        let currentPhotosList = [];
        let currentPhotoIndex = 0;

        // Obtener la lista de fotos visibles según el filtro activo
        function getVisiblePhotos() {
            const list = [];
            portfolioCards.forEach(card => {
                if (card.style.display !== 'none') {
                    const img = card.querySelector('img');
                    const title = card.querySelector('.portfolio-title');
                    const tag = card.querySelector('.portfolio-tag');
                    if (img) {
                        list.push({
                            src: img.src,
                            alt: img.alt || 'Fotografía histórica Scout',
                            title: title ? title.textContent.trim() : (img.alt || 'Fotografía Scout'),
                            tag: tag ? tag.textContent.trim() : 'Memoria Scout',
                            element: card
                        });
                    }
                }
            });
            return list;
        }

        function showPhoto(index, animate = true) {
            if (!currentPhotosList.length) return;
            if (index < 0) index = currentPhotosList.length - 1;
            if (index >= currentPhotosList.length) index = 0;
            currentPhotoIndex = index;

            const photo = currentPhotosList[index];

            if (animate) {
                lightboxImg.style.opacity = '0.3';
                lightboxImg.style.transform = 'scale(0.97)';
            }

            setTimeout(() => {
                lightboxImg.src = photo.src;
                lightboxImg.alt = photo.alt;
                if (lightboxCaption) lightboxCaption.textContent = photo.title;
                if (lightboxTag) lightboxTag.textContent = photo.tag;
                if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${currentPhotosList.length}`;

                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            }, animate ? 140 : 0);
        }

        portfolioCards.forEach(card => {
            card.addEventListener('click', function() {
                currentPhotosList = getVisiblePhotos();
                const clickedImg = this.querySelector('img');
                const clickedSrc = clickedImg ? clickedImg.src : '';

                let foundIndex = currentPhotosList.findIndex(p => p.src === clickedSrc);
                if (foundIndex === -1) foundIndex = 0;

                showPhoto(foundIndex, false);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function nextPhoto() {
            showPhoto(currentPhotoIndex + 1);
        }

        function prevPhoto() {
            showPhoto(currentPhotoIndex - 1);
        }

        lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
        if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
        });

        // Navegación con teclado (Flechas y Escape)
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextPhoto();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevPhoto();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
            }
        });

        // Soporte para gestos táctiles (Swipe izquierda / derecha en móviles)
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchEndX - touchStartX;
            if (Math.abs(diffX) > 45) {
                if (diffX < 0) nextPhoto();
                else prevPhoto();
            }
        }, { passive: true });
    }

    // =========================================================================
    // 5. FILTRADO Y BÚSQUEDA DE LA LÍNEA DE TIEMPO
    // =========================================================================
    const timelineSearch = document.getElementById('timeline-search');
    const timelinePills = document.querySelectorAll('.timeline-pill-btn');
    const timelineNodes = document.querySelectorAll('.timeline-node');

    function filterTimeline() {
        const query = timelineSearch ? timelineSearch.value.toLowerCase().trim() : '';
        const activePill = document.querySelector('.timeline-pill-btn.active');
        const activeEpoch = activePill ? activePill.getAttribute('data-filter') : 'all';

        timelineNodes.forEach(node => {
            const titleEl = node.querySelector('.timeline-title');
            const bodyEl = node.querySelector('.timeline-body');
            const yearEl = node.querySelector('.timeline-year-badge');
            const locEl = node.querySelector('.timeline-location-tag');
            const epoch = node.getAttribute('data-epoch');

            const textMatch = [
                titleEl ? titleEl.textContent : '',
                bodyEl ? bodyEl.textContent : '',
                yearEl ? yearEl.textContent : '',
                locEl ? locEl.textContent : ''
            ].some(txt => txt.toLowerCase().includes(query));

            const epochMatch = activeEpoch === 'all' || epoch === activeEpoch;

            if (textMatch && epochMatch) {
                node.style.display = 'block';
                setTimeout(() => {
                    node.style.opacity = '1';
                    node.style.transform = 'translateY(0)';
                }, 50);
            } else {
                node.style.opacity = '0';
                node.style.transform = 'translateY(15px)';
                setTimeout(() => {
                    node.style.display = 'none';
                }, 200);
            }
        });
    }

    if (timelineSearch) {
        timelineSearch.addEventListener('input', filterTimeline);
    }

    timelinePills.forEach(pill => {
        pill.addEventListener('click', function() {
            timelinePills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            filterTimeline();
        });
    });

    // =========================================================================
    // 6. FORMULARIO DE CONTACTO
    // =========================================================================
    const contactForm = document.getElementById('scoutContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('nombreInput')?.value || '';
            const email = document.getElementById('emailInput')?.value || '';
            const role = document.getElementById('rolInput')?.value || '';
            const subject = document.getElementById('asuntoInput')?.value || 'Aporte Histórico';
            const message = document.getElementById('mensajeInput')?.value || '';

            const mailTo = 'historiascouthn@gmail.com';
            const emailSubject = encodeURIComponent(`[Historias Scouts HN] ${subject} - ${name}`);
            const emailBody = encodeURIComponent(
                `Nombre: ${name}\n` +
                `Correo: ${email}\n` +
                `Grupo / Rol Scout: ${role}\n` +
                `Tipo de Mensaje: ${subject}\n\n` +
                `Mensaje / Anécdota:\n${message}\n\n` +
                `-- Enviado desde el portal Historias Scouts de Honduras`
            );

            window.location.href = `mailto:${mailTo}?subject=${emailSubject}&body=${emailBody}`;

            alert('¡Siempre Listo! Se abrirá tu aplicación de correo para enviar tu relato o mensaje a historiascouthn@gmail.com.');
            contactForm.reset();
        });
    }

    // =========================================================================
    // 7. AÑO DINÁMICO EN FOOTER
    // =========================================================================
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // =========================================================================
    // 8. INTERACCIÓN TOUCH/CLICK PARA TARJETAS POPUP (MISIÓN Y VISIÓN)
    // =========================================================================
    const popupCards = document.querySelectorAll('.popup-card');
    popupCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const isCurrentlyPopped = this.classList.contains('popped');
            popupCards.forEach(c => c.classList.remove('popped'));
            if (!isCurrentlyPopped) {
                this.classList.add('popped');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.popup-card')) {
            popupCards.forEach(c => c.classList.remove('popped'));
        }
    });

    // =========================================================================
    // 9. REPRODUCTOR DE VIDEO INTERACTIVO CON MINIATURA
    // =========================================================================
    const videoThumbWrappers = document.querySelectorAll('.video-thumb-wrapper');
    videoThumbWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            const videoTitle = this.getAttribute('data-video-title') || 'Historias Scouts';
            if (videoId) {
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`);
                iframe.setAttribute('title', videoTitle);
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', 'true');
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = '0';

                this.innerHTML = '';
                this.appendChild(iframe);
            }
        });
    });
});
