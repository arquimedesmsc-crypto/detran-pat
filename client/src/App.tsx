import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SplashScreen from "./components/SplashScreen";
import PatrimonioLayout from "./components/PatrimonioLayout";
import Dashboard from "./pages/Dashboard";
import Patrimonio from "./pages/Patrimonio";
import Graficos from "./pages/Graficos";
import { useState } from "react";

function Router() {
  return (
    <PatrimonioLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/patrimonio" component={Patrimonio} />
        <Route path="/graficos" component={Graficos} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </PatrimonioLayout>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
          {splashDone && <Router />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
