import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Factory,
  Plus,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  FileText,
  Truck,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type OrderStatus = "submitted" | "under_review" | "in_production" | "quality_check" | "shipped" | "delivered";

interface Order {
  id: string;
  title: string;
  process: string;
  status: OrderStatus;
  createdAt: string;
  deadline: string;
  quantity: number;
}

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    title: "Aluminum Enclosure Parts",
    process: "CNC Machining",
    status: "in_production",
    createdAt: "2024-01-15",
    deadline: "2024-01-28",
    quantity: 50,
  },
  {
    id: "ORD-2024-002",
    title: "Steel Mounting Brackets",
    process: "Sheet Metal",
    status: "quality_check",
    createdAt: "2024-01-12",
    deadline: "2024-01-25",
    quantity: 100,
  },
  {
    id: "ORD-2024-003",
    title: "Prototype Gears",
    process: "3D Printing",
    status: "submitted",
    createdAt: "2024-01-18",
    deadline: "2024-02-01",
    quantity: 10,
  },
  {
    id: "ORD-2024-004",
    title: "Custom Fasteners",
    process: "CNC Machining",
    status: "delivered",
    createdAt: "2024-01-05",
    deadline: "2024-01-18",
    quantity: 200,
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  submitted: { label: "Submitted", color: "bg-info/20 text-info border-info/30", icon: FileText },
  under_review: { label: "Under Review", color: "bg-warning/20 text-warning border-warning/30", icon: Clock },
  in_production: { label: "In Production", color: "bg-primary/20 text-primary border-primary/30", icon: Factory },
  quality_check: { label: "Quality Check", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: AlertCircle },
  shipped: { label: "Shipped", color: "bg-info/20 text-info border-info/30", icon: Truck },
  delivered: { label: "Delivered", color: "bg-success/20 text-success border-success/30", icon: CheckCircle2 },
};

const ClientDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    active: mockOrders.filter((o) => !["delivered", "shipped"].includes(o.status)).length,
    pending: mockOrders.filter((o) => o.status === "submitted").length,
    completed: mockOrders.filter((o) => o.status === "delivered").length,
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium"
          >
            <Package className="h-5 w-5" />
            My Orders
          </Link>
          <Link
            to="/get-quote"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Quote
          </Link>
          <Link
            to="/dashboard/settings"
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
            <div className="lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow">
                  <Factory className="h-4 w-4 text-primary-foreground" />
                </div>
              </Link>
            </div>
            <h1 className="font-display text-xl font-semibold text-foreground">
              My Orders
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">AH</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Active Orders</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.active}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">Pending Quote</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
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
                placeholder="Search orders..."
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

          {/* Orders List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
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
                      Qty
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Deadline
                    </th>
                    <th className="text-right text-sm font-medium text-muted-foreground px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status];
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
                          <span className="text-sm text-foreground">{order.process}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-foreground">{order.quantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.deadline).toLocaleDateString()}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
