import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Phantom icon
const PhantomIcon = () => (
  <svg viewBox="0 0 128 128" className="w-5 h-5">
    <circle cx="64" cy="64" r="64" fill="url(#phantom-gradient)" />
    <path
      d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 14.8716 41.3057 14.4118 64.0583C13.936 87.5493 34.7821 107 58.3423 107H63.5755C84.4216 107 110.584 89.1089 110.584 64.9142ZM42.2821 68.5198C42.2821 72.0141 39.4351 74.8528 35.9301 74.8528C32.4251 74.8528 29.578 72.0141 29.578 68.5198V60.5604C29.578 57.0661 32.4251 54.2274 35.9301 54.2274C39.4351 54.2274 42.2821 57.0661 42.2821 60.5604V68.5198ZM65.5874 68.5198C65.5874 72.0141 62.7403 74.8528 59.2353 74.8528C55.7303 74.8528 52.8833 72.0141 52.8833 68.5198V60.5604C52.8833 57.0661 55.7303 54.2274 59.2353 54.2274C62.7403 54.2274 65.5874 57.0661 65.5874 60.5604V68.5198Z"
      fill="white"
    />
    <defs>
      <linearGradient id="phantom-gradient" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
        <stop stopColor="#534BB1" />
        <stop offset="1" stopColor="#551BF9" />
      </linearGradient>
    </defs>
  </svg>
);

export function AppHeader() {
  const { walletAddress, isConnecting, isConnected, connect, disconnect, shortenAddress } = usePhantomWallet();
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    // Fetch initial count
    const fetchCount = async () => {
      const { count } = await supabase
        .from('tokens')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'launched');
      setLiveCount(count || 0);
    };
    fetchCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('tokens-count')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tokens' },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Live indicator */}
      <div className="flex items-center gap-2 text-sm text-primary">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-display text-lg">{liveCount} LIVE</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <Link to="/app/create">
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
            <PlusCircle className="w-4 h-4" />
            Create
          </Button>
        </Link>
        
        <div className="w-px h-6 bg-border" />
        
        {isConnected ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnect}
            className="gap-2 border-primary/30 hover:bg-primary/10"
          >
            <PhantomIcon />
            <span className="font-mono text-xs">{shortenAddress(walletAddress)}</span>
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={connect}
            disabled={isConnecting}
            className="gap-2 border-primary/30 hover:bg-primary/10"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PhantomIcon />
            )}
            <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
