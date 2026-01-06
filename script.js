let currentLang = 'en';

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
    });
    event.target.classList.add('active');
    
    // Update all translations
    updateTranslations(lang);
    
    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Handle form submission
function handleSubmit() {
    const t = translations[currentLang];
    alert(t.contact.form.alert);
}

// Smooth scrolling for links
document.addEventListener('DOMContentLoaded', () => {
    // Load saved language preference or default to 'en'
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    
    // Update initial translations
    updateTranslations(savedLang);
    
    // Update button state if not English
    if (savedLang !== 'en') {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes('Português') && savedLang === 'pt') {
                btn.classList.add('active');
            }
        });
        currentLang = savedLang;
    }
    
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