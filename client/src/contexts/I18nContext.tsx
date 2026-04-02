import { createContext, useContext, ReactNode } from "react";

export type Language = "pt" | "en";

interface I18nContextType {
  language: Language;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

interface I18nProviderProps {
  children: ReactNode;
  language: Language;
}

export function I18nProvider({ children, language }: I18nProviderProps) {
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Translations ─────────────────────────────────────────────────────────────

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Common
    "common.loading": "Carregando...",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.close": "Fechar",
    "common.edit": "Editar",
    "common.delete": "Excluir",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.export": "Exportar",
    "common.print": "Imprimir",
    "common.yes": "Sim",
    "common.no": "Não",
    "common.confirm": "Confirmar",
    "common.back": "Voltar",
    "common.next": "Próximo",
    "common.previous": "Anterior",
    "common.finish": "Concluir",
    "common.skip": "Pular",
    "common.logout": "Sair",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.assets": "Patrimônios",
    "nav.located": "Localizados",
    "nav.notLocated": "Não Localizados",
    "nav.annualSurvey": "Levantamento Anual",
    "nav.transfer": "Transferência",
    "nav.reports": "Relatórios",
    "nav.profile": "Meu Perfil",
    "nav.help": "Ajuda",
    "nav.admin": "Administração",
    "nav.newAsset": "Novo Patrimônio",
    
    // Login
    "login.title": "Bem-vindo de volta",
    "login.subtitle": "Acesse com suas credenciais institucionais",
    "login.username": "Usuário",
    "login.password": "Senha",
    "login.button": "Entrar no Sistema",
    "login.error": "Usuário ou senha inválidos",
    
    // Dashboard
    "dashboard.title": "Dashboard Patrimonial",
    "dashboard.subtitle": "Levantamento 2025/2026 — Visão geral do acervo",
    "dashboard.totalItems": "Total de Itens",
    "dashboard.located": "Localizados",
    "dashboard.notLocated": "Não Localizados",
    "dashboard.totalValue": "Valor Total Declarado",
    "dashboard.inSurvey": "No levantamento",
    "dashboard.ofInventory": "do acervo",
    
    // Profile
    "profile.title": "Meu Perfil",
    "profile.personalData": "Dados Pessoais",
    "profile.displayName": "Nome de Exibição",
    "profile.email": "E-mail",
    "profile.idNumber": "Matrícula / ID Funcional",
    "profile.systemUser": "Usuário do Sistema",
    "profile.position": "Cargo",
    "profile.department": "Setor",
    "profile.saveButton": "Salvar Dados Pessoais",
    "profile.changePassword": "Alterar Senha",
    "profile.currentPassword": "Senha Atual",
    "profile.newPassword": "Nova Senha",
    "profile.confirmPassword": "Confirmar Nova Senha",
    "profile.changePasswordButton": "Alterar Senha",
    "profile.appearance": "Aparência",
    "profile.appearanceDesc": "Escolha o tema de exibição do sistema.",
    "profile.light": "Claro",
    "profile.dark": "Escuro",
    "profile.language": "Idioma",
    "profile.languageDesc": "Escolha o idioma de exibição do sistema.",
    "profile.portuguese": "Português",
    "profile.english": "English",
    "profile.tutorial": "Tutorial de Boas-vindas",
    "profile.tutorialDesc": "O tutorial é exibido automaticamente ao entrar no sistema. Você pode desativá-lo se já conhece todas as funcionalidades.",
    "profile.tutorialEnabled": "Exibir tutorial ao entrar",
    "profile.tutorialActive": "Ativado — exibido na próxima sessão",
    "profile.tutorialInactive": "Desativado",
    "profile.reactivateTutorial": "Reativar e ver tutorial agora",
    "profile.status": "Status",
    "profile.systemOnline": "Sistema online",
    "profile.sessionActive": "Sessão ativa",
    
    // Onboarding
    "onboarding.welcome": "Bem-vindo ao Sistema de Patrimônio",
    "onboarding.subtitle": "DETRAN-RJ · Gestão Patrimonial 2025/2026",
    "onboarding.intro": "Este tour interativo apresenta todas as funcionalidades disponíveis. Você pode navegar livremente pelos slides ou pular a qualquer momento.",
    "onboarding.skip": "Pular tour",
    "onboarding.dontShowAgain": "Não mostrar novamente",
    "onboarding.slideOf": "de",
  },
  en: {
    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.print": "Print",
    "common.yes": "Yes",
    "common.no": "No",
    "common.confirm": "Confirm",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.finish": "Finish",
    "common.skip": "Skip",
    "common.logout": "Logout",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.assets": "Assets",
    "nav.located": "Located",
    "nav.notLocated": "Not Located",
    "nav.annualSurvey": "Annual Survey",
    "nav.transfer": "Transfer",
    "nav.reports": "Reports",
    "nav.profile": "My Profile",
    "nav.help": "Help",
    "nav.admin": "Administration",
    "nav.newAsset": "New Asset",
    
    // Login
    "login.title": "Welcome Back",
    "login.subtitle": "Access with your institutional credentials",
    "login.username": "Username",
    "login.password": "Password",
    "login.button": "Sign In",
    "login.error": "Invalid username or password",
    
    // Dashboard
    "dashboard.title": "Asset Dashboard",
    "dashboard.subtitle": "2025/2026 Survey — Inventory Overview",
    "dashboard.totalItems": "Total Items",
    "dashboard.located": "Located",
    "dashboard.notLocated": "Not Located",
    "dashboard.totalValue": "Total Declared Value",
    "dashboard.inSurvey": "In survey",
    "dashboard.ofInventory": "of inventory",
    
    // Profile
    "profile.title": "My Profile",
    "profile.personalData": "Personal Data",
    "profile.displayName": "Display Name",
    "profile.email": "Email",
    "profile.idNumber": "Employee ID / Functional ID",
    "profile.systemUser": "System User",
    "profile.position": "Position",
    "profile.department": "Department",
    "profile.saveButton": "Save Personal Data",
    "profile.changePassword": "Change Password",
    "profile.currentPassword": "Current Password",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm New Password",
    "profile.changePasswordButton": "Change Password",
    "profile.appearance": "Appearance",
    "profile.appearanceDesc": "Choose the system display theme.",
    "profile.light": "Light",
    "profile.dark": "Dark",
    "profile.language": "Language",
    "profile.languageDesc": "Choose the system display language.",
    "profile.portuguese": "Português",
    "profile.english": "English",
    "profile.tutorial": "Welcome Tutorial",
    "profile.tutorialDesc": "The tutorial is displayed automatically when you sign in. You can disable it if you already know all the features.",
    "profile.tutorialEnabled": "Show tutorial on sign in",
    "profile.tutorialActive": "Enabled — shown on next session",
    "profile.tutorialInactive": "Disabled",
    "profile.reactivateTutorial": "Reactivate and view tutorial now",
    "profile.status": "Status",
    "profile.systemOnline": "System online",
    "profile.sessionActive": "Session active",
    
    // Onboarding
    "onboarding.welcome": "Welcome to the Asset Management System",
    "onboarding.subtitle": "DETRAN-RJ · Asset Management 2025/2026",
    "onboarding.intro": "This interactive tour presents all available features. You can navigate freely through the slides or skip at any time.",
    "onboarding.skip": "Skip tour",
    "onboarding.dontShowAgain": "Don't show again",
    "onboarding.slideOf": "of",
  },
};
