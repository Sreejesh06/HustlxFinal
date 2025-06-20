import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
 
const NotFound = React.lazy(() => import("./pages/not-found"));
const Home = React.lazy(() => import("./pages/Home"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Marketplace = React.lazy(() => import("./pages/Marketplace"));
const SkillVerification = React.lazy(() => import("./pages/SkillVerification"));
const ListingDetail = React.lazy(() => import("./pages/ListingDetail"));
const CreateListing = React.lazy(() => import("./pages/CreateListing"));
const HomemakerProfile = React.lazy(() => import("./pages/HomemakerProfile"));
const CustomerProfile = React.lazy(() => import("./pages/CustomerProfile"));
const About = React.lazy(() => import("./pages/About"));
const SuccessStories = React.lazy(() => import("./pages/SuccessStories"));
// Import components
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
        <Suspense fallback={
          <div className="flex items-center justify-center w-full h-screen">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary mb-2">Loading...</h2>
              <p className="text-gray-500">Please wait while we prepare your experience</p>
            </div>
          </div>
        }>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/marketplace" component={Marketplace} />
            <Route path="/skill-verification" component={SkillVerification} />
            <Route path="/listing/:id" component={ListingDetail} />
            <Route path="/create-listing" component={CreateListing} />
            <Route path="/homemaker/:id" component={HomemakerProfile} />
            <Route path="/customer/:id" component={CustomerProfile} />
            <Route path="/about" component={About} />
            <Route path="/success-stories" component={SuccessStories} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
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
