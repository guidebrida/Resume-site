// Language & Theme Switcher Component
class LanguageSwitcher {
    constructor() {
        this.menuOpen = false;
        this.currentLang = 'en';
        this.currentTheme = 'light';

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.switcher = document.querySelector('.language-switcher');
        this.toggleBtn = document.getElementById('menu-toggle-btn');
        this.menu = document.querySelector('.language-menu');

        if (!this.switcher || !this.toggleBtn || !this.menu) {
            console.warn('Language switcher elements not found');
            return;
        }

        this.setupEventListeners();
        this.loadPreferences();
        this.updateMenuState();
    }

    setupEventListeners() {
        // Toggle menu
        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Theme buttons
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const theme = btn.getAttribute('data-theme');
                this.switchTheme(theme);
            });
        });

        // Language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.menuOpen && !this.switcher.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this.updateMenuState();
    }

    openMenu() {
        this.menuOpen = true;
        this.updateMenuState();
    }

    closeMenu() {
        this.menuOpen = false;
        this.updateMenuState();
    }

    updateMenuState() {
        if (this.menuOpen) {
            this.toggleBtn.classList.add('active');
            this.menu.classList.add('active');
            this.toggleBtn.setAttribute('aria-expanded', 'true');
        } else {
            this.toggleBtn.classList.remove('active');
            this.menu.classList.remove('active');
            this.toggleBtn.setAttribute('aria-expanded', 'false');
        }
    }

    switchTheme(theme) {
        this.currentTheme = theme;

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

        // Store preference
        localStorage.setItem('preferredTheme', theme);

        // Close menu
        this.closeMenu();

        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    switchLanguage(lang) {
        this.currentLang = lang;

        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Store preference
        localStorage.setItem('preferredLanguage', lang);

        // Close menu
        this.closeMenu();

        // Dispatch event for translations to update
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    loadPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('preferredTheme') || 'light';
        this.currentTheme = savedTheme;

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

        // Load language preference
        const savedLang = localStorage.getItem('preferredLanguage') || this.detectLanguage();
        this.currentLang = savedLang;

        // Update language button state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === savedLang) {
                btn.classList.add('active');
            }
        });

        // Trigger initial language change event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: savedLang }
        }));
    }

    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    }

    // Public methods for external control
    setLanguage(lang) {
        this.switchLanguage(lang);
    }

    setTheme(theme) {
        this.switchTheme(theme);
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize when loaded
window.LanguageSwitcher = LanguageSwitcher;