
document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.view-project-btn');
    if (viewBtn) {
        e.preventDefault();
        e.stopPropagation();

        const card = viewBtn.closest('.project-card');
        if (!card) return;

        const detailsDiv = card.querySelector('.project-details-content');
        const overlay = document.getElementById('project-modal');
        const titleEl = document.getElementById('modal-title');
        const bodyEl = document.getElementById('modal-body');

        if (detailsDiv && overlay && titleEl && bodyEl) {
            const hiddenTitle = detailsDiv.querySelector('h3');
            const hiddenContent = detailsDiv.querySelector('.modal-body-content');

            if (hiddenTitle && hiddenContent) {
                titleEl.innerText = hiddenTitle.innerText;
                bodyEl.innerHTML = hiddenContent.innerHTML;

                overlay.classList.add('active');
                document.body.style.overflow = 'hidden'; 
            }
        }
        return;
    }

    const closeBtn = e.target.closest('.close-modal');
    const overlay = document.getElementById('project-modal');

    if (closeBtn || (overlay && e.target === overlay)) {
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; 
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('project-modal');
        if (overlay && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; 
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    if (themeToggle && icon) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        htmlElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }

    function updateIcon(theme) {
        if (!icon) return;
        if (theme === 'dark') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    /* ==========================================================================
       LANGUAGE TOGGLE (EN / AR) LOGIC
       ========================================================================== */
    const langToggle = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    let currentLang = localStorage.getItem('portfolio_lang') || 'en';

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        htmlElement.setAttribute('lang', lang);
        htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        if (langText) {
            langText.textContent = lang === 'ar' ? 'EN' : 'AR';
        }

        if (typeof translations !== 'undefined' && translations[lang]) {
            const langData = translations[lang];

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (langData[key]) {
                    el.innerHTML = langData[key];
                }
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (langData[key]) {
                    el.setAttribute('placeholder', langData[key]);
                }
            });

            if (langData['hero.typingRoles'] && Array.isArray(langData['hero.typingRoles'])) {
                roles.length = 0;
                roles.push(...langData['hero.typingRoles']);
                roleIndex = 0;
                charIndex = 0;
                isDeleting = false;
            }
        }
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            applyLanguage(newLang);
        });
    }

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (navItems.length && navLinks) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links li a');
    const navbar = document.querySelector('.navbar');

    function highlightActiveSection() {
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        let currentSectionId = '';

        if ((currentScroll + viewportHeight) >= documentHeight - 60) {
            if (sections.length > 0) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        } else {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const absoluteTop = rect.top + currentScroll - 120;
                const absoluteBottom = absoluteTop + section.offsetHeight;

                if (currentScroll >= absoluteTop && currentScroll < absoluteBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (!currentSectionId && sections.length > 0 && currentScroll < 300) {
                currentSectionId = sections[0].getAttribute('id');
            }
        }

        navAnchors.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection, { passive: true });
    window.addEventListener('resize', highlightActiveSection);
    highlightActiveSection(); 

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                if (navLinks) {
                    navLinks.classList.remove('active');
                }

                navAnchors.forEach(link => link.classList.remove('active'));
                if (this.closest('.nav-links')) {
                    this.classList.add('active');
                }

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    const contactForm = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendBtn');
    const contactMessage = document.getElementById('contactMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            sendBtn.classList.add('loading');
            sendBtn.textContent = 'Sending...';

            setTimeout(() => {
                sendBtn.classList.remove('loading');
                sendBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';

                contactMessage.textContent = 'Message Sent Successfully! ✅';
                contactMessage.classList.add('success');
                contactMessage.classList.remove('error');

                contactForm.reset();

                setTimeout(() => {
                    contactMessage.style.opacity = '0';
                    setTimeout(() => {
                        contactMessage.textContent = '';
                        contactMessage.classList.remove('success');
                        contactMessage.style.opacity = '';
                    }, 500);
                }, 5000);
            }, 600);
        });
    }

    const typingTextElement = document.querySelector('.typing-text');
    const roles = [
        ".NET Backend Developer",
        "ASP.NET Core MVC Specialist",
        "DEPI & ITI Trainee",
        "MS SQL Server Expert"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    applyLanguage(currentLang);

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingTextElement.textContent = currentRole.substring(0, charIndex--);
            typingSpeed = 50; 
        } else {
            typingTextElement.textContent = currentRole.substring(0, charIndex++);
            typingSpeed = 100; 
        }

        if (!isDeleting && charIndex === currentRole.length + 1) {
            isDeleting = true;
            typingSpeed = 2000; 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; 
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingTextElement) typeEffect();

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    const statNums = document.querySelectorAll('.hero-stat-num');
    if (statNums.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(num => statsObserver.observe(num));
    }

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initTechBackground() {
        let canvas = document.getElementById('bg-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'bg-canvas';
            document.body.prepend(canvas);
        }

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particleCount = Math.floor((width * height) / 18000);
        const particles = [];
        const mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        const techLabels = ['C#', 'SQL', '{ }', 'LINQ', '.NET', 'MVC', '01'];

        class Particle {
            constructor(index) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
                this.hasLabel = index % 6 === 0;
                this.label = techLabels[index % techLabels.length];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= Math.cos(angle) * force * 2;
                        this.y -= Math.sin(angle) * force * 2;
                    }
                }
            }

            draw() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? '#64ffda' : '#0d6efd';
                ctx.fill();

                if (this.hasLabel) {
                    ctx.font = '10px monospace';
                    ctx.fillStyle = isDark ? 'rgba(100, 255, 218, 0.45)' : 'rgba(13, 110, 253, 0.45)';
                    ctx.fillText(this.label, this.x + 8, this.y + 4);
                }
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(i));
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const lineColor = isDark ? '100, 255, 218' : '13, 110, 253';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${lineColor}, ${1 - dist / 130})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    initTechBackground();

    /* ==========================================================================
       PROJECT CATEGORY FILTERING LOGIC
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category') || '';
                    if (filterValue === 'all' || category.includes(filterValue)) {
                        card.classList.remove('hide');
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    } else {
                        card.classList.add('hide');
                    }
                });
            });
        });
    }

});




