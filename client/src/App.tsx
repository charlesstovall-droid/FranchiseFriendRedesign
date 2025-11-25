import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FranchiseBrands from "@/pages/franchise-brands";
import PodcastAdmin from "@/pages/podcast-admin";
import PodcastsPage from "@/pages/podcasts";
import BlackBook from "@/pages/black-book";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/franchise-brands" component={FranchiseBrands} />
      <Route path="/podcasts" component={PodcastsPage} />
      <Route path="/podcast-admin" component={PodcastAdmin} />
      <Route path="/black-book" component={BlackBook} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;