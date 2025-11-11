import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { analytics } from "@/lib/analytics";
import { usePageMeta } from "@/hooks/usePageMeta";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";
import AdminPaymentsPage from "@/pages/admin-payments";
import PaymentPage from "@/pages/payment";
import OnboardingPage from "@/pages/onboarding";
import OnboardingCompletePage from "@/pages/onboarding-complete";
import PaymentSetupPage from "@/pages/payment-setup";
import ConsultationPage from "@/pages/consultation";
import WebsiteUpdateRequest from "@/pages/website-update-request";
import CustomerLogin from "@/pages/customer-login";
import CustomerDashboard from "@/pages/customer-dashboard";
import PortfolioPage from "@/pages/portfolio";

function Router() {
  usePageMeta();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/payments" component={AdminPaymentsPage} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/onboarding-complete" component={OnboardingCompletePage} />
      <Route path="/payment-setup" component={PaymentSetupPage} />
      <Route path="/consultation" component={ConsultationPage} />
      <Route path="/website-update-request" component={WebsiteUpdateRequest} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/customer/login" component={CustomerLogin} />
      <Route path="/customer/dashboard/:customerId?" component={CustomerDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Initialize analytics tracking
    analytics.trackPageView(window.location.pathname);
    analytics.autoTrackClicks();
    
    // Track page changes
    const handleLocationChange = () => {
      analytics.trackPageView(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
