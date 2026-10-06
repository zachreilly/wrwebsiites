import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { usePageMeta } from "@/hooks/usePageMeta";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import OnboardingPage from "@/pages/onboarding";
import OnboardingCompletePage from "@/pages/onboarding-complete";
import ConsultationPage from "@/pages/consultation";
import WebsiteUpdateRequest from "@/pages/website-update-request";
import PortfolioPage from "@/pages/portfolio";

function Router() {
  usePageMeta();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/onboarding-complete" component={OnboardingCompletePage} />
      <Route path="/consultation" component={ConsultationPage} />
      <Route path="/website-update-request" component={WebsiteUpdateRequest} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
