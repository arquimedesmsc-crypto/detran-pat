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
import LevantamentoAnual from "./pages/LevantamentoAnual";
import { useState } from "react";

function Router() {
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

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
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
