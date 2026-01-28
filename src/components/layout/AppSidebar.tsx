import { Link, useLocation } from "react-router-dom";
import { 
  Zap, 
  PlusCircle, 
  BarChart2, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  Home,
  Video,
  ExternalLink,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/app", label: "Live Tokens", icon: Zap },
  { path: "/app/create", label: "Create", icon: PlusCircle },
  { path: "/app/stats", label: "Stats", icon: BarChart2 },
  { path: "/app/docs", label: "Docs", icon: FileText },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo + Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-primary" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
            <div className="absolute w-full h-1 bg-black/80 top-1/2 -translate-y-1/2" />
            <div className="absolute w-3 h-3 rounded-full bg-white border-2 border-black/80 z-10" />
          </div>
          {!collapsed && (
            <span className="font-display text-xl text-foreground tracking-wide">CARDPUMP</span>
          )}
        </Link>
      </div>

      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-50"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item",
                isActive && "active",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Create button */}
      <div className="p-3 border-t border-sidebar-border">
        <Link to="/app/create">
          <Button 
            className={cn(
              "w-full bg-primary hover:bg-primary/90 gap-2",
              collapsed && "px-0"
            )}
          >
            <PlusCircle className="w-4 h-4" />
            {!collapsed && <span>Create Token</span>}
          </Button>
        </Link>
      </div>

      {/* External links */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-item"
          >
            <ExternalLink className="w-4 h-4" />
            <span>X (Twitter)</span>
          </a>
        </div>
      )}
    </aside>
  );
}
