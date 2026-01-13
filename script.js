let currentLang = 'en';
let currentTheme = 'light';
let languageSwitcherInstance = null;

// Load all components
async function loadComponents() {
    try {
        // Load language switcher first
        await loadLanguageSwitcherComponent();

        // Load other components
        await loadProjectsComponent();
        await loadSkillsComponent();
        await loadEducationComponent();
        await loadFooter();

        console.log('All components loaded successfully');

    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Load language switcher component
async function loadLanguageSwitcherComponent() {
    try {
        const response = await fetch('components/language-switcher/language-switcher.html');
        const html = await response.text();
        document.getElementById('language-switcher-container').innerHTML = html;

        // Load switcher JavaScript
        await loadSwitcherScript();

        console.log('Language switcher component loaded');
    } catch (error) {
        console.error('Error loading language switcher component:', error);
    }
}

// Load switcher script
async function loadSwitcherScript() {
    try {
        const script = document.createElement('script');
        script.src = 'components/language-switcher/language-switcher.js';
        script.type = 'text/javascript';
        script.onload = () => {
            // Initialize the switcher
            languageSwitcherInstance = new LanguageSwitcher();

            // Listen for language changes to update translations
            document.addEventListener('languageChanged', (e) => {
                currentLang = e.detail.language;
                updateTranslations(currentLang);
                updateFooterTranslation(currentLang);
            });

            // Listen for theme changes
            document.addEventListener('themeChanged', (e) => {
                currentTheme = e.detail.theme;
            });
        };
        document.head.appendChild(script);
    } catch (error) {
        console.error('Error loading switcher script:', error);
    }
}

// Load projects component
async function loadProjectsComponent() {
    try {
        const response = await fetch('components/projects/projects.html');
        const html = await response.text();
        document.getElementById('projects-container').innerHTML = html;

        // Load carousel script
        await loadCarouselScript();

        console.log('Projects component loaded');
    } catch (error) {
        console.error('Error loading projects component:', error);
    }
}

// Load carousel script
async function loadCarouselScript() {
    try {
        const script = document.createElement('script');
        script.src = 'components/projects/projects.js';
        script.type = 'text/javascript';
        document.head.appendChild(script);
    } catch (error) {
        console.error('Error loading carousel script:', error);
    }
}

// Load education component
async function loadEducationComponent() {
    try {
        const response = await fetch('components/education/education.html');
        const html = await response.text();
        document.getElementById('education-container').innerHTML = html;
        console.log('Education component loaded');
    } catch (error) {
        console.error('Error loading education component:', error);
    }
}

// Load skills component
async function loadSkillsComponent() {
    try {
        const response = await fetch('components/skills/skills.html');
        const html = await response.text();
        document.getElementById('skills-container').innerHTML = html;
        console.log('Skills component loaded');
    } catch (error) {
        console.error('Error loading skills component:', error);
    }
}

// Load footer component
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

// Function to get nested object value by path
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// Function to update all translations
function updateTranslations(lang) {
    const t = translations[lang];

    if (!t) {
        console.warn(`Translations not found for language: ${lang}`);
        return;
    }

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(t, key);

        if (value !== undefined) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

// Handle form submission (if still needed)
function handleSubmit() {
    const t = translations[currentLang];
    if (t && t.contact && t.contact.form && t.contact.form.alert) {
        alert(t.contact.form.alert);
    }
}

// Smooth scrolling for links
document.addEventListener('DOMContentLoaded', async () => {
    // Load all components
    await loadComponents();

    // Setup smooth scrolling
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

    console.log('Portfolio loaded successfully');
});