import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Factory } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate network latency
    setTimeout(() => {
      // The user requested password from 1 to 9
      if (password === "123456789") {
        localStorage.setItem("thaqeb_admin_auth", "true");
        localStorage.setItem("thaqeb_admin_email", email);
        navigate("/admin/content");
      } else {
        setError("Invalid credentials. Please use password '123456789'.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-5" />
      <div className="absolute -top-[300px] right-[100px] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="z-10 w-full max-w-md space-y-8 rounded-2xl border border-border/50 bg-card/50 p-8 shadow-xl backdrop-blur-xl transition-all">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-glow">
            <Factory className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
              Admin Gateway
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to manage Articles and Services
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 mt-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                placeholder="admin@thaqeb.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Authenticating..." : "Sign In to Command Center"}
          </button>
        </form>
      </div>
    </div>
  );
}
