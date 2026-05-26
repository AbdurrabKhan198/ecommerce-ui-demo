/* ============================================
   INFO SHOPPE — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---------- Cursor Glow ----------
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.getElementById('navbar');
    const handleNavScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ---------- Active Nav Link on Scroll ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---------- Mobile Menu ----------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let mobileMenuOpen = false;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOpen = !mobileMenuOpen;
            if (mobileMenuOpen) {
                mobileMenu.classList.remove('mobile-menu-closed');
                mobileMenu.classList.add('mobile-menu-open');
                mobileMenuBtn.classList.add('hamburger-active');
            } else {
                closeMobileMenu();
            }
        });
    }

    window.closeMobileMenu = function() {
        mobileMenuOpen = false;
        if (mobileMenu) {
            mobileMenu.classList.remove('mobile-menu-open');
            mobileMenu.classList.add('mobile-menu-closed');
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove('hamburger-active');
        }
    };

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && mobileMenuOpen) {
            closeMobileMenu();
        }
    });

    // ---------- Reveal on Scroll (Intersection Observer) ----------
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // ---------- Product Filter ----------
    const filterBtns = document.querySelectorAll('.product-filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.classList.remove('hidden-by-filter');
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden-by-filter');
                }
            });
        });
    });

    // ---------- Testimonial Slider ----------
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');
    const testimonialDots = document.getElementById('testimonial-dots');
    const slides = document.querySelectorAll('.testimonial-slide');

    if (testimonialTrack && slides.length > 0) {
        let currentSlide = 0;
        let slidesPerView = getSlidesPerView();
        let maxSlide = Math.max(0, slides.length - slidesPerView);

        function getSlidesPerView() {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        }

        function updateSlider() {
            const slideWidth = 100 / slidesPerView;
            testimonialTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
            updateDots();
        }

        function createDots() {
            if (!testimonialDots) return;
            testimonialDots.innerHTML = '';
            const totalDots = maxSlide + 1;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'bg-neon-blue w-6' : 'bg-white/20'
                }`;
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentSlide = i;
                    updateSlider();
                });
                testimonialDots.appendChild(dot);
            }
        }

        function updateDots() {
            if (!testimonialDots) return;
            const dots = testimonialDots.querySelectorAll('button');
            dots.forEach((dot, i) => {
                if (i === currentSlide) {
                    dot.className = 'w-6 h-2 rounded-full bg-neon-blue transition-all duration-300';
                } else {
                    dot.className = 'w-2 h-2 rounded-full bg-white/20 transition-all duration-300';
                }
            });
        }

        if (testimonialPrev) {
            testimonialPrev.addEventListener('click', () => {
                currentSlide = Math.max(0, currentSlide - 1);
                updateSlider();
            });
        }

        if (testimonialNext) {
            testimonialNext.addEventListener('click', () => {
                currentSlide = Math.min(maxSlide, currentSlide + 1);
                updateSlider();
            });
        }

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    currentSlide = Math.min(maxSlide, currentSlide + 1);
                } else {
                    currentSlide = Math.max(0, currentSlide - 1);
                }
                updateSlider();
            }
        }, { passive: true });

        // Recalculate on resize
        window.addEventListener('resize', () => {
            slidesPerView = getSlidesPerView();
            maxSlide = Math.max(0, slides.length - slidesPerView);
            currentSlide = Math.min(currentSlide, maxSlide);
            createDots();
            updateSlider();
        });

        createDots();
        updateSlider();
    }

    // ---------- Counter Animation ----------
    const counterElements = document.querySelectorAll('.counter-value');
    
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'));
                    animateCounter(el, target);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();
        const startVal = 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startVal + (target - startVal) * eased);
            
            if (target >= 10000) {
                el.textContent = (current / 1000).toFixed(current >= target ? 0 : 1) + 'K+';
            } else if (target === 100) {
                el.textContent = current + '%';
            } else if (target === 24) {
                el.textContent = current;
            } else {
                el.textContent = current + '+';
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ---------- Particles Canvas ----------
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            const hero = document.getElementById('hero');
            if (hero) {
                canvas.width = hero.offsetWidth;
                canvas.height = hero.offsetHeight;
            }
        }

        function createParticles() {
            particles = [];
            const count = window.innerWidth < 768 ? 30 : 60;
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.5 + 0.1,
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
                ctx.fill();

                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.05 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(drawParticles);
        }

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        // Pause particles when hero not visible (performance)
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    cancelAnimationFrame(animationId);
                } else {
                    drawParticles();
                }
            });
        });
        
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroObserver.observe(heroSection);
        }
    }

    // ---------- Newsletter Form ----------
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const submitBtn = document.getElementById('newsletter-submit-btn');

            if (emailInput && emailInput.value) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = '✓ Subscribed!';
                submitBtn.style.background = 'linear-gradient(to right, #10B981, #06B6D4)';
                emailInput.value = '';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
    }

    // ---------- Smooth Scroll for Anchor Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- Gaming stat bar animation on scroll ----------
    const statBars = document.querySelectorAll('.gaming-stat-bar');
    if ('IntersectionObserver' in window && statBars.length > 0) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'stat-fill 2s ease-out forwards';
                }
            });
        }, { threshold: 0.3 });

        statBars.forEach(bar => {
            bar.style.transform = 'scaleX(0)';
            statObserver.observe(bar);
        });
    }
});
