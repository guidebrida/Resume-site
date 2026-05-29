let currentLang = 'en';
let currentTheme = 'light';
let languageSwitcherInstance = null;

// ── Scroll reveal ──────────────────────────────────────────
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
}

// ── Navbar scroll behavior ─────────────────────────────────
function initNavbar() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    const sections = document.querySelectorAll('section[id]');

    const onScroll = () => {
        // Scrolled state
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) current = section.id;
        });

        document.querySelectorAll('.navbar-links a').forEach(a => {
            a.classList.toggle('active', a.dataset.section === current);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ── Add reveal classes to elements ────────────────────────
function addRevealClasses() {
    // Section titles
    document.querySelectorAll('.section-title, .skills-section h2, .projects-section h2').forEach((el, i) => {
        el.classList.add('reveal');
    });

    // Timeline items — staggered
    document.querySelectorAll('.timeline-item').forEach((el, i) => {
        el.classList.add('reveal-left');
        el.classList.add(`reveal-delay-${Math.min(i + 1, 5)}`);
    });

    // Contact cards
    document.querySelectorAll('.contact-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.classList.add(`reveal-delay-${Math.min(i + 1, 5)}`);
    });

    // Skill categories
    document.querySelectorAll('.skill-category').forEach((el, i) => {
        el.classList.add('reveal');
        el.classList.add(`reveal-delay-${Math.min((i % 3) + 1, 5)}`);
    });

    // Project cards
    document.querySelectorAll('.project-single').forEach((el, i) => {
        el.classList.add('reveal');
        el.classList.add(`reveal-delay-${i + 1}`);
    });

    // Education item
    document.querySelectorAll('.education-item').forEach(el => {
        el.classList.add('reveal');
    });
}

// ── Component loading ──────────────────────────────────────
async function loadComponents() {
    try {
        await loadNavbar();
        await loadLanguageSwitcherComponent();

        await Promise.all([
            loadComponent('introduction-container', 'components/introduction/introduction.html'),
            loadComponent('contact-container',      'components/contact/contact.html'),
            loadComponent('professional-container', 'components/professional/professional.html'),
            loadComponent('education-container',    'components/education/education.html'),
            loadComponent('skills-container',       'components/skills/skills.html'),
            loadComponent('projects-container',     'components/projects/projects.html'),
            loadComponent('footer-container',       'components/footer/footer.html'),
        ]);

        await loadScript('components/projects/projects.js', false);

        const yearEl = document.getElementById('current-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        setTimeout(() => {
            updateTranslations(currentLang);
            updateFooterTranslation(currentLang);
            addRevealClasses();
            initScrollReveal();
            initNavbar();
        }, 200);

    } catch (err) {
        console.error('Error loading components:', err);
    }
}

async function loadNavbar() {
    const res = await fetch('components/navbar/navbar.html');
    const html = await res.text();
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.prepend(container.firstElementChild);
}

async function loadComponent(id, path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    document.getElementById(id).innerHTML = await res.text();
}

async function loadLanguageSwitcherComponent() {
    await loadComponent('language-switcher-container', 'components/language-switcher/language-switcher.html');
    await new Promise(r => setTimeout(r, 50));
    await loadScript('components/language-switcher/language-switcher.js');

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            if (window.LanguageSwitcher) {
                languageSwitcherInstance = new LanguageSwitcher();
                currentLang = languageSwitcherInstance.getCurrentLanguage();
                updateTranslations(currentLang);
                updateFooterTranslation(currentLang);

                document.addEventListener('languageChanged', e => {
                    currentLang = e.detail.language;
                    updateTranslations(currentLang);
                    updateFooterTranslation(currentLang);
                });
                document.addEventListener('themeChanged', e => {
                    currentTheme = e.detail.theme;
                });
                resolve();
            } else {
                reject(new Error('LanguageSwitcher not found'));
            }
        }, 100);
    });
}

function loadScript(src, required = true) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = () => required ? reject(new Error(`Failed: ${src}`)) : resolve();
        document.head.appendChild(s);
    });
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, p) => acc && acc[p], obj);
}

function updateTranslations(lang) {
    if (!translations?.[lang]) return;
    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = getNestedValue(t, key);
        if (val === undefined) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
        else el.textContent = val;
    });
}

function updateFooterTranslation(lang) {
    const map = { en: 'All rights reserved.', pt: 'Todos os direitos reservados.' };
    const el = document.querySelector('footer [data-i18n="footer.rights"]');
    if (el) el.textContent = map[lang] || map.en;
}

function handleSubmit() {
    const t = translations?.[currentLang];
    if (t?.contact?.form?.alert) alert(t.contact.form.alert);
}

// ── Boot ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
