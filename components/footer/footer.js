// Footer component JavaScript
(function() {
    // Function to initialize footer
    function initFooter() {
        // Set current year
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        // Set initial language if available
        const savedLang = localStorage.getItem('preferredLanguage') || detectBrowserLanguage();
        if (savedLang) {
            updateFooterTranslation(savedLang);
        }
    }

    // Detect browser language
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    }

    // Footer translations
    const footerTranslations = {
        en: {
            rights: "All rights reserved."
        },
        pt: {
            rights: "Todos os direitos reservados."
        }
    };

    // Update footer translation
    function updateFooterTranslation(lang) {
        const rightsElement = document.querySelector('footer [data-i18n="footer.rights"]');
        if (rightsElement && footerTranslations[lang]) {
            rightsElement.textContent = footerTranslations[lang].rights;
        }
    }

    // Listen for language changes
    window.addEventListener('languageChanged', (e) => {
        updateFooterTranslation(e.detail.language);
    });

    // Initialize footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooter);
    } else {
        initFooter();
    }
})();