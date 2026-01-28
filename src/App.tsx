import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "./pages/Landing";
import LiveTokens from "./pages/LiveTokens";
import CreateToken from "./pages/CreateToken";
import Stats from "./pages/Stats";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page without sidebar */}
          <Route path="/" element={<Landing />} />
          
          {/* App pages with sidebar */}
          <Route path="/app" element={<AppLayout><LiveTokens /></AppLayout>} />
          <Route path="/app/create" element={<AppLayout><CreateToken /></AppLayout>} />
          <Route path="/app/stats" element={<AppLayout><Stats /></AppLayout>} />
          <Route path="/app/docs" element={<AppLayout><Docs /></AppLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
