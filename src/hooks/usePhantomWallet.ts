import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: unknown) => void) => void;
  removeListener: (event: string, callback: (args: unknown) => void) => void;
  publicKey?: { toString: () => string };
  isConnected?: boolean;
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
    solana?: PhantomProvider;
  }
}

export function usePhantomWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);
  const { toast } = useToast();

  const getProvider = (): PhantomProvider | null => {
    if (typeof window === "undefined") return null;
    
    if (window.phantom?.solana?.isPhantom) {
      return window.phantom.solana;
    }
    
    if (window.solana?.isPhantom) {
      return window.solana;
    }
    
    return null;
  };

  useEffect(() => {
    const provider = getProvider();
    setIsPhantomInstalled(!!provider);

    if (provider?.publicKey) {
      setWalletAddress(provider.publicKey.toString());
    }

    const handleAccountChange = (publicKey: unknown) => {
      if (publicKey && typeof publicKey === 'object' && 'toString' in publicKey) {
        setWalletAddress((publicKey as { toString: () => string }).toString());
      } else {
        setWalletAddress(null);
      }
    };

    const handleDisconnect = () => {
      setWalletAddress(null);
    };

    if (provider) {
      provider.on("accountChanged", handleAccountChange);
      provider.on("disconnect", handleDisconnect);

      return () => {
        provider.removeListener("accountChanged", handleAccountChange);
        provider.removeListener("disconnect", handleDisconnect);
      };
    }
  }, []);

  const saveWalletConnection = async (address: string) => {
    try {
      await supabase
        .from("wallet_connections")
        .upsert(
          {
            wallet_address: address,
            wallet_type: "phantom",
            last_active_at: new Date().toISOString(),
          },
          { onConflict: "wallet_address" }
        );
    } catch (error) {
      console.error("Failed to save wallet connection:", error);
    }
  };

  const connect = useCallback(async () => {
    const provider = getProvider();

    if (!provider) {
      window.open("https://phantom.app/", "_blank");
      toast({
        title: "Phantom не установлен",
        description: "Перенаправляем на страницу загрузки Phantom...",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const response = await provider.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      await saveWalletConnection(address);
      
      toast({
        title: "Кошелёк подключён",
        description: `${address.slice(0, 4)}...${address.slice(-4)}`,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Ошибка подключения",
        description: "Не удалось подключить кошелёк",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    const provider = getProvider();

    if (provider) {
      try {
        await provider.disconnect();
        setWalletAddress(null);
        toast({
          title: "Кошелёк отключён",
          description: "Вы вышли из аккаунта",
        });
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
      }
    }
  }, [toast]);

  const shortenAddress = (address: string | null): string => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return {
    walletAddress,
    isConnecting,
    isPhantomInstalled,
    isConnected: !!walletAddress,
    connect,
    disconnect,
    shortenAddress,
  };
}
