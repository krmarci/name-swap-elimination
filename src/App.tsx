
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NameProvider } from "@/context/NameContext";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import BoysPage from "./pages/BoysPage";
import GirlsPage from "./pages/GirlsPage";
import RankingsPage from "./pages/RankingsPage";
import GroupsPage from "./pages/GroupsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NameProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/boys" element={<BoysPage />} />
              <Route path="/girls" element={<GirlsPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NameProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
