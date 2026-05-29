// ============================================================
// Tipos globais do site de apresentação
// ============================================================

export type Language = 'en' | 'pt';
export type Theme = 'light' | 'dark';

// Eventos customizados do DOM
export interface LanguageChangedEvent extends CustomEvent {
    detail: { language: Language };
}

export interface ThemeChangedEvent extends CustomEvent {
    detail: { theme: Theme };
}

// Traduções: seção de menu
export interface MenuTranslations {
    theme: string;
    light: string;
    dark: string;
    language: string;
}

// Traduções: rodapé
export interface FooterTranslations {
    rights: string;
}

// Traduções: formulário de contato
export interface ContactFormTranslations {
    title: string;
    name: string;
    email: string;
    message: string;
    submit: string;
    alert: string;
}

// Traduções: seção de contato
export interface ContactTranslations {
    title: string;
    subtitle: string;
    location: string;
    form: ContactFormTranslations;
}

// Traduções: uma vaga de trabalho
export interface JobTranslation {
    title: string;
    period: string;
    description: string;
    achievements: string[];
}

// Traduções: histórico profissional
export interface HistoryTranslations {
    title: string;
    jobs: JobTranslation[];
}

// Traduções: educação
export interface EducationTranslations {
    title: string;
    degree: string;
    institution: string;
    period: string;
    description: string;
    highlights: string[];
}

// Traduções: categoria de habilidades
export interface SkillCategory {
    name: string;
    skills: string[];
}

// Traduções: habilidades
export interface SkillsTranslations {
    title: string;
    categories: SkillCategory[];
}

// Traduções: item de projeto
export interface ProjectItem {
    title: string;
    description: string;
}

// Traduções: projetos
export interface ProjectsTranslations {
    title: string;
    viewDemo: string;
    viewCode: string;
    items: ProjectItem[];
}

// Traduções completas para um idioma
export interface TranslationSet {
    menu: MenuTranslations;
    footer: FooterTranslations;
    tagline: string;
    intro: string;
    contact: ContactTranslations;
    history: HistoryTranslations;
    education: EducationTranslations;
    skills: SkillsTranslations;
    projects: ProjectsTranslations;
}

// Dicionário completo de traduções
export type Translations = Record<Language, TranslationSet>;

// Extensão do Window para expor classes globais carregadas dinamicamente
declare global {
    interface Window {
        LanguageSwitcher: typeof import('./components/language-switcher/language-switcher').LanguageSwitcher;
        translations: Translations;
    }
}
