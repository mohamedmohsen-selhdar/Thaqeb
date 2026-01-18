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
  Filter,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

type OrderStatus = "submitted" | "under_review" | "quoted" | "supplier_assigned" | "in_production" | "quality_check" | "ready_pickup" | "delivered";

interface Order {
  id: string;
  clientName: string;
  title: string;
  process: string;
  status: OrderStatus;
  supplier?: string;
  priority: "normal" | "high" | "urgent";
  deadline: string;
  value: number;
}

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    clientName: "ABC Industries",
    title: "Aluminum Enclosure Parts",
    process: "CNC Machining",
    status: "in_production",
    supplier: "El-Masry Workshop",
    priority: "high",
    deadline: "2024-01-28",
    value: 18500,
  },
  {
    id: "ORD-2024-002",
    clientName: "Delta Manufacturing",
    title: "Steel Mounting Brackets",
    process: "Sheet Metal",
    status: "under_review",
    priority: "urgent",
    deadline: "2024-01-25",
    value: 12000,
  },
  {
    id: "ORD-2024-003",
    clientName: "Nile Electronics",
    title: "Prototype Gears",
    process: "3D Printing",
    status: "submitted",
    priority: "normal",
    deadline: "2024-02-01",
    value: 3500,
  },
  {
    id: "ORD-2024-004",
    clientName: "Cairo Engineering",
    title: "Custom Fasteners",
    process: "CNC Machining",
    status: "quality_check",
    supplier: "Precision Works",
    priority: "high",
    deadline: "2024-01-22",
    value: 9800,
  },
  {
    id: "ORD-2024-005",
    clientName: "Giza Motors",
    title: "Valve Components",
    process: "CNC Turning",
    status: "supplier_assigned",
    supplier: "Ahmed & Sons",
    priority: "normal",
    deadline: "2024-02-10",
    value: 22000,
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  submitted: { label: "Submitted", color: "bg-info/20 text-info border-info/30" },
  under_review: { label: "Under Review", color: "bg-warning/20 text-warning border-warning/30" },
  quoted: { label: "Quoted", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  supplier_assigned: { label: "Supplier Assigned", color: "bg-info/20 text-info border-info/30" },
  in_production: { label: "In Production", color: "bg-primary/20 text-primary border-primary/30" },
  quality_check: { label: "QA Check", color: "bg-warning/20 text-warning border-warning/30" },
  ready_pickup: { label: "Ready for Pickup", color: "bg-success/20 text-success border-success/30" },
  delivered: { label: "Delivered", color: "bg-success/20 text-success border-success/30" },
};

const priorityConfig = {
  normal: { label: "Normal", color: "bg-muted text-muted-foreground" },
  high: { label: "High", color: "bg-warning/20 text-warning" },
  urgent: { label: "Urgent", color: "bg-destructive/20 text-destructive" },
};

const OperationsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: mockOrders.filter((o) => ["submitted", "under_review"].includes(o.status)).length,
    inProgress: mockOrders.filter((o) => ["supplier_assigned", "in_production"].includes(o.status)).length,
    qaRequired: mockOrders.filter((o) => o.status === "quality_check").length,
    totalValue: mockOrders.reduce((sum, o) => sum + o.value, 0),
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

        <div className="px-4 py-3 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Operations
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/operations"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/operations/orders"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <FileText className="h-5 w-5" />
            All Orders
          </Link>
          <Link
            to="/operations/suppliers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Users className="h-5 w-5" />
            Suppliers
          </Link>
          <Link
            to="/operations/logistics"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Truck className="h-5 w-5" />
            Logistics
          </Link>
          <Link
            to="/operations/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">In Production</p>
              <p className="text-3xl font-bold text-foreground">{stats.inProgress}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">QA Required</p>
              <p className="text-3xl font-bold text-foreground">{stats.qaRequired}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
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
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="supplier_assigned">Supplier Assigned</option>
                <option value="in_production">In Production</option>
                <option value="quality_check">Quality Check</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Order
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Client
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Priority
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Supplier
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
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status];
                    const priority = priorityConfig[order.priority];
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{order.title}</p>
                            <p className="text-sm text-muted-foreground">{order.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-foreground">{order.clientName}</span>
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
                          <span className="text-sm text-muted-foreground">
                            {order.supplier || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-foreground">
                            EGP {order.value.toLocaleString()}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperationsDashboard;
