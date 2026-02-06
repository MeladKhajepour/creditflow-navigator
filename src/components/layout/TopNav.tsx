import { Link, useLocation } from "react-router-dom";
import { Shield, BarChart3, Activity } from "lucide-react";

export default function TopNav() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="h-14 border-b border-border/50 glass flex items-center justify-between px-4 shrink-0 z-50">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-semibold tracking-tight">
          CreditOps <span className="text-primary">Copilot</span>
        </span>
      </Link>

      <nav className="flex items-center gap-1">
        <Link
          to="/"
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            !isAdmin
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
          Assessment
        </Link>
        <Link
          to="/admin"
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            isAdmin
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
          Admin
        </Link>
      </nav>
    </header>
  );
}
