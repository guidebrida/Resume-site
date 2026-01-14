let currentLang = 'en';
let currentTheme = 'light';
let languageSwitcherInstance = null;

// Load all components
async function loadComponents() {
    try {
        // Load language switcher first
        await loadLanguageSwitcherComponent();

        // Load other components in parallel for better performance
        await Promise.all([
            loadProjectsComponent(),
            loadSkillsComponent(),
            loadEducationComponent(),
            loadFooter()
        ]);

        // Apply translations after all components are loaded
        setTimeout(() => {
            updateTranslations(currentLang);
            updateFooterTranslation(currentLang);
            console.log('Initial translations applied to all components');
        }, 200);

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

        // Wait a bit for DOM to update
        await new Promise(resolve => setTimeout(resolve, 50));

        // Load switcher JavaScript
        await loadSwitcherScript();

        console.log('Language switcher component loaded');
    } catch (error) {
        console.error('Error loading language switcher component:', error);
    }
}

// Load switcher script
async function loadSwitcherScript() {
    return new Promise((resolve, reject) => {
        try {
            const script = document.createElement('script');
            script.src = 'components/language-switcher/language-switcher.js';
            script.type = 'text/javascript';
            script.onload = () => {
                // Wait for script to execute
                setTimeout(() => {
                    // Initialize the switcher
                    if (window.LanguageSwitcher) {
                        languageSwitcherInstance = new LanguageSwitcher();

                        // Get the initial language from the switcher
                        currentLang = languageSwitcherInstance.getCurrentLanguage();

                        // Apply initial translations
                        updateTranslations(currentLang);
                        updateFooterTranslation(currentLang);

                        // Listen for language changes to update translations
                        document.addEventListener('languageChanged', (e) => {
                            currentLang = e.detail.language;
                            updateTranslations(currentLang);
                            updateFooterTranslation(currentLang);
                            console.log('Language changed to:', currentLang);
                        });

                        // Listen for theme changes
                        document.addEventListener('themeChanged', (e) => {
                            currentTheme = e.detail.theme;
                            console.log('Theme changed to:', currentTheme);
                        });

                        console.log('Language switcher initialized with language:', currentLang);
                        resolve();
                    } else {
                        console.error('LanguageSwitcher class not found');
                        reject(new Error('LanguageSwitcher not loaded'));
                    }
                }, 100);
            };
            script.onerror = () => {
                reject(new Error('Failed to load language switcher script'));
            };
            document.head.appendChild(script);
        } catch (error) {
            reject(error);
        }
    });
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

            // Update footer translation with current language
            updateFooterTranslation(currentLang);
        }, 100);

        console.log('Footer component loaded');
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Load projects component
async function loadProjectsComponent() {
    try {
        const response = await fetch('components/projects/projects.html');
        const html = await response.text();
        document.getElementById('projects-container').innerHTML = html;

        // Load carousel script if exists
        await loadCarouselScript();

        console.log('Projects component loaded');
    } catch (error) {
        console.error('Error loading projects component:', error);
    }
}

// Load carousel script
async function loadCarouselScript() {
    return new Promise((resolve, reject) => {
        try {
            const script = document.createElement('script');
            script.src = 'components/projects/projects.js';
            script.type = 'text/javascript';
            script.onload = () => {
                console.log('Projects script loaded');
                resolve();
            };
            script.onerror = () => {
                console.warn('Projects script not found or failed to load');
                resolve(); // Resolve anyway to not block other components
            };
            document.head.appendChild(script);
        } catch (error) {
            console.warn('Error loading carousel script:', error);
            resolve(); // Resolve anyway to not block other components
        }
    });
}

// Load education component
async function loadEducationComponent() {
    try {
        const response = await fetch('components/education/education.html');
        const html = await response.text();
        document.getElementById('education-container').innerHTML = html;

        // Apply translations after loading
        setTimeout(() => {
            updateTranslations(currentLang);
        }, 100);

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

        // Apply translations after loading
        setTimeout(() => {
            updateTranslations(currentLang);
        }, 100);

        console.log('Skills component loaded');
    } catch (error) {
        console.error('Error loading skills component:', error);
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
    if (!translations || !translations[lang]) {
        console.warn(`Translations not found for language: ${lang}`);
        return;
    }

    const t = translations[lang];

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(t, key);

        if (value !== undefined && value !== null) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });

    console.log(`Translations updated for language: ${lang}`);
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
    console.log('DOM loaded, starting initialization...');

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