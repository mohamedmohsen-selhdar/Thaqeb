import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Factory,
  LayoutDashboard,
  FileText,
  Users,
  Truck,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Clock,
  Package,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useOperationsData, Order } from "@/hooks/useOperationsData";
import { useAuth } from "@/hooks/useAuth";

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground border-border" },
  pending_review: { label: "Pending Review", color: "bg-warning/20 text-warning border-warning/30" },
  quoted: { label: "Quoted", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  in_production: { label: "In Production", color: "bg-primary/20 text-primary border-primary/30" },
  quality_check: { label: "QA Check", color: "bg-warning/20 text-warning border-warning/30" },
  completed: { label: "Completed", color: "bg-success/20 text-success border-success/30" },
  delivered: { label: "Delivered", color: "bg-success/20 text-success border-success/30" },
  cancelled: { label: "Cancelled", color: "bg-destructive/20 text-destructive border-destructive/30" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", color: "bg-info/20 text-info" },
  high: { label: "High", color: "bg-warning/20 text-warning" },
  urgent: { label: "Urgent", color: "bg-destructive/20 text-destructive" },
};

const OperationsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { signOut } = useAuth();
  const { orders, quoteRequests, stats, isLoading } = useOperationsData();

  // Combine orders and quote requests for display
  const allItems = [
    ...orders.map((o) => ({ ...o, type: "order" as const })),
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              Tha<span className="text-primary">qeb</span>
            </span>
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Operations
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-all duration-200 hover:bg-primary/20"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <FileText className="h-5 w-5" />
            All Orders
          </Link>
          <Link
            to="/admin/suppliers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <Users className="h-5 w-5" />
            Suppliers
          </Link>
          <Link
            to="/operations/logistics"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <Truck className="h-5 w-5" />
            Logistics
          </Link>
          <Link
            to="/operations/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link
            to="/admin/content"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
          >
            <FileText className="h-5 w-5" />
            CMS Content
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={signOut}>
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
            <h1 className="font-display text-xl font-semibold text-foreground">
              Operations Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">PM</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-warning/30 hover:shadow-lg hover:shadow-warning/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 transition-all duration-300 group-hover:bg-warning/20 group-hover:scale-110">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">In Production</p>
              <p className="text-3xl font-bold text-foreground">{stats.inProgress}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-destructive/30 hover:shadow-lg hover:shadow-destructive/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 transition-all duration-300 group-hover:bg-destructive/20 group-hover:scale-110">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">QA Required</p>
              <p className="text-3xl font-bold text-foreground">{stats.qaRequired}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:border-success/30 hover:shadow-lg hover:shadow-success/5 hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 transition-all duration-300 group-hover:bg-success/20 group-hover:scale-110">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Pipeline Value</p>
              <p className="text-3xl font-bold text-foreground">
                EGP {(stats.totalValue / 1000).toFixed(0)}k
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="quoted">Quoted</option>
                <option value="in_production">In Production</option>
                <option value="quality_check">Quality Check</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Order
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Process
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Status
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Priority
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Value
                      </th>
                      <th className="text-right text-sm font-medium text-muted-foreground px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const status = statusConfig[item.status || "pending_review"] || statusConfig.pending_review;
                      const priority = priorityConfig[item.priority || "medium"] || priorityConfig.medium;
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{item.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.id.slice(0, 8)}...
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-foreground">{item.process || "N/A"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={status.color}>
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`${priority.color} border-0`}>
                              {priority.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-foreground">
                              EGP {(Number(item.quoted_price) || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm">
                              Manage
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

          {/* Quote Requests Section */}
          {quoteRequests.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Pending Quote Requests ({quoteRequests.length})
              </h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
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
                          Quantity
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                          Status
                        </th>
                        <th className="text-right text-sm font-medium text-muted-foreground px-6 py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteRequests.map((request) => {
                        const status = statusConfig[request.status || "draft"] || statusConfig.draft;
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
                              <span className="text-sm text-foreground">{request.process || "N/A"}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-foreground">{request.quantity}</span>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className={status.color}>
                                {status.label}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="sm">
                                Review
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OperationsDashboard;
