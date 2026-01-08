let currentLang = 'en';
let menuOpen = false;
let currentTheme = 'light'; // Add this variable

// Load components
async function loadComponents() {
    try {
        // Load projects component only
        const projectsResponse = await fetch('components/projects/projects.html');
        const projectsHTML = await projectsResponse.text();
        document.getElementById('projects-container').innerHTML = projectsHTML;

        // Load footer component (keep existing)
        await loadFooter();

        console.log('Projects component loaded successfully');

    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Load footer component (keep existing)
async function loadFooter() {
    try {
        const response = await fetch('components/footer/footer.html');
        const html = await response.text();
        document.getElementById('footer-container').innerHTML = html;

        // Set current year after footer is loaded
        setTimeout(() => {
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }

            // Update footer translation
            const savedLang = localStorage.getItem('preferredLanguage') || detectLanguage();
            updateFooterTranslation(savedLang);
        }, 100);

    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Update footer translation
function updateFooterTranslation(lang) {
    const footerTranslations = {
        en: { rights: "All rights reserved." },
        pt: { rights: "Todos os direitos reservados." }
    };

    const rightsElement = document.querySelector('footer [data-i18n="footer.rights"]');
    if (rightsElement && footerTranslations[lang]) {
        rightsElement.textContent = footerTranslations[lang].rights;
    }
}

// Toggle menu function
function toggleMenu() {
    menuOpen = !menuOpen;
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.language-menu');

    if (menuOpen) {
        toggle.classList.add('active');
        menu.classList.add('active');
    } else {
        toggle.classList.remove('active');
        menu.classList.remove('active');
    }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const switcher = document.querySelector('.language-switcher');
    if (menuOpen && !switcher.contains(e.target)) {
        toggleMenu();
    }
});

// Function to detect browser/device language
function detectLanguage() {
    // Get browser language (e.g., 'pt-BR', 'en-US', 'pt', 'en')
    const browserLang = navigator.language || navigator.userLanguage;

    // Check if language starts with 'pt' (Portuguese)
    if (browserLang.toLowerCase().startsWith('pt')) {
        return 'pt';
    }

    // Default to English for all other languages
    return 'en';
}

// Function to get nested object value by path (e.g., "contact.form.title")
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// Function to update all translations
function updateTranslations(lang) {
    const t = translations[lang];

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(t, key);

        if (value !== undefined) {
            // Check if element is input/textarea for placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

// Switch language function
function switchLanguage(lang) {
    currentLang = lang;

    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Update all translations
    updateTranslations(lang);

    // Update footer translation
    updateFooterTranslation(lang);

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);

    // Close menu after selection
    if (menuOpen) {
        toggleMenu();
    }
}

// Switch theme function
function switchTheme(theme) {
    currentTheme = theme;

    // Update button states
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        }
    });

    // Apply theme
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // Store theme preference
    localStorage.setItem('preferredTheme', theme);
}

// Handle form submission (keep existing if you still have form)
function handleSubmit() {
    const t = translations[currentLang];
    if (t && t.contact && t.contact.form && t.contact.form.alert) {
        alert(t.contact.form.alert);
    }
}

// Smooth scrolling for links
document.addEventListener('DOMContentLoaded', async () => {
    // Load all components (projects + footer)
    await loadComponents();

    // Setup event listeners for menu toggle
    document.getElementById('menu-toggle-btn').addEventListener('click', toggleMenu);

    // Setup event listeners for theme buttons
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            switchTheme(theme);
        });
    });

    // Setup event listeners for language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('preferredTheme') || 'light';
    currentTheme = savedTheme;
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Update theme button state
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        }
    });

    // Priority: 1. User's saved preference, 2. Auto-detect, 3. Default to English
    let initialLang = localStorage.getItem('preferredLanguage');

    if (!initialLang) {
        // No saved preference, auto-detect language
        initialLang = detectLanguage();
    }

    currentLang = initialLang;

    // Update initial translations
    updateTranslations(initialLang);

    // Update button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === initialLang) {
            btn.classList.add('active');
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});