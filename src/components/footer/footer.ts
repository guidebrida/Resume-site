import type { Language } from '../../types';

const footerTranslations: Record<Language, { rights: string }> = {
    en: { rights: 'All rights reserved.' },
    pt: { rights: 'Todos os direitos reservados.' },
};

function detectBrowserLanguage(): Language {
    const browserLang = navigator.language;
    return browserLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

function updateFooterTranslation(lang: Language): void {
    const rightsElement = document.querySelector<HTMLElement>('footer [data-i18n="footer.rights"]');
    if (rightsElement) {
        rightsElement.textContent = footerTranslations[lang].rights;
    }
}

function initFooter(): void {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }

    const savedLang = (localStorage.getItem('preferredLanguage') as Language | null) ?? detectBrowserLanguage();
    updateFooterTranslation(savedLang);
}

window.addEventListener('languageChanged', (e: Event) => {
    const lang = (e as CustomEvent<{ language: Language }>).detail.language;
    updateFooterTranslation(lang);
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
} else {
    initFooter();
}
