class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en';
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.themeBtn = document.getElementById('theme-toggle-btn');
        this.themeIcon = this.themeBtn?.querySelector('.theme-icon');
        if (!this.themeBtn) return;
        this.setupEventListeners();
        this.loadPreferences();
    }

    setupEventListeners() {
        this.themeBtn.addEventListener('click', () => {
            this.switchTheme(this.currentTheme === 'light' ? 'dark' : 'light');
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchLanguage(btn.getAttribute('data-lang'));
            });
        });
    }

    switchTheme(theme) {
        this.currentTheme = theme;
        document.body.classList.toggle('dark-theme', theme === 'dark');
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        localStorage.setItem('preferredTheme', theme);
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        localStorage.setItem('preferredLanguage', lang);
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    loadPreferences() {
        const savedTheme = localStorage.getItem('preferredTheme') || 'light';
        this.currentTheme = savedTheme;
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (this.themeIcon) this.themeIcon.textContent = '☀️';
        }

        const savedLang = localStorage.getItem('preferredLanguage') || this.detectLanguage();
        this.currentLang = savedLang;
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLang);
        });

        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: savedLang } }));
    }

    detectLanguage() {
        const lang = navigator.language || navigator.userLanguage || 'en';
        return lang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    }

    getCurrentLanguage() { return this.currentLang; }
    getCurrentTheme() { return this.currentTheme; }
}

window.LanguageSwitcher = LanguageSwitcher;
