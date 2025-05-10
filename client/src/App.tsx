import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import SkillVerification from "@/pages/SkillVerification";
import ListingDetail from "@/pages/ListingDetail";
import CreateListing from "@/pages/CreateListing";
import HomemakerProfile from "@/pages/HomemakerProfile";
import CustomerProfile from "@/pages/CustomerProfile";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/auth/LoginModal";
import SignUpModal from "@/components/auth/SignUpModal";
import { AuthProvider } from "@/lib/auth";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/skill-verification" component={SkillVerification} />
          <Route path="/listing/:id" component={ListingDetail} />
          <Route path="/create-listing" component={CreateListing} />
          <Route path="/homemaker/:id" component={HomemakerProfile} />
          <Route path="/customer/:id" component={CustomerProfile} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <LoginModal />
          <SignUpModal />
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
