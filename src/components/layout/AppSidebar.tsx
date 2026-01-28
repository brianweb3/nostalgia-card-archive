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
  Terminal,
  MessageCircle,
  User,
  HelpCircle,
  MoreHorizontal,
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/livestreams", label: "Livestreams", icon: Video },
  { path: "/terminal", label: "Terminal", icon: Terminal },
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
      <div className="h-14 flex items-center gap-2 px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-bold text-foreground">CardPump</span>}
        </Link>
        <button
          onClick={onToggle}
          className={cn(
            "ml-auto p-1 rounded hover:bg-muted/50 text-muted-foreground",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
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

      {/* Create coin button */}
      <div className="p-3 border-t border-sidebar-border">
        <Link to="/create">
          <Button 
            className={cn(
              "w-full bg-primary hover:bg-primary/90",
              collapsed && "px-2"
            )}
          >
            <PlusCircle className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Create token</span>}
          </Button>
        </Link>
      </div>

      {/* App promo - only when expanded */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">CardPump app</span>
            <button className="text-muted-foreground hover:text-foreground">×</button>
          </div>
          <div className="w-20 h-20 bg-foreground rounded-lg mx-auto mb-2 flex items-center justify-center">
            <QrCode className="w-16 h-16 text-background" />
          </div>
          <p className="text-xs text-muted-foreground text-center mb-2">Scan to download</p>
          <Button variant="outline" size="sm" className="w-full text-xs">
            Learn more
          </Button>
        </div>
      )}

      {/* Collapsed expand button */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="h-12 flex items-center justify-center border-t border-sidebar-border hover:bg-muted/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
    </aside>
  );
}
