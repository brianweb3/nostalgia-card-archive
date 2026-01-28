import { useState, useCallback, useRef, ChangeEvent } from "react";
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
  FileCheck,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createPumpFunToken, getWalletBalance, checkMinimumBalance, formatSolBalance, type TokenMetadata } from "@/lib/pumpfun";
import { cn } from "@/lib/utils";

type VerificationStatus = 'idle' | 'uploading' | 'verifying' | 'verified' | 'failed';
type DeployStatus = 'idle' | 'deploying' | 'success' | 'failed';

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

export default function CreateToken() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { toast } = useToast();
  
  // Form state
  const [cardName, setCardName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [devBuyAmount, setDevBuyAmount] = useState("0.1");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  
  // Image state
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  
  // Status state
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle');
  const [deployResult, setDeployResult] = useState<{ mintAddress?: string; pumpUrl?: string; signature?: string } | null>(null);
  
  // Balance state
  const [balance, setBalance] = useState<number | null>(null);

  // Load balance when wallet connects
  const loadBalance = useCallback(async () => {
    if (wallet.publicKey) {
      const bal = await getWalletBalance(connection, wallet.publicKey);
      setBalance(bal);
    }
  }, [wallet.publicKey, connection]);

  // Handle image upload
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, type: 'card' | 'proof') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Файл слишком большой",
        description: "Максимальный размер 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'card') {
        setCardImage(base64);
      } else {
        setProofImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Verification
  const verifyCard = async () => {
    if (!cardImage || !proofImage) {
      toast({
        title: "Загрузите изображения",
        description: "Нужны фото карты и пруф владения",
        variant: "destructive",
      });
      return;
    }

    if (!wallet.publicKey) {
      toast({
        title: "Подключите кошелёк",
        description: "Для верификации нужен кошелёк",
        variant: "destructive",
      });
      return;
    }

    setVerificationStatus('verifying');
    setVerificationResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('verify-card', {
        body: {
          cardImageUrl: cardImage,
          proofImageUrl: proofImage,
          cardName: cardName || 'Unknown Card',
          walletAddress: wallet.publicKey.toString(),
        },
      });

      if (error) throw error;

      setVerificationResult(data);
      setVerificationStatus(data.verified ? 'verified' : 'failed');

      if (data.verified) {
        toast({
          title: "✅ Карта верифицирована!",
          description: `Уверенность: ${data.confidence}%`,
        });
      } else {
        toast({
          title: "❌ Верификация не пройдена",
          description: data.reason,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('failed');
      toast({
        title: "Ошибка верификации",
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive",
      });
    }
  };

  // Deploy to pump.fun
  const deployToken = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast({
        title: "Подключите кошелёк",
        description: "Для деплоя нужен подключённый кошелёк",
        variant: "destructive",
      });
      return;
    }

    if (verificationStatus !== 'verified') {
      toast({
        title: "Сначала пройдите верификацию",
        description: "Карта должна быть верифицирована AI",
        variant: "destructive",
      });
      return;
    }

    if (!cardName || !ticker) {
      toast({
        title: "Заполните данные",
        description: "Введите название и тикер токена",
        variant: "destructive",
      });
      return;
    }

    // Check balance
    await loadBalance();
    if (balance !== null && !checkMinimumBalance(balance)) {
      toast({
        title: "Недостаточно SOL",
        description: "Минимум 0.02 SOL для создания токена",
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
        imageUrl: cardImage || '',
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

        toast({
          title: "🎉 Токен создан!",
          description: `Mint: ${result.mintAddress?.slice(0, 8)}...`,
        });
      } else {
        setDeployStatus('failed');
        toast({
          title: "Ошибка деплоя",
          description: result.error || "Не удалось создать токен",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Deploy error:', error);
      setDeployStatus('failed');
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive",
      });
    }
  };

  const isFormValid = cardName && ticker && cardImage && proofImage;
  const canDeploy = verificationStatus === 'verified' && isFormValid && wallet.connected;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl text-foreground mb-2">CREATE TOKEN</h1>
        <p className="text-muted-foreground">Верифицируйте карту и запустите токен на pump.fun</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          cardImage && proofImage ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <span className="font-display">1</span>
          <span className="text-sm">Загрузка</span>
        </div>
        <div className="w-8 h-0.5 bg-border" />
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          verificationStatus === 'verified' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <span className="font-display">2</span>
          <span className="text-sm">Верификация</span>
        </div>
        <div className="w-8 h-0.5 bg-border" />
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          deployStatus === 'success' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <span className="font-display">3</span>
          <span className="text-sm">Деплой</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left - Images */}
        <div className="space-y-6">
          {/* Card Image */}
          <div className="pokemon-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold">Фото карты</span>
            </div>
            <div 
              onClick={() => cardInputRef.current?.click()}
              className={cn(
                "relative aspect-[3/4] rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden",
                cardImage ? "border-primary" : "border-border hover:border-primary/50"
              )}
            >
              {cardImage ? (
                <img src={cardImage} alt="Card" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Upload className="w-10 h-10 mb-2" />
                  <span className="text-sm">Загрузить фото карты</span>
                </div>
              )}
            </div>
            <input
              ref={cardInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'card')}
              className="hidden"
            />
          </div>

          {/* Proof Image */}
          <div className="pokemon-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-primary" />
              <span className="font-semibold">Пруф владения</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Фото карты с запиской: адрес кошелька + дата
            </p>
            <div 
              onClick={() => proofInputRef.current?.click()}
              className={cn(
                "relative aspect-[3/4] rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden",
                proofImage ? "border-primary" : "border-border hover:border-primary/50"
              )}
            >
              {proofImage ? (
                <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <FileCheck className="w-10 h-10 mb-2" />
                  <span className="text-sm">Загрузить пруф</span>
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
          </div>

          {/* Verification Button */}
          <Button
            onClick={verifyCard}
            disabled={!cardImage || !proofImage || verificationStatus === 'verifying' || !wallet.connected}
            className="w-full gap-2"
            size="lg"
          >
            {verificationStatus === 'verifying' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI анализирует...
              </>
            ) : verificationStatus === 'verified' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Верифицировано ✓
              </>
            ) : verificationStatus === 'failed' ? (
              <>
                <XCircle className="w-5 h-5" />
                Повторить верификацию
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Верифицировать с AI
              </>
            )}
          </Button>

          {/* Verification Result */}
          {verificationResult && (
            <div className={cn(
              "pokemon-card p-4",
              verificationResult.verified ? "border-[hsl(var(--status-verified))]" : "border-destructive"
            )}>
              <div className="flex items-center gap-2 mb-2">
                {verificationResult.verified ? (
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--status-verified))]" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                <span className="font-semibold">
                  {verificationResult.verified ? 'Карта верифицирована' : 'Не верифицировано'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{verificationResult.reason}</p>
              <div className="flex items-center gap-4 text-xs">
                <span>Уверенность: <strong>{verificationResult.confidence}%</strong></span>
                {verificationResult.details && (
                  <>
                    <span>Совпадение: {verificationResult.details.cardMatch ? '✓' : '✗'}</span>
                    <span>Пруф: {verificationResult.details.ownershipProof ? '✓' : '✗'}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right - Token Details */}
        <div className="space-y-6">
          {/* Wallet Connection */}
          <div className="pokemon-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Кошелёк</h3>
                {wallet.connected && balance !== null && (
                  <p className="text-sm text-muted-foreground">
                    Баланс: {formatSolBalance(balance)} SOL
                  </p>
                )}
              </div>
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg !h-10" />
            </div>
          </div>

          {/* Token Form */}
          <div className="pokemon-card p-4 space-y-4">
            <h3 className="font-display text-xl">ДАННЫЕ ТОКЕНА</h3>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Название карты</label>
              <Input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Charizard Holo 1st Edition"
                className="bg-muted/50"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Тикер</label>
              <Input
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 10))}
                placeholder="CHAR"
                className="bg-muted/50"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Описание</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="PSA 10, 1999 Base Set..."
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
                Сколько SOL купить при создании
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

          {/* Deploy Button */}
          <Button
            onClick={deployToken}
            disabled={!canDeploy || deployStatus === 'deploying'}
            className="w-full gap-2 h-14 text-lg"
            size="lg"
          >
            {deployStatus === 'deploying' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Создание токена...
              </>
            ) : deployStatus === 'success' ? (
              <>
                <Sparkles className="w-6 h-6" />
                Токен создан!
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6" />
                Запустить на pump.fun
              </>
            )}
          </Button>

          {!canDeploy && verificationStatus !== 'verified' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>Сначала пройдите AI верификацию</span>
            </div>
          )}

          {/* Deploy Result */}
          {deployResult && deployStatus === 'success' && (
            <div className="pokemon-card p-4 border-[hsl(var(--status-verified))]">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-[hsl(var(--status-verified))]" />
                <span className="font-display text-lg">ТОКЕН СОЗДАН!</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Mint:</span>
                  <code className="ml-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                    {deployResult.mintAddress}
                  </code>
                </div>
                {deployResult.signature && (
                  <div>
                    <span className="text-muted-foreground">TX:</span>
                    <code className="ml-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                      {deployResult.signature.slice(0, 20)}...
                    </code>
                  </div>
                )}
              </div>
              <a
                href={deployResult.pumpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block"
              >
                <Button className="w-full gap-2" variant="outline">
                  <Rocket className="w-4 h-4" />
                  Открыть на pump.fun
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
