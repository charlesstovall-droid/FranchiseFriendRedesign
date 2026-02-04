import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
      <Route path="/blackbook" component={BlackbookLanding} />
      <Route path="/thank-you-blackbook" component={ThankYouBlackbook} />
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
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
