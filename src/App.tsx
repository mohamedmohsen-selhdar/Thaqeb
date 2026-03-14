import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GetQuote from "./pages/GetQuote";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import { VoiceAgentWidget } from "@/components/ui/voice-agent-widget";
import SupplierDashboard from "./pages/dashboard/SupplierDashboard";
import OperationsDashboard from "./pages/dashboard/OperationsDashboard";
import ArticlesDashboard from "./pages/dashboard/ArticlesDashboard";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import CaseStudies from "./pages/CaseStudies";
import Careers from "./pages/Careers";
import OurServices from "./pages/OurServices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/services" element={<OurServices />} />
                <Route path="/get-quote" element={<GetQuote />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/client/dashboard" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/supplier/dashboard" element={
                  <ProtectedRoute allowedRoles={['supplier']}>
                    <SupplierDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['internal_ops', 'admin']}>
                    <OperationsDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/content" element={
                  <ProtectedRoute allowedRoles={['internal_ops', 'admin']}>
                    <ArticlesDashboard />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <VoiceAgentWidget />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
