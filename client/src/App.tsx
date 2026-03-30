import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppAuthProvider } from "./contexts/AppAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patrimonio from "./pages/Patrimonio";
import Localizados from "./pages/Localizados";
import NaoLocalizados from "./pages/NaoLocalizados";
import Graficos from "./pages/Graficos";
import LevantamentoAnual from "@/pages/LevantamentoAnual";
import Transferencia from "@/pages/Transferencia";
import Admin from "@/pages/Admin";
import Relatorios from "@/pages/Relatorios";
import Onboarding from "@/pages/Onboarding";
import Ajuda from "@/pages/Ajuda";
import Perfil from "@/pages/Perfil";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

function Router() {
  const [, navigate] = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Verificar se é a primeira visita
    const hasSeenOnboarding = localStorage.getItem('onboarding_seen');
    const currentPath = window.location.pathname;
    
    // Mostrar onboarding apenas na primeira visita ao dashboard
    if (!hasSeenOnboarding && currentPath === '/dashboard') {
      setShowOnboarding(true);
      localStorage.setItem('onboarding_seen', 'true');
    }
  }, []);

  // Se deve mostrar onboarding, redirecionar para a página de onboarding
  if (showOnboarding) {
    return <Redirect to="/onboarding" />;
  }

  return (
    <Switch>
      {/* Rota raiz redireciona para login */}
      <Route path="/">
        <Redirect to="/login" />
      </Route>

      {/* Login — público */}
      <Route path="/login" component={Login} />

      {/* Rotas protegidas */}
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/patrimonio">
        <ProtectedRoute><Patrimonio /></ProtectedRoute>
      </Route>
      <Route path="/localizados">
        <ProtectedRoute><Localizados /></ProtectedRoute>
      </Route>
      <Route path="/nao-localizados">
        <ProtectedRoute><NaoLocalizados /></ProtectedRoute>
      </Route>
      <Route path="/graficos">
        <ProtectedRoute><Graficos /></ProtectedRoute>
      </Route>
      <Route path="/levantamento">
        <ProtectedRoute><LevantamentoAnual /></ProtectedRoute>
      </Route>
      <Route path="/transferencia">
        <ProtectedRoute><Transferencia /></ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute><Admin /></ProtectedRoute>
      </Route>
      <Route path="/relatorios">
        <ProtectedRoute><Relatorios /></ProtectedRoute>
      </Route>
      <Route path="/onboarding">
        <ProtectedRoute><Onboarding /></ProtectedRoute>
      </Route>
      <Route path="/ajuda">
        <ProtectedRoute><Ajuda /></ProtectedRoute>
      </Route>
      <Route path="/perfil">
        <ProtectedRoute><Perfil /></ProtectedRoute>
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <AppAuthProvider>
          <TooltipProvider>
            <Toaster />
            {!splashDone ? (
              <SplashScreen onComplete={() => setSplashDone(true)} />
            ) : (
              <Router />
            )}
          </TooltipProvider>
        </AppAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
