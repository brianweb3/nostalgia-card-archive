import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  PanelLeftClose, 
  PanelLeftOpen
} from "lucide-react";

// Custom SVG Icons for unique look
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M8 7h8" />
    <path d="M8 11h6" />
  </svg>
);

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: "/app", icon: IconHome, label: "Live Tokens" },
  { path: "/app/create", icon: IconBolt, label: "Create Token" },
  { path: "/app/stats", icon: IconChart, label: "Statistics" },
  { path: "/app/docs", icon: IconBook, label: "Documentation" },
];

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-200 flex flex-col",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-primary" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
              <div className="absolute w-full h-0.5 bg-black/80 top-1/2 -translate-y-1/2" />
              <div className="absolute w-2 h-2 rounded-full bg-white border-2 border-black/80 z-10" />
            </div>
            <span className="font-display text-lg text-foreground">CARDPUMP</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-primary" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
              <div className="absolute w-full h-0.5 bg-black/80 top-1/2 -translate-y-1/2" />
              <div className="absolute w-2 h-2 rounded-full bg-white border-2 border-black/80 z-10" />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <div className={cn(
                "transition-transform duration-200",
                !isActive && "group-hover:scale-110"
              )}>
                <item.icon />
              </div>
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "w-full justify-center hover:bg-muted",
            collapsed ? "px-0" : ""
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <>
              <PanelLeftClose className="w-5 h-5 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
