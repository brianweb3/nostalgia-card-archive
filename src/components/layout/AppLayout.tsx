import { useState, useEffect } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AdminPanel } from "@/components/AdminPanel";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Listen for Ctrl+Shift+A to open admin panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminPanelOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={cn(
          "min-h-screen transition-all duration-200 flex flex-col",
          sidebarCollapsed ? "ml-14" : "ml-52"
        )}
      >
        <AppHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {/* Admin Panel */}
      <AdminPanel 
        open={adminPanelOpen} 
        onClose={() => setAdminPanelOpen(false)} 
      />
    </div>
  );
}
