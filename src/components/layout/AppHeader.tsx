import { PlusCircle, Loader2, LogOut, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast";

const HELIUS_RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=c5040336-825d-42e6-a592-59ef6633316c';

export function AppHeader() {
  const { walletAddress, isConnecting, isConnected, connect, disconnect, shortenAddress } = usePhantomWallet();
  const [liveCount, setLiveCount] = useState(0);
  const [balance, setBalance] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch balance using Helius RPC
  const fetchBalance = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const connection = new Connection(HELIUS_RPC_URL, 'confirmed');
      const pubKey = new PublicKey(walletAddress);
      const bal = await connection.getBalance(pubKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchBalance();
      // Refresh balance every 30 seconds
      const interval = setInterval(fetchBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, walletAddress, fetchBalance]);

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

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({ title: "Copied!", description: "Wallet address copied" });
    }
  };

  return (
    <header className="h-14 border-b-2 border-foreground bg-card sticky top-0 z-40 flex items-center justify-between px-4">
      {/* Live indicator */}
      <div className="live-indicator">
        <div className="live-dot" />
        <span className="font-mono text-sm uppercase">{liveCount} LIVE</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Link to="/app/create">
          <Button size="sm" className="gap-2 bg-primary border-2 border-foreground font-mono text-xs uppercase">
            <PlusCircle className="w-4 h-4" />
            Create
          </Button>
        </Link>
        
        {isConnected ? (
          <div className="flex items-center gap-2">
            {/* Balance display */}
            <div className="hidden sm:flex items-center gap-2 border-2 border-foreground px-3 py-1.5 bg-card">
              <span className="font-mono text-xs text-primary">
                {balance !== null ? balance.toFixed(4) : '...'} SOL
              </span>
            </div>
            
            {/* Wallet address */}
            <div className="flex items-center gap-1 border-2 border-foreground px-3 py-1.5 bg-card">
              <span className="font-mono text-xs">{shortenAddress(walletAddress)}</span>
              <button onClick={copyAddress} className="text-primary hover:text-primary/80 ml-1">
                <Copy className="w-3 h-3" />
              </button>
            </div>
            
            {/* Disconnect */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={disconnect}
              className="border-2 border-foreground font-mono text-xs uppercase gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Disconnect</span>
            </Button>
          </div>
        ) : (
          <Button 
            size="sm" 
            onClick={connect}
            disabled={isConnecting}
            className="gap-2 border-2 border-foreground font-mono text-xs uppercase bg-card text-foreground hover:bg-muted"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            <span>{isConnecting ? "CONNECTING..." : "SELECT WALLET"}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
