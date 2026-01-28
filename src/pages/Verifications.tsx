import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Wallet,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface VerificationRecord {
  id: string;
  token_id: string;
  wallet_address: string;
  ai_confidence: number | null;
  verified_at: string | null;
  created_at: string;
  metadata: {
    status?: 'pending' | 'verified' | 'rejected';
    reason?: string;
    cardName?: string;
    ticker?: string;
    cardFrontUrl?: string;
    details?: {
      cardMatch?: boolean;
      ownershipProof?: boolean;
      authenticityScore?: number;
    };
  } | null;
  token?: {
    name: string;
    ticker: string;
    image_url: string | null;
    status: string;
  };
}

type FilterStatus = 'all' | 'pending' | 'verified' | 'rejected';

export default function Verifications() {
  const wallet = useWallet();
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedVerification, setSelectedVerification] = useState<VerificationRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVerifications();
  }, [wallet.publicKey]);

  const loadVerifications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('verifications')
        .select(`
          *,
          token:tokens(name, ticker, image_url, status)
        `)
        .order('created_at', { ascending: false });

      if (wallet.publicKey) {
        query = query.eq('wallet_address', wallet.publicKey.toString());
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        token: item.token as VerificationRecord['token'],
        metadata: item.metadata as VerificationRecord['metadata'],
      }));
      
      setVerifications(transformedData);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (verification: VerificationRecord): 'pending' | 'verified' | 'rejected' => {
    if (verification.metadata?.status) return verification.metadata.status;
    if (verification.verified_at && verification.ai_confidence && verification.ai_confidence >= 70) return 'verified';
    if (verification.verified_at && verification.ai_confidence && verification.ai_confidence < 70) return 'rejected';
    return 'pending';
  };

  const filteredVerifications = verifications.filter(v => {
    const status = getStatus(v);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesSearch = !searchQuery || 
      v.token?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.token?.ticker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.metadata?.cardName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: verifications.length,
    pending: verifications.filter(v => getStatus(v) === 'pending').length,
    verified: verifications.filter(v => getStatus(v) === 'verified').length,
    rejected: verifications.filter(v => getStatus(v) === 'rejected').length,
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-[hsl(var(--status-verified))]" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground animate-pulse" />;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      verified: "bg-[hsl(var(--status-verified))]/10 text-[hsl(var(--status-verified))] border-[hsl(var(--status-verified))]/30",
      rejected: "bg-destructive/10 text-destructive border-destructive/30",
      pending: "bg-muted text-muted-foreground border-border",
    };

    return (
      <Badge 
        variant="outline" 
        className={cn("font-mono uppercase text-xs", variants[status as keyof typeof variants] || variants.pending)}
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl text-foreground mb-2">VERIFICATIONS</h1>
        <p className="text-muted-foreground">Track all your card verification requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: statusCounts.all, color: 'text-foreground' },
          { label: 'Pending', value: statusCounts.pending, color: 'text-muted-foreground' },
          { label: 'Verified', value: statusCounts.verified, color: 'text-[hsl(var(--status-verified))]' },
          { label: 'Rejected', value: statusCounts.rejected, color: 'text-destructive' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card p-4 border-2 border-foreground">
            <p className="text-sm text-muted-foreground uppercase font-mono">{stat.label}</p>
            <p className={cn("font-display text-3xl", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by card name or ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-2 border-foreground"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'pending', 'verified', 'rejected'] as FilterStatus[]).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={cn(
                "font-mono uppercase text-xs",
                filterStatus !== status && "border-2 border-foreground"
              )}
            >
              {status} ({statusCounts[status]})
            </Button>
          ))}
        </div>
      </div>

      {/* Verifications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card p-4 border-2 border-foreground">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-20 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVerifications.length === 0 ? (
        <div className="text-center py-16 bg-card border-2 border-foreground">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl mb-2">No Verifications Found</h3>
          <p className="text-muted-foreground mb-6">
            {wallet.connected 
              ? "You haven't submitted any cards for verification yet."
              : "Connect your wallet to see your verifications."}
          </p>
          {!wallet.connected && (
            <Button 
              onClick={() => wallet.select(wallet.wallets[0]?.adapter.name)}
              className="gap-2"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVerifications.map((verification) => {
            const status = getStatus(verification);
            const cardName = verification.token?.name || verification.metadata?.cardName || 'Unknown Card';
            const ticker = verification.token?.ticker || verification.metadata?.ticker || '???';
            const imageUrl = verification.token?.image_url || verification.metadata?.cardFrontUrl;

            return (
              <div
                key={verification.id}
                className={cn(
                  "bg-card p-4 border-2 transition-all cursor-pointer hover:bg-muted/50",
                  status === 'verified' && "border-[hsl(var(--status-verified))]/50",
                  status === 'rejected' && "border-destructive/50",
                  status === 'pending' && "border-foreground"
                )}
                onClick={() => setSelectedVerification(verification)}
              >
                <div className="flex items-center gap-4">
                  {/* Card Image */}
                  <div className="w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt={cardName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Eye className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-lg truncate">{cardName}</h3>
                      <span className="text-muted-foreground font-mono text-sm">${ticker}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(verification.created_at)}
                      </span>
                      {verification.ai_confidence && (
                        <span>Confidence: {verification.ai_confidence}%</span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <StatusIcon status={status} />
                    <StatusBadge status={status} />
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
        <DialogContent className="max-w-2xl border-2 border-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Verification Details</DialogTitle>
          </DialogHeader>

          {selectedVerification && (
            <div className="space-y-6">
              {/* Status Header */}
              <div className={cn(
                "p-4 rounded-lg",
                getStatus(selectedVerification) === 'verified' && "bg-[hsl(var(--status-verified))]/10",
                getStatus(selectedVerification) === 'rejected' && "bg-destructive/10",
                getStatus(selectedVerification) === 'pending' && "bg-muted"
              )}>
                <div className="flex items-center gap-3">
                  <StatusIcon status={getStatus(selectedVerification)} />
                  <div>
                    <h3 className="font-display text-xl uppercase">{getStatus(selectedVerification)}</h3>
                    {selectedVerification.metadata?.reason && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedVerification.metadata.reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Card Name</p>
                  <p className="font-display text-lg">
                    {selectedVerification.token?.name || selectedVerification.metadata?.cardName || 'Unknown'}
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Ticker</p>
                  <p className="font-display text-lg">
                    ${selectedVerification.token?.ticker || selectedVerification.metadata?.ticker || '???'}
                  </p>
                </div>
              </div>

              {/* AI Analysis */}
              {selectedVerification.ai_confidence && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">AI Analysis</p>
                  <div className="flex items-center justify-between mb-3">
                    <span>Confidence Score</span>
                    <span className={cn(
                      "font-display text-2xl",
                      selectedVerification.ai_confidence >= 70 ? "text-[hsl(var(--status-verified))]" : "text-destructive"
                    )}>
                      {selectedVerification.ai_confidence}%
                    </span>
                  </div>
                  
                  {selectedVerification.metadata?.details && (
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Card Match</p>
                        {selectedVerification.metadata.details.cardMatch ? (
                          <CheckCircle className="w-6 h-6 text-[hsl(var(--status-verified))] mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-destructive mx-auto" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Ownership</p>
                        {selectedVerification.metadata.details.ownershipProof ? (
                          <CheckCircle className="w-6 h-6 text-[hsl(var(--status-verified))] mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-destructive mx-auto" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Authenticity</p>
                        <p className="font-display text-lg">
                          {selectedVerification.metadata.details.authenticityScore}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>{formatDate(selectedVerification.created_at)}</p>
                </div>
                {selectedVerification.verified_at && (
                  <div>
                    <p className="text-muted-foreground">Verified At</p>
                    <p>{formatDate(selectedVerification.verified_at)}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-muted-foreground">Wallet</p>
                  <p className="font-mono text-xs break-all">{selectedVerification.wallet_address}</p>
                </div>
              </div>

              {/* Actions */}
              {getStatus(selectedVerification) === 'rejected' && (
                <Button className="w-full gap-2" onClick={() => {
                  setSelectedVerification(null);
                  window.location.href = '/app/create';
                }}>
                  Try Again with New Images
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
