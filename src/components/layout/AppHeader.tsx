import { Search, Radio, PlusCircle, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AppHeader() {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tokens..."
          className="w-full h-10 pl-10 pr-12 rounded-xl bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">K</kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-medium">142 Live</span>
        </div>
        
        <div className="w-px h-6 bg-border" />
        
        <Link to="/app/create">
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
            <PlusCircle className="w-4 h-4" />
            Create
          </Button>
        </Link>
        
        <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:bg-primary/10">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Wallet className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-mono text-xs">63W2Jt...</span>
        </Button>
      </div>
    </header>
  );
}
