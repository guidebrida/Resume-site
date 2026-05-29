import type { Language, Theme } from '../../types';

export class LanguageSwitcher {
    private menuOpen: boolean = false;
    private currentLang: Language = 'en';
    private currentTheme: Theme = 'light';

    private switcher!: HTMLElement;
    private toggleBtn!: HTMLElement;
    private menu!: HTMLElement;

    constructor() {
        this.init();
    }

    private init(): void {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    private setup(): void {
        const switcher = document.querySelector<HTMLElement>('.language-switcher');
        const toggleBtn = document.getElementById('menu-toggle-btn');
        const menu = document.querySelector<HTMLElement>('.language-menu');

        if (!switcher || !toggleBtn || !menu) {
            console.warn('Language switcher elements not found');
            return;
        }

        this.switcher = switcher;
        this.toggleBtn = toggleBtn;
        this.menu = menu;

        this.setupEventListeners();
        this.loadPreferences();
        this.updateMenuState();
    }

    private setupEventListeners(): void {
        this.toggleBtn.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        document.querySelectorAll<HTMLElement>('.theme-option').forEach(btn => {
            btn.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
                const theme = btn.getAttribute('data-theme') as Theme | null;
                if (theme) this.switchTheme(theme);
            });
        });

        document.querySelectorAll<HTMLElement>('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
                const lang = btn.getAttribute('data-lang') as Language | null;
                if (lang) this.switchLanguage(lang);
            });
        });

        document.addEventListener('click', (e: MouseEvent) => {
            if (this.menuOpen && !this.switcher.contains(e.target as Node)) {
                this.closeMenu();
            }
        });

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.menuOpen) {
                this.closeMenu();
            }
        });
    }

    private toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
        this.updateMenuState();
    }

    private closeMenu(): void {
        this.menuOpen = false;
        this.updateMenuState();
    }

    private updateMenuState(): void {
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

    private switchTheme(theme: Theme): void {
        this.currentTheme = theme;

        document.querySelectorAll<HTMLElement>('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
        });

        document.body.classList.toggle('dark-theme', theme === 'dark');

        localStorage.setItem('preferredTheme', theme);
        this.closeMenu();

        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    private switchLanguage(lang: Language): void {
        this.currentLang = lang;

        document.querySelectorAll<HTMLElement>('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        localStorage.setItem('preferredLanguage', lang);
        this.closeMenu();

        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    private loadPreferences(): void {
        const savedTheme = (localStorage.getItem('preferredTheme') as Theme | null) ?? 'light';
        this.currentTheme = savedTheme;

        document.body.classList.toggle('dark-theme', savedTheme === 'dark');

        document.querySelectorAll<HTMLElement>('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === savedTheme);
        });

        const savedLang = (localStorage.getItem('preferredLanguage') as Language | null) ?? this.detectLanguage();
        this.currentLang = savedLang;

        document.querySelectorAll<HTMLElement>('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLang);
        });

        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: savedLang } }));
    }

    private detectLanguage(): Language {
        const browserLang = navigator.language;
        return browserLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    }

    // API pública
    public setLanguage(lang: Language): void {
        this.switchLanguage(lang);
    }

    public setTheme(theme: Theme): void {
        this.switchTheme(theme);
    }

    public getCurrentLanguage(): Language {
        return this.currentLang;
    }

    public getCurrentTheme(): Theme {
        return this.currentTheme;
    }
}

// Expõe no window para carregamento dinâmico pelo script.ts
window.LanguageSwitcher = LanguageSwitcher;
