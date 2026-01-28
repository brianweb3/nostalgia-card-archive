import { useState, useEffect, useRef, ChangeEvent } from "react";
import { X, Upload, Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

interface TokenForm {
  name: string;
  ticker: string;
  description: string;
  logoFile: File | null;
  logoPreview: string | null;
  twitter: string;
  website: string;
  pumpfun: string;
  walletAddress: string;
}

interface VerificationForm {
  cardName: string;
  ticker: string;
  cardFrontFile: File | null;
  cardFrontPreview: string | null;
  proofFile: File | null;
  proofPreview: string | null;
  walletAddress: string;
}

const initialTokenForm: TokenForm = {
  name: "",
  ticker: "",
  description: "",
  logoFile: null,
  logoPreview: null,
  twitter: "",
  website: "",
  pumpfun: "",
  walletAddress: "",
};

const initialVerificationForm: VerificationForm = {
  cardName: "",
  ticker: "",
  cardFrontFile: null,
  cardFrontPreview: null,
  proofFile: null,
  proofPreview: null,
  walletAddress: "",
};

export function AdminPanel({ open, onClose }: AdminPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tokens");
  const [tokenForm, setTokenForm] = useState<TokenForm>(initialTokenForm);
  const [verificationForm, setVerificationForm] = useState<VerificationForm>(initialVerificationForm);
  const [saving, setSaving] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const cardFrontInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload for token logo
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setTokenForm(prev => ({
        ...prev,
        logoFile: file,
        logoPreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle file upload for verification
  const handleVerificationImageUpload = (e: ChangeEvent<HTMLInputElement>, type: 'front' | 'proof') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'front') {
        setVerificationForm(prev => ({
          ...prev,
          cardFrontFile: file,
          cardFrontPreview: reader.result as string,
        }));
      } else {
        setVerificationForm(prev => ({
          ...prev,
          proofFile: file,
          proofPreview: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload file to Supabase storage
  const uploadToStorage = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('token-images')
      .upload(fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('token-images')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  };

  // Save new token
  const saveToken = async () => {
    if (!tokenForm.name || !tokenForm.ticker) {
      toast({
        title: "Error",
        description: "Name and ticker are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      let imageUrl: string | null = null;
      
      if (tokenForm.logoFile) {
        imageUrl = await uploadToStorage(tokenForm.logoFile, 'logos');
      }

      const { error } = await supabase.from('tokens').insert({
        name: tokenForm.name,
        ticker: tokenForm.ticker.toUpperCase(),
        description: tokenForm.description || `${tokenForm.name} - Trading Card Token`,
        image_url: imageUrl,
        wallet_address: tokenForm.walletAddress || 'admin',
        status: 'launched',
        rarity: 'common',
        market_cap: 0,
        progress: 100,
        pumpfun_url: tokenForm.pumpfun || null,
      } as any);

      if (error) throw error;

      toast({
        title: "✅ Token Created!",
        description: `${tokenForm.name} ($${tokenForm.ticker.toUpperCase()}) added successfully`,
      });

      setTokenForm(initialTokenForm);
    } catch (error) {
      console.error('Save token error:', error);
      toast({
        title: "Error",
        description: "Failed to save token",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Save verification
  const saveVerification = async () => {
    if (!verificationForm.cardName || !verificationForm.ticker) {
      toast({
        title: "Error",
        description: "Card name and ticker are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      let cardFrontUrl: string | null = null;
      
      if (verificationForm.cardFrontFile) {
        cardFrontUrl = await uploadToStorage(verificationForm.cardFrontFile, 'cards');
      }

      // Create token first
      const { data: tokenData, error: tokenError } = await supabase.from('tokens').insert({
        name: verificationForm.cardName,
        ticker: verificationForm.ticker.toUpperCase(),
        description: `${verificationForm.cardName} - Verified Trading Card`,
        image_url: cardFrontUrl,
        wallet_address: verificationForm.walletAddress || 'admin',
        status: 'verified',
        rarity: 'common',
        market_cap: 0,
        progress: 0,
      }).select().single();

      if (tokenError) throw tokenError;

      // Create verification record
      await supabase.from('verifications').insert({
        token_id: tokenData.id,
        wallet_address: verificationForm.walletAddress || 'admin',
        ai_confidence: 95,
        verified_at: new Date().toISOString(),
        metadata: {
          status: 'verified',
          reason: 'Admin verified',
          cardName: verificationForm.cardName,
          ticker: verificationForm.ticker.toUpperCase(),
          cardFrontUrl: cardFrontUrl,
          details: {
            cardMatch: true,
            ownershipProof: true,
            authenticityScore: 95,
          },
        },
      });

      toast({
        title: "✅ Verification Added!",
        description: `${verificationForm.cardName} verified successfully`,
      });

      setVerificationForm(initialVerificationForm);
    } catch (error) {
      console.error('Save verification error:', error);
      toast({
        title: "Error",
        description: "Failed to save verification",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-primary">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-primary">
            🔐 ADMIN PANEL
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens" className="font-mono text-xs uppercase">
              Add Token
            </TabsTrigger>
            <TabsTrigger value="verifications" className="font-mono text-xs uppercase">
              Add Verification
            </TabsTrigger>
          </TabsList>

          {/* Add Token Tab */}
          <TabsContent value="tokens" className="space-y-4 mt-4">
            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <div
                onClick={() => logoInputRef.current?.click()}
                className={cn(
                  "w-20 h-20 rounded-lg cursor-pointer transition-all overflow-hidden flex-shrink-0",
                  tokenForm.logoPreview
                    ? "ring-2 ring-primary"
                    : "bg-muted border-2 border-dashed border-muted-foreground/30 hover:border-primary/50"
                )}
              >
                {tokenForm.logoPreview ? (
                  <img src={tokenForm.logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="w-6 h-6" />
                    <span className="text-[10px]">Logo</span>
                  </div>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Token Name"
                  value={tokenForm.name}
                  onChange={(e) => setTokenForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-card border-2 border-foreground"
                />
                <Input
                  placeholder="Ticker (e.g. PIKA)"
                  value={tokenForm.ticker}
                  onChange={(e) => setTokenForm(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
                  className="bg-card border-2 border-foreground font-mono"
                />
              </div>
            </div>

            <Textarea
              placeholder="Description (optional)"
              value={tokenForm.description}
              onChange={(e) => setTokenForm(prev => ({ ...prev, description: e.target.value }))}
              className="bg-card border-2 border-foreground min-h-[80px]"
            />

            <Input
              placeholder="Pump.fun URL"
              value={tokenForm.pumpfun}
              onChange={(e) => setTokenForm(prev => ({ ...prev, pumpfun: e.target.value }))}
              className="bg-card border-2 border-foreground font-mono"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Twitter URL"
                value={tokenForm.twitter}
                onChange={(e) => setTokenForm(prev => ({ ...prev, twitter: e.target.value }))}
                className="bg-card border-2 border-foreground"
              />
              <Input
                placeholder="Website URL"
                value={tokenForm.website}
                onChange={(e) => setTokenForm(prev => ({ ...prev, website: e.target.value }))}
                className="bg-card border-2 border-foreground"
              />
            </div>

            <Input
              placeholder="Wallet Address (optional)"
              value={tokenForm.walletAddress}
              onChange={(e) => setTokenForm(prev => ({ ...prev, walletAddress: e.target.value }))}
              className="bg-card border-2 border-foreground font-mono text-sm"
            />

            <Button 
              onClick={saveToken} 
              disabled={saving} 
              className="w-full gap-2"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Token
                </>
              )}
            </Button>
          </TabsContent>

          {/* Add Verification Tab */}
          <TabsContent value="verifications" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Card Name"
                value={verificationForm.cardName}
                onChange={(e) => setVerificationForm(prev => ({ ...prev, cardName: e.target.value }))}
                className="bg-card border-2 border-foreground"
              />
              <Input
                placeholder="Ticker"
                value={verificationForm.ticker}
                onChange={(e) => setVerificationForm(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
                className="bg-card border-2 border-foreground font-mono"
              />
            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Card Front</p>
                <div
                  onClick={() => cardFrontInputRef.current?.click()}
                  className={cn(
                    "aspect-[3/4] rounded-lg cursor-pointer transition-all overflow-hidden",
                    verificationForm.cardFrontPreview
                      ? "ring-2 ring-primary"
                      : "bg-muted border-2 border-dashed border-muted-foreground/30 hover:border-primary/50"
                  )}
                >
                  {verificationForm.cardFrontPreview ? (
                    <img src={verificationForm.cardFrontPreview} alt="Card" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs">Upload Card</span>
                    </div>
                  )}
                </div>
                <input
                  ref={cardFrontInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleVerificationImageUpload(e, 'front')}
                  className="hidden"
                />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Proof Image</p>
                <div
                  onClick={() => proofInputRef.current?.click()}
                  className={cn(
                    "aspect-[3/4] rounded-lg cursor-pointer transition-all overflow-hidden",
                    verificationForm.proofPreview
                      ? "ring-2 ring-primary"
                      : "bg-muted border-2 border-dashed border-muted-foreground/30 hover:border-primary/50"
                  )}
                >
                  {verificationForm.proofPreview ? (
                    <img src={verificationForm.proofPreview} alt="Proof" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs">Upload Proof</span>
                    </div>
                  )}
                </div>
                <input
                  ref={proofInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleVerificationImageUpload(e, 'proof')}
                  className="hidden"
                />
              </div>
            </div>

            <Input
              placeholder="Wallet Address (optional)"
              value={verificationForm.walletAddress}
              onChange={(e) => setVerificationForm(prev => ({ ...prev, walletAddress: e.target.value }))}
              className="bg-card border-2 border-foreground font-mono text-sm"
            />

            <Button 
              onClick={saveVerification} 
              disabled={saving} 
              className="w-full gap-2"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Verification
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
