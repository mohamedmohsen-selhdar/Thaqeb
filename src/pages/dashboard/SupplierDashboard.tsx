import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Factory,
  Wrench,
  Calendar,
  Star,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSupplierOrders, SupplierOrder } from "@/hooks/useSupplierOrders";
import { useAuth } from "@/hooks/useAuth";

type OrderStatus = "pending_review" | "quoted" | "in_production" | "completed" | "cancelled" | "delivered";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending_review: { label: "Pending Review", color: "bg-info/20 text-info border-info/30" },
  quoted: { label: "Quoted", color: "bg-warning/20 text-warning border-warning/30" },
  in_production: { label: "In Progress", color: "bg-primary/20 text-primary border-primary/30" },
  completed: { label: "Completed", color: "bg-success/20 text-success border-success/30" },
  delivered: { label: "Delivered", color: "bg-success/20 text-success border-success/30" },
  cancelled: { label: "Cancelled", color: "bg-destructive/20 text-destructive border-destructive/30" },
};

const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const { signOut } = useAuth();
  const { activeOrders, historyOrders, stats, supplier, isLoading } = useSupplierOrders();

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
            to="/supplier/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-all duration-200 hover:bg-primary/20"
          >
            <Wrench className="h-5 w-5" />
            Jobs
          </Link>
          <Link
            to="/supplier/capacity"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <Calendar className="h-5 w-5" />
            Capacity
          </Link>
          <Link
            to="/supplier/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <Factory className="h-5 w-5" />
            Workshop Profile
          </Link>
          <Link
            to="/supplier/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
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
              Supplier Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">MS</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Active Jobs</p>
              <p className="text-3xl font-bold text-foreground">{stats.activeJobs}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-success/30 hover:shadow-lg hover:shadow-success/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 transition-all duration-300 group-hover:bg-success/20 group-hover:scale-110">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-3xl font-bold text-foreground">EGP {stats.thisMonthEarnings.toLocaleString()}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-warning/30 hover:shadow-lg hover:shadow-warning/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 transition-all duration-300 group-hover:bg-warning/20 group-hover:scale-110">
                  <Star className="h-5 w-5 text-warning" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-foreground">{stats.qualityScore.toFixed(1)}</p>
                <span className="text-sm text-muted-foreground">/5.0</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-info/30 hover:shadow-lg hover:shadow-info/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 transition-all duration-300 group-hover:bg-info/20 group-hover:scale-110">
                  <Clock className="h-5 w-5 text-info" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">On-Time Rate</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-foreground">{stats.onTimeRate}%</p>
              </div>
            </div>
          </div>

          {/* Capacity Overview */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">
                This Week's Capacity
              </h2>
              <Button variant="outline" size="sm">
                Manage Capacity
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">CNC Machining</span>
                  <span className="text-foreground font-medium">75% booked</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">CNC Turning</span>
                  <span className="text-foreground font-medium">40% booked</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Jobs ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              History
            </button>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : (activeTab === "active" ? activeOrders : historyOrders).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No {activeTab === "active" ? "active" : "completed"} jobs yet</p>
              </div>
            ) : (
              (activeTab === "active" ? activeOrders : historyOrders).map((order) => {
                const status = statusConfig[order.status || "pending_review"] || statusConfig.pending_review;
                return (
                  <div
                    key={order.id}
                    className="bg-card rounded-xl border border-border p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-semibold text-foreground">
                            {order.title}
                          </h3>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>{order.process || "N/A"}</span>
                          <span>•</span>
                          <span>{order.material || "N/A"}</span>
                          <span>•</span>
                          <span>{order.quantity} units</span>
                          {order.deadline && (
                            <>
                              <span>•</span>
                              <span>Due: {new Date(order.deadline).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Payout</p>
                          <p className="text-lg font-bold text-primary">
                            EGP {(Number(order.final_price) || Number(order.quoted_price) || 0).toLocaleString()}
                          </p>
                        </div>

                        {order.status === "pending_review" ? (
                          <div className="flex gap-2">
                            <Button variant="hero" size="sm">
                              <CheckCircle2 className="h-4 w-4" />
                              Accept
                            </Button>
                            <Button variant="outline" size="sm">
                              <XCircle className="h-4 w-4" />
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDashboard;
