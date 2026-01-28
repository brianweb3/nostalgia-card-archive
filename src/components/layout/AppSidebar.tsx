import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  PanelLeftClose, 
  PanelLeftOpen,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Custom SVG Icons
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

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: "/app", icon: IconHome, label: "Live Tokens" },
  { path: "/app/create", icon: IconBolt, label: "Create Token" },
  { path: "/app/verifications", icon: IconShield, label: "Verifications" },
  { path: "/app/stats", icon: IconChart, label: "Statistics" },
  { path: "/app/docs", icon: IconBook, label: "Manifesto" },
];

// Contract address for COPY CA functionality
const CONTRACT_ADDRESS = "COMING_SOON";

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCA = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Contract address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r-2 border-foreground z-50 transition-all duration-200 flex flex-col",
        collapsed ? "w-14" : "w-52"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-3 border-b-2 border-foreground">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <div className="bg-primary px-2 py-0.5">
              <span className="font-display text-base text-primary-foreground">POKE.FUN</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="font-display text-sm text-primary-foreground">P</span>
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
                "flex items-center gap-3 px-3 py-2 transition-all duration-200 font-mono text-xs uppercase",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-primary hover:bg-primary/10"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon />
              {!collapsed && (
                <span>{item.label}</span>
              )}
            </Link>
          );
        })}
        
        {/* X Community Link */}
        <a
          href="https://x.com/i/communities/2016570771590566351/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 transition-all duration-200 font-mono text-xs uppercase text-primary hover:bg-primary/10 mt-4 border-t border-border pt-4"
          title={collapsed ? "X Community" : undefined}
        >
          <IconX />
          {!collapsed && <span>X Community</span>}
        </a>

        {/* Copy CA Button */}
        <button
          onClick={handleCopyCA}
          className="flex items-center gap-3 px-3 py-2 transition-all duration-200 font-mono text-xs uppercase text-primary hover:bg-primary/10 w-full"
          title={collapsed ? "Copy CA" : undefined}
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {!collapsed && <span>{copied ? "Copied!" : "Copy CA"}</span>}
        </button>
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t-2 border-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "w-full justify-center hover:bg-primary/10 text-primary",
            collapsed ? "px-0" : ""
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 mr-2" />
              <span className="font-mono text-xs uppercase">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
