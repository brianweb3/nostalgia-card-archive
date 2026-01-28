import { Search, Radio, PlusCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AppHeader() {
  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-9 pl-9 pr-12 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">K</kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Radio className="w-4 h-4" />
          Go live
        </Button>
        <Link to="/create">
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
            <PlusCircle className="w-4 h-4" />
            Create token
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <Wallet className="w-3 h-3 text-primary" />
          </div>
          <span className="font-mono text-xs">63W2Jt...</span>
        </Button>
      </div>
    </header>
  );
}
