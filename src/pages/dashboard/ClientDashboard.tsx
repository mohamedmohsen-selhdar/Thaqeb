import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Factory,
  Plus,
  Package,
  Clock,
  CheckCircle2,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  FileText,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useClientQuoteRequests, statusDisplayMap, processDisplayMap } from "@/hooks/useOrders";
import { toast } from "sonner";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, role, signOut, isLoading: authLoading } = useAuth();
  const { data: quoteRequests, isLoading: quotesLoading, error } = useClientQuoteRequests();
  
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (authLoading || quotesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.error("Error loading quote requests:", error);
  }

  const filteredRequests = (quoteRequests || []).filter(
    (request) =>
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    active: (quoteRequests || []).filter((r) => !["completed", "cancelled"].includes(r.status)).length,
    pending: (quoteRequests || []).filter((r) => r.status === "pending_review").length,
    completed: (quoteRequests || []).filter((r) => r.status === "completed").length,
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (profile?.email) {
      return profile.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-glow">
              <Factory className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Fabri<span className="text-primary">share</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-all duration-200 hover:bg-primary/20"
          >
            <Package className="h-5 w-5" />
            My Requests
          </Link>
          <Link
            to="/get-quote"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <Plus className="h-5 w-5" />
            New Quote
          </Link>
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">{getInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow">
                  <Factory className="h-4 w-4 text-primary-foreground" />
                </div>
              </Link>
            </div>
            <h1 className="font-display text-xl font-semibold text-foreground">
              My Quote Requests
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {stats.pending > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">{getInitials()}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Active Requests</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.active}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-warning/30 hover:shadow-lg hover:shadow-warning/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 transition-all duration-300 group-hover:bg-warning/20 group-hover:scale-110">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">Pending Review</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-success/30 hover:shadow-lg hover:shadow-success/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 transition-all duration-300 group-hover:bg-success/20 group-hover:scale-110">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Link to="/get-quote">
              <Button variant="hero">
                <Plus className="h-4 w-4" />
                New Quote Request
              </Button>
            </Link>
          </div>

          {/* Requests List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No quote requests yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by submitting your first quote request
                </p>
                <Link to="/get-quote">
                  <Button variant="hero">
                    <Plus className="h-4 w-4" />
                    Submit Quote Request
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Request
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Process
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Status
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Qty
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Submitted
                      </th>
                      <th className="text-right text-sm font-medium text-muted-foreground px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => {
                      const status = statusDisplayMap[request.status] || statusDisplayMap.draft;
                      const process = request.process ? processDisplayMap[request.process] : "Not specified";
                      
                      return (
                        <tr
                          key={request.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{request.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {request.id.slice(0, 8)}...
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-foreground">{process}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={status.color}>
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-foreground">{request.quantity}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-muted-foreground">
                              {new Date(request.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm">
                              View
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
