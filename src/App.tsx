import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GetQuote from "./pages/GetQuote";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import SupplierDashboard from "./pages/dashboard/SupplierDashboard";
import OperationsDashboard from "./pages/dashboard/OperationsDashboard";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/get-quote" element={<GetQuote />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['client', 'admin']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/supplier/dashboard" element={
                <ProtectedRoute allowedRoles={['supplier', 'admin']}>
                  <SupplierDashboard />
                </ProtectedRoute>
              } />
              <Route path="/operations" element={
                <ProtectedRoute allowedRoles={['internal_ops', 'admin']}>
                  <OperationsDashboard />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
