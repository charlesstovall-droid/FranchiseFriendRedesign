import { Switch, Route } from "wouter";
import { Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FranchiseBrands from "@/pages/franchise-brands";
import PodcastAdmin from "@/pages/podcast-admin";
import MembersAdmin from "@/pages/members-admin";
import PodcastsPage from "@/pages/podcasts";
import BlackBook from "@/pages/black-book";
import ClientPortal from "@/pages/client-portal";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import FAQ from "@/pages/faq";
import Phase1 from "@/pages/members/phase1";
import Phase2 from "@/pages/members/phase2";
import Phase3 from "@/pages/members/phase3";
import Phase4 from "@/pages/members/phase4";
import ExecutiveLanding from "@/pages/executive-landing";
import ExecutiveProcess from "@/pages/executive-process";
import ExecutiveAbout from "@/pages/executive-about";
import ExecutiveInvestment from "@/pages/executive-investment";
import ThankYouAd from "@/pages/thank-you-ad";
import BlackbookLanding from "@/pages/blackbook-landing";
import ThankYouBlackbook from "@/pages/thank-you-blackbook";
import FranchiseAssessment from "@/pages/franchise-assessment";
import Speaking from "@/pages/speaking";
import HomeBasedFranchises from "@/pages/home-based-franchises";
import HomeFranchiseResults from "@/pages/home-franchise-results";
import PrivacyPolicy from "@/pages/privacy-policy";
import Charleston from "@/pages/charleston";
import AdvisorLanding from "@/pages/advisor/landing";
import AdvisorConversation from "@/pages/advisor/conversation";
import AdvisorReport from "@/pages/advisor/report";
import AdvisorResume from "@/pages/advisor/resume";
import AdvisorPrivacy from "@/pages/advisor/privacy";
import AdvisorAdminLogin from "@/pages/admin/advisor-login";
import AdvisorAdminDashboard from "@/pages/admin/advisor-dashboard";
import AdvisorAdminCandidate from "@/pages/admin/advisor-candidate";
import AdvisorAdminBrands from "@/pages/admin/advisor-brands";
import AdvisorAdminSettings from "@/pages/admin/advisor-settings";
import AdvisorAdminAnalytics from "@/pages/admin/advisor-analytics";

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#1a2332] text-sm font-semibold tracking-wide">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/speaking" component={Speaking} />
      <Route path="/franchise-brands" component={FranchiseBrands} />
      <Route path="/podcasts" component={PodcastsPage} />
      <Route path="/podcast-admin" component={PodcastAdmin} />
      <Route path="/members-admin" component={MembersAdmin} />
      <Route path="/black-book" component={BlackBook} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/faq" component={FAQ} />
      <Route path="/client-portal" component={ClientPortal} />
      <Route path="/phase1" component={Phase1} />
      <Route path="/phase2" component={Phase2} />
      <Route path="/phase3" component={Phase3} />
      <Route path="/phase4" component={Phase4} />
      <Route path="/executive-access/process" component={ExecutiveProcess} />
      <Route path="/executive-access/about" component={ExecutiveAbout} />
      <Route path="/executive-access/investment" component={ExecutiveInvestment} />
      <Route path="/executive-access" component={ExecutiveLanding} />
      <Route path="/thank-you-ad" component={ThankYouAd} />
      <Route path="/franchise-assessment" component={FranchiseAssessment} />
      <Route path="/free-franchise-guide" component={BlackbookLanding} />
      <Route path="/thank-you-franchise-guide" component={ThankYouBlackbook} />
      <Route path="/home-based-franchises" component={HomeBasedFranchises} />
      <Route path="/home-franchise-results" component={HomeFranchiseResults} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/charleston" component={Charleston} />
      <Route path="/advisor/conversation" component={AdvisorConversation} />
      <Route path="/advisor/report/:token" component={AdvisorReport} />
      <Route path="/advisor/resume/:token" component={AdvisorResume} />
      <Route path="/advisor/privacy" component={AdvisorPrivacy} />
      <Route path="/advisor" component={AdvisorLanding} />
      <Route path="/admin/advisor/login" component={AdvisorAdminLogin} />
      <Route path="/admin/advisor/candidates/:id" component={AdvisorAdminCandidate} />
      <Route path="/admin/advisor/brands" component={AdvisorAdminBrands} />
      <Route path="/admin/advisor/settings" component={AdvisorAdminSettings} />
      <Route path="/admin/advisor/analytics" component={AdvisorAdminAnalytics} />
      <Route path="/admin/advisor" component={AdvisorAdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<PageLoader />}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
