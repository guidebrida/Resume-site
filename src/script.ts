import type { Language, Translations } from './types';
import { LanguageSwitcher } from './components/language-switcher/language-switcher';

// Estado global da aplicação
let currentLang: Language = 'en';
let currentTheme: string = 'light';
let languageSwitcherInstance: LanguageSwitcher | null = null;

// Carrega um componente HTML em um container pelo id
async function loadComponent(containerId: string, htmlPath: string): Promise<void> {
    const response = await fetch(htmlPath);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${htmlPath}: ${response.status}`);
    }
    const html = await response.text();
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container #${containerId} not found`);
    }
    container.innerHTML = html;
}

// Carrega um script externo dinamicamente e resolve quando estiver pronto
function loadScript(src: string, required: boolean = true): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.onload = () => resolve();
        script.onerror = () => {
            if (required) {
                reject(new Error(`Failed to load script: ${src}`));
            } else {
                console.warn(`Optional script not found: ${src}`);
                resolve();
            }
        };
        document.head.appendChild(script);
    });
}

// Inicializa o language switcher após carregar seu HTML e JS
async function loadLanguageSwitcherComponent(): Promise<void> {
    await loadComponent('language-switcher-container', 'components/language-switcher/language-switcher.html');
    await new Promise<void>(resolve => setTimeout(resolve, 50));
    await loadScript('components/language-switcher/language-switcher.js');

    await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            if (window.LanguageSwitcher) {
                languageSwitcherInstance = new window.LanguageSwitcher();
                currentLang = languageSwitcherInstance.getCurrentLanguage();

                updateTranslations(currentLang);
                updateFooterTranslation(currentLang);

                document.addEventListener('languageChanged', (e: Event) => {
                    currentLang = (e as CustomEvent<{ language: Language }>).detail.language;
                    updateTranslations(currentLang);
                    updateFooterTranslation(currentLang);
                    console.log('Language changed to:', currentLang);
                });

                document.addEventListener('themeChanged', (e: Event) => {
                    currentTheme = (e as CustomEvent<{ theme: string }>).detail.theme;
                    console.log('Theme changed to:', currentTheme);
                });

                console.log('Language switcher initialized with language:', currentLang);
                resolve();
            } else {
                reject(new Error('LanguageSwitcher class not found after script load'));
            }
        }, 100);
    });
}

// Carrega todos os componentes HTML
async function loadComponents(): Promise<void> {
    try {
        await loadLanguageSwitcherComponent();

        await Promise.all([
            loadComponent('introduction-container', 'components/introduction/introduction.html'),
            loadComponent('contact-container', 'components/contact/contact.html'),
            loadComponent('professional-container', 'components/professional/professional.html'),
            loadComponent('education-container', 'components/education/education.html'),
            loadComponent('skills-container', 'components/skills/skills.html'),
            loadComponent('projects-container', 'components/projects/projects.html'),
            loadComponent('footer-container', 'components/footer/footer.html'),
        ]);

        // Carrega script do carrossel (opcional — não bloqueia se ausente)
        await loadScript('components/projects/projects.js', false);

        // Atualiza o ano no footer
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = String(new Date().getFullYear());
        }

        // Aplica traduções após o DOM estar pronto
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

// Retorna um valor aninhado de um objeto a partir de um caminho "a.b.c"
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
    const result = path.split('.').reduce<unknown>((acc, part) => {
        if (acc !== null && typeof acc === 'object') {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, obj);

    return typeof result === 'string' ? result : undefined;
}

// Atualiza todos os elementos com data-i18n no DOM
function updateTranslations(lang: Language): void {
    const allTranslations: Translations = window.translations;

    if (!allTranslations?.[lang]) {
        console.warn(`Translations not found for language: ${lang}`);
        return;
    }

    const t = allTranslations[lang] as unknown as Record<string, unknown>;

    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (!key) return;

        const value = getNestedValue(t, key);
        if (value === undefined) return;

        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            element.placeholder = value;
        } else {
            element.textContent = value;
        }
    });

    console.log(`Translations updated for language: ${lang}`);
}

// Atualiza apenas o texto de rodapé
function updateFooterTranslation(lang: Language): void {
    const footerTranslations: Record<Language, { rights: string }> = {
        en: { rights: 'All rights reserved.' },
        pt: { rights: 'Todos os direitos reservados.' },
    };

    const rightsElement = document.querySelector<HTMLElement>('footer [data-i18n="footer.rights"]');
    if (rightsElement) {
        rightsElement.textContent = footerTranslations[lang].rights;
    }
}

// Tratamento do formulário de contato
function handleSubmit(): void {
    const allTranslations: Translations = window.translations;
    const t = allTranslations?.[currentLang];
    if (t?.contact?.form?.alert) {
        alert(t.contact.form.alert);
    }
}

// Ponto de entrada
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, starting initialization...');

    await loadComponents();

    // Smooth scroll para links âncora
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            if (!href) return;
            const target = document.querySelector<HTMLElement>(href);
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    console.log('Portfolio loaded successfully');
});

// Expõe handleSubmit globalmente (chamado inline no HTML)
(window as unknown as Record<string, unknown>)['handleSubmit'] = handleSubmit;
