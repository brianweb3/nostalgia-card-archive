import { useState, useCallback, useRef, ChangeEvent, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { 
  Upload, 
  Camera, 
  Shield, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Rocket,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Eye,
  Cpu,
  Video,
  RefreshCw,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createPumpFunToken, getWalletBalance, checkMinimumBalance, formatSolBalance, type TokenMetadata } from "@/lib/pumpfun";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;
type VerificationStatus = 'idle' | 'verifying' | 'verified' | 'failed';
type DeployStatus = 'idle' | 'deploying' | 'success' | 'failed';
type MediaType = 'photo' | 'video';

interface VerificationResult {
  verified: boolean;
  confidence: number;
  reason: string;
  details?: {
    cardMatch: boolean;
    ownershipProof: boolean;
    authenticityScore: number;
  };
}

// Generate unique verification ID
const generateVerificationId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export default function CreateToken() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { toast } = useToast();
  
  // Step state
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  // Form state
  const [cardName, setCardName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [devBuyAmount, setDevBuyAmount] = useState("0.1");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  
  // Image state - 3 separate images
  const [cardFrontImage, setCardFrontImage] = useState<string | null>(null);
  const [cardBackImage, setCardBackImage] = useState<string | null>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [proofVideo, setProofVideo] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('photo');
  
  // Unique verification ID
  const [verificationId, setVerificationId] = useState<string>(() => generateVerificationId());
  
  // Refs
  const cardFrontInputRef = useRef<HTMLInputElement>(null);
  const cardBackInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Status state
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle');
  const [deployResult, setDeployResult] = useState<{ mintAddress?: string; pumpUrl?: string; signature?: string } | null>(null);
  const [verificationProgress, setVerificationProgress] = useState(0);
  
  // Balance state
  const [balance, setBalance] = useState<number | null>(null);

  // Regenerate verification ID
  const regenerateId = () => {
    setVerificationId(generateVerificationId());
    toast({
      title: "New ID generated",
      description: "Write this new ID on paper for verification",
    });
  };

  // Load balance when wallet connects
  const loadBalance = useCallback(async () => {
    if (wallet.publicKey) {
      const bal = await getWalletBalance(connection, wallet.publicKey);
      setBalance(bal);
    }
  }, [wallet.publicKey, connection]);

  useEffect(() => {
    if (wallet.connected) {
      loadBalance();
    }
  }, [wallet.connected, loadBalance]);

  // Handle image upload
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'proof') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'front') {
        setCardFrontImage(base64);
      } else if (type === 'back') {
        setCardBackImage(base64);
      } else {
        setProofImage(base64);
        setProofVideo(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle video upload
  const handleVideoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum video size is 50MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setProofVideo(base64);
      setProofImage(null);
    };
    reader.readAsDataURL(file);
  };

  // AI Verification with progress
  const verifyCard = async () => {
    if (!cardFrontImage || !cardBackImage || (!proofImage && !proofVideo)) {
      toast({
        title: "Upload all images",
        description: "Card front, back, and ownership proof are required",
        variant: "destructive",
      });
      return;
    }

    if (!wallet.publicKey) {
      toast({
        title: "Connect wallet",
        description: "Wallet connection is required for verification",
        variant: "destructive",
      });
      return;
    }

    if (!cardName || !ticker) {
      toast({
        title: "Fill in token details",
        description: "Token name and ticker are required",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(2);
    setVerificationStatus('verifying');
    setVerificationResult(null);
    setVerificationProgress(0);

    // Simulate progress over ~30 seconds
    const progressInterval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 8;
      });
    }, 1000);

    try {
      const { data, error } = await supabase.functions.invoke('verify-card', {
        body: {
          cardFrontUrl: cardFrontImage,
          cardBackUrl: cardBackImage,
          proofImageUrl: proofImage || proofVideo,
          cardName: cardName || 'Unknown Card',
          walletAddress: wallet.publicKey.toString(),
          verificationId: verificationId,
        },
      });

      clearInterval(progressInterval);
      setVerificationProgress(100);

      if (error) throw error;

      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));

      setVerificationResult(data);
      setVerificationStatus(data.verified ? 'verified' : 'failed');
      setCurrentStep(3);

      if (data.verified) {
        toast({
          title: "✅ Card Verified!",
          description: `Confidence: ${data.confidence}%`,
        });
      } else {
        toast({
          title: "❌ Verification Failed",
          description: data.reason,
          variant: "destructive",
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Verification error:', error);
      setVerificationStatus('failed');
      setCurrentStep(3);
      setVerificationResult({
        verified: false,
        confidence: 0,
        reason: error instanceof Error ? error.message : "Verification system error. Please try again.",
      });
      toast({
        title: "Verification Error",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Deploy to pump.fun
  const deployToken = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast({
        title: "Connect wallet",
        description: "Connected wallet is required for deployment",
        variant: "destructive",
      });
      return;
    }

    if (verificationStatus !== 'verified') {
      toast({
        title: "Verification required",
        description: "Card must be AI verified first",
        variant: "destructive",
      });
      return;
    }

    if (!cardName || !ticker) {
      toast({
        title: "Fill in details",
        description: "Token name and ticker are required",
        variant: "destructive",
      });
      return;
    }

    // Check balance
    await loadBalance();
    if (balance !== null && !checkMinimumBalance(balance)) {
      toast({
        title: "Insufficient SOL",
        description: "Minimum 0.02 SOL required to create token",
        variant: "destructive",
      });
      return;
    }

    setDeployStatus('deploying');

    try {
      const metadata: TokenMetadata = {
        name: cardName,
        symbol: ticker.toUpperCase(),
        description: description || `${cardName} - Verified Trading Card Token`,
        imageUrl: cardFrontImage || '',
        twitter: twitter || undefined,
        website: website || undefined,
      };

      const result = await createPumpFunToken(
        connection,
        {
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction,
        },
        {
          metadata,
          devBuyAmountSol: parseFloat(devBuyAmount) || 0,
        }
      );

      if (result.success) {
        setDeployStatus('success');
        setDeployResult(result);

        // Save to database
        try {
          await supabase.from('tokens').insert({
            name: cardName,
            ticker: ticker.toUpperCase(),
            description: description || `${cardName} - Verified Trading Card Token`,
            image_url: cardFrontImage,
            wallet_address: wallet.publicKey.toString(),
            status: 'launched',
            rarity: 'common',
            market_cap: 0,
            progress: 0,
          });
        } catch (dbError) {
          console.error('Failed to save token to database:', dbError);
        }

        toast({
          title: "🎉 Token Created!",
          description: `Mint: ${result.mintAddress?.slice(0, 8)}...`,
        });
      } else {
        setDeployStatus('failed');
        toast({
          title: "Deployment Failed",
          description: result.error || "Failed to create token",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Deploy error:', error);
      setDeployStatus('failed');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  const hasProofMedia = proofImage || proofVideo;
  const isFormValid = cardName && ticker && cardFrontImage && cardBackImage && hasProofMedia;
  const canStartVerification = isFormValid && wallet.connected;
  const canDeploy = verificationStatus === 'verified' && isFormValid && wallet.connected;

  const resetFlow = () => {
    setCurrentStep(1);
    setVerificationStatus('idle');
    setVerificationResult(null);
    setDeployStatus('idle');
    setDeployResult(null);
    setVerificationProgress(0);
    setVerificationId(generateVerificationId());
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl text-foreground mb-2">CREATE TOKEN</h1>
        <p className="text-muted-foreground">Verify your card and launch a token on pump.fun</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
          currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <span className="font-display">1</span>
          <span className="text-sm">Upload & Details</span>
        </div>
        <div className={cn("w-8 h-0.5 transition-colors", currentStep >= 2 ? "bg-primary" : "bg-border")} />
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
          currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <span className="font-display">2</span>
          <span className="text-sm">AI Verification</span>
        </div>
        <div className={cn("w-8 h-0.5 transition-colors", currentStep >= 3 ? "bg-primary" : "bg-border")} />
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
          currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <span className="font-display">3</span>
          <span className="text-sm">Deploy</span>
        </div>
      </div>

      {/* Step 1: Upload & Details */}
      {currentStep === 1 && (
        <div className="animate-fade-in">
          {/* Verification ID Banner */}
          <div className="pokemon-card p-4 mb-6 border-primary/50 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Hash className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Your Verification ID</p>
                  <p className="font-display text-2xl text-primary tracking-widest">{verificationId}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={regenerateId} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Generate New
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Write this ID on a piece of paper and include it in your ownership proof photo/video
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Images */}
            <div className="space-y-4">
              {/* 3 Photo Upload Blocks */}
              <div className="grid grid-cols-3 gap-4">
                {/* Card Front */}
                <div className="pokemon-card p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-xs">Front</span>
                  </div>
                  <div 
                    onClick={() => cardFrontInputRef.current?.click()}
                    className={cn(
                      "relative aspect-[3/4] rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden",
                      cardFrontImage ? "border-primary" : "border-border hover:border-primary/50"
                    )}
                  >
                    {cardFrontImage ? (
                      <img src={cardFrontImage} alt="Card Front" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-2">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-[10px] text-center">Card front</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={cardFrontInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'front')}
                    className="hidden"
                  />
                </div>

                {/* Card Back */}
                <div className="pokemon-card p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-xs">Back</span>
                  </div>
                  <div 
                    onClick={() => cardBackInputRef.current?.click()}
                    className={cn(
                      "relative aspect-[3/4] rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden",
                      cardBackImage ? "border-primary" : "border-border hover:border-primary/50"
                    )}
                  >
                    {cardBackImage ? (
                      <img src={cardBackImage} alt="Card Back" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-2">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-[10px] text-center">Card back</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={cardBackInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'back')}
                    className="hidden"
                  />
                </div>

                {/* Ownership Proof */}
                <div className="pokemon-card p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Camera className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-xs">+ ID</span>
                  </div>
                  <div 
                    onClick={() => mediaType === 'photo' ? proofInputRef.current?.click() : videoInputRef.current?.click()}
                    className={cn(
                      "relative aspect-[3/4] rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden",
                      hasProofMedia ? "border-primary" : "border-border hover:border-primary/50"
                    )}
                  >
                    {proofImage ? (
                      <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
                    ) : proofVideo ? (
                      <video src={proofVideo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-2">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-[10px] text-center">Card + ID</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={proofInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'proof')}
                    className="hidden"
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Media Type Toggle */}
              <div className="pokemon-card p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Ownership proof: photo or video of your card with ID <strong className="text-primary">{verificationId}</strong> written on paper
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={mediaType === 'photo' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMediaType('photo')}
                    className="gap-2 flex-1"
                  >
                    <Camera className="w-4 h-4" />
                    Photo
                  </Button>
                  <Button
                    variant={mediaType === 'video' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMediaType('video')}
                    className="gap-2 flex-1"
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </Button>
                </div>
              </div>
            </div>

            {/* Right - Token Details */}
            <div className="space-y-6">
              {/* Wallet Connection */}
              <div className="pokemon-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Wallet</h3>
                    {wallet.connected && balance !== null && (
                      <p className="text-sm text-muted-foreground">
                        Balance: {formatSolBalance(balance)} SOL
                      </p>
                    )}
                  </div>
                  <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg !h-10" />
                </div>
              </div>

              {/* Token Form */}
              <div className="pokemon-card p-4 space-y-4">
                <h3 className="font-display text-xl">TOKEN DETAILS</h3>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Card Name *</label>
                  <Input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Charizard Holo 1st Edition"
                    className="bg-muted/50"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Ticker *</label>
                  <Input
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 10))}
                    placeholder="CHAR"
                    className="bg-muted/50"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="PSA 10, 1999 Base Set, Mint condition..."
                    className="bg-muted/50 min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Dev Buy (SOL)</label>
                  <Input
                    type="number"
                    value={devBuyAmount}
                    onChange={(e) => setDevBuyAmount(e.target.value)}
                    placeholder="0.1"
                    min="0"
                    step="0.01"
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Amount of SOL to buy on creation
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Twitter</label>
                    <Input
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@username"
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Website</label>
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://"
                      className="bg-muted/50"
                    />
                  </div>
                </div>
              </div>

              {/* Start Verification Button */}
              <Button
                onClick={verifyCard}
                disabled={!canStartVerification}
                className="w-full gap-2 h-14 text-lg"
                size="lg"
              >
                <Shield className="w-6 h-6" />
                Start AI Verification
              </Button>

              {!wallet.connected && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>Connect wallet to continue</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: AI Verification */}
      {currentStep === 2 && verificationStatus === 'verifying' && (
        <div className="max-w-xl mx-auto animate-fade-in">
          <div className="pokemon-card p-8 text-center">
            {/* Animated Icons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <Eye className="w-16 h-16 text-primary animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
              </div>
              <span className="font-display text-4xl text-muted-foreground">+</span>
              <div className="relative">
                <Cpu className="w-16 h-16 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>

            <h2 className="font-display text-3xl text-foreground mb-2">VERIFYING...</h2>
            <p className="text-muted-foreground mb-6">
              AI + Computer Vision is analyzing your card and ownership proof
            </p>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                style={{ width: `${verificationProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.round(verificationProgress)}% complete
            </p>

            {/* Loading animation */}
            <div className="flex items-center justify-center gap-1 mt-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Result & Deploy */}
      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          {/* Verification Result */}
          {verificationResult && (
            <div className={cn(
              "pokemon-card p-6 mb-6",
              verificationResult.verified ? "border-[hsl(var(--status-verified))]" : "border-destructive"
            )}>
              <div className="flex items-center gap-3 mb-4">
                {verificationResult.verified ? (
                  <div className="w-16 h-16 rounded-full bg-[hsl(var(--status-verified))]/20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-[hsl(var(--status-verified))]" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-destructive" />
                  </div>
                )}
                <div>
                  <h2 className="font-display text-3xl">
                    {verificationResult.verified ? 'APPROVED' : 'REJECTED'}
                  </h2>
                  <p className="text-muted-foreground">
                    {verificationResult.verified 
                      ? 'Your card has been verified! You can now deploy your token.'
                      : 'Verification failed. Please check your images and try again.'}
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <p className="text-sm">{verificationResult.reason}</p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <span>Confidence: <strong className="text-primary">{verificationResult.confidence}%</strong></span>
                {verificationResult.details && (
                  <>
                    <span>Card Match: {verificationResult.details.cardMatch ? '✅' : '❌'}</span>
                    <span>Ownership: {verificationResult.details.ownershipProof ? '✅' : '❌'}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Deploy Section - Only if verified */}
          {verificationStatus === 'verified' && deployStatus !== 'success' && (
            <div className="pokemon-card p-6 mb-6">
              <h3 className="font-display text-2xl mb-4">DEPLOY TOKEN</h3>
              <p className="text-muted-foreground mb-6">
                Your card is verified. Click below to launch your token on pump.fun
              </p>
              
              <div className="flex items-center gap-4 mb-6 text-sm bg-muted/50 rounded-lg p-4">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2 font-medium">{cardName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Ticker:</span>
                  <span className="ml-2 font-medium">${ticker}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dev Buy:</span>
                  <span className="ml-2 font-medium">{devBuyAmount} SOL</span>
                </div>
              </div>

              <Button
                onClick={deployToken}
                disabled={deployStatus === 'deploying'}
                className="w-full gap-2 h-14 text-lg"
                size="lg"
              >
                {deployStatus === 'deploying' ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Deploying Token...
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    Deploy to pump.fun
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Deploy Success */}
          {deployStatus === 'success' && deployResult && (
            <div className="pokemon-card p-6 border-[hsl(var(--status-verified))]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--status-verified))]/20 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-[hsl(var(--status-verified))]" />
                </div>
                <div>
                  <h2 className="font-display text-3xl">TOKEN CREATED!</h2>
                  <p className="text-muted-foreground">Your token is now live on pump.fun</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="bg-muted/50 rounded-lg p-3">
                  <span className="text-sm text-muted-foreground">Mint Address:</span>
                  <code className="block font-mono text-sm mt-1 break-all">
                    {deployResult.mintAddress}
                  </code>
                </div>
                {deployResult.signature && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <span className="text-sm text-muted-foreground">Transaction:</span>
                    <code className="block font-mono text-sm mt-1 break-all">
                      {deployResult.signature}
                    </code>
                  </div>
                )}
              </div>

              <a
                href={deployResult.pumpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4"
              >
                <Button className="w-full gap-2 h-14 text-lg" size="lg">
                  <ExternalLink className="w-5 h-5" />
                  View on pump.fun
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={resetFlow}
                className="w-full gap-2"
              >
                Create Another Token
              </Button>
            </div>
          )}

          {/* Failed - Try Again */}
          {verificationStatus === 'failed' && (
            <Button
              onClick={resetFlow}
              variant="outline"
              className="w-full gap-2"
            >
              <XCircle className="w-5 h-5" />
              Try Again with Different Images
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
