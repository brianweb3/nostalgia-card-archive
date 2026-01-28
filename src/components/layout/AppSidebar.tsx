import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Zap, 
  PlusCircle, 
  BarChart2, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Live Tokens", icon: Zap },
  { path: "/create", label: "Create", icon: PlusCircle },
  { path: "/stats", label: "Stats", icon: BarChart2 },
  { path: "/docs", label: "Docs", icon: FileText },
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
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200 z-50",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CardPump</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item",
                isActive && "active",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* External links */}
      <div className="py-4 px-2 border-t border-sidebar-border">
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "nav-item",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "X (Twitter)" : undefined}
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>X (Twitter)</span>}
        </a>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="h-12 flex items-center justify-center border-t border-sidebar-border hover:bg-muted/50 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}
