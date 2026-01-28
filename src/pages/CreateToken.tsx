import { useState } from "react";
import { Camera, Upload, Video, Check, X, Loader2, ArrowRight, ArrowLeft, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ProofMethod = "photo" | "video" | null;
type Step = 1 | 2 | 3 | 4;

interface VerificationStep {
  id: string;
  label: string;
  status: "pending" | "checking" | "success" | "error";
}

export default function CreateToken() {
  const [step, setStep] = useState<Step>(1);
  const [proofMethod, setProofMethod] = useState<ProofMethod>(null);
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [backPhoto, setBackPhoto] = useState<File | null>(null);
  const [proofPhoto, setProofPhoto] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    { id: "visual", label: "Visual match analysis", status: "pending" },
    { id: "freshness", label: "Freshness check", status: "pending" },
    { id: "consistency", label: "Consistency verification", status: "pending" },
  ]);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const verificationCode = "CARD-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleFileUpload = (setter: (file: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setRecordingComplete(true);
    }, 5000);
  };

  const startVerification = () => {
    setStep(3);
    // Simulate verification process
    const steps = [...verificationSteps];
    
    setTimeout(() => {
      steps[0].status = "checking";
      setVerificationSteps([...steps]);
    }, 500);

    setTimeout(() => {
      steps[0].status = "success";
      steps[1].status = "checking";
      setVerificationSteps([...steps]);
    }, 1500);

    setTimeout(() => {
      steps[1].status = "success";
      steps[2].status = "checking";
      setVerificationSteps([...steps]);
    }, 2500);

    setTimeout(() => {
      steps[2].status = "success";
      setVerificationSteps([...steps]);
      setVerificationComplete(true);
      setVerificationSuccess(true);
    }, 3500);
  };

  const canProceedFromStep2 = proofMethod === "photo" 
    ? frontPhoto && backPhoto && proofPhoto
    : recordingComplete;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Create Token</h1>
        <p className="text-sm text-muted-foreground">Submit proof of your physical card</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "step-indicator",
                step === s && "active",
                step > s && "completed"
              )}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 4 && <div className={cn("w-8 h-0.5", step > s ? "bg-primary" : "bg-muted")} />}
          </div>
        ))}
      </div>

      {/* Step 1: Proof method selection */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose proof method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setProofMethod("photo"); setStep(2); }}
              className={cn(
                "p-6 rounded-lg border-2 border-border hover:border-primary/50 transition-colors text-left",
                proofMethod === "photo" && "border-primary"
              )}
            >
              <Camera className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Photo Proof</h3>
              <p className="text-sm text-muted-foreground">
                Upload photos of your card with a handwritten verification code
              </p>
            </button>
            <button
              onClick={() => { setProofMethod("video"); setStep(2); }}
              className={cn(
                "p-6 rounded-lg border-2 border-border hover:border-primary/50 transition-colors text-left",
                proofMethod === "video" && "border-primary"
              )}
            >
              <Video className="w-8 h-8 text-secondary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Live Video Proof</h3>
              <p className="text-sm text-muted-foreground">
                Record a live video showing your card from all angles
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Step 2A: Photo proof */}
      {step === 2 && proofMethod === "photo" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upload photos</h2>
            <button 
              onClick={() => { setStep(1); setProofMethod(null); }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Back
            </button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              Your verification code: <span className="font-mono font-semibold text-primary">{verificationCode}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Write this code on paper and include it in your proof photo
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Front of card</label>
              <label className={cn("upload-zone block", frontPhoto && "border-primary bg-primary/5")}>
                <input type="file" accept="image/*" onChange={handleFileUpload(setFrontPhoto)} className="hidden" />
                {frontPhoto ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Check className="w-5 h-5" />
                    <span>{frontPhoto.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Click to upload</span>
                  </div>
                )}
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Back of card</label>
              <label className={cn("upload-zone block", backPhoto && "border-primary bg-primary/5")}>
                <input type="file" accept="image/*" onChange={handleFileUpload(setBackPhoto)} className="hidden" />
                {backPhoto ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Check className="w-5 h-5" />
                    <span>{backPhoto.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Click to upload</span>
                  </div>
                )}
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Card + handwritten code</label>
              <label className={cn("upload-zone block", proofPhoto && "border-primary bg-primary/5")}>
                <input type="file" accept="image/*" onChange={handleFileUpload(setProofPhoto)} className="hidden" />
                {proofPhoto ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Check className="w-5 h-5" />
                    <span>{proofPhoto.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Photo with card and code visible</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <Button 
            onClick={startVerification} 
            disabled={!canProceedFromStep2}
            className="w-full"
          >
            Continue to verification
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2B: Video proof */}
      {step === 2 && proofMethod === "video" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Record live video</h2>
            <button 
              onClick={() => { setStep(1); setProofMethod(null); }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Back
            </button>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
              {isRecording ? (
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-destructive animate-pulse mx-auto mb-2" />
                  <p className="text-sm text-foreground">Recording...</p>
                  <p className="text-xs text-muted-foreground">Show all sides of your card</p>
                </div>
              ) : recordingComplete ? (
                <div className="text-center text-primary">
                  <Check className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Recording complete</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Video className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Camera preview</p>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p>Instructions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Hold your card in frame</li>
                <li>Slowly rotate to show all angles</li>
                <li>Flip to show front and back</li>
              </ul>
            </div>

            {!recordingComplete && (
              <Button 
                onClick={startRecording}
                disabled={isRecording}
                className="w-full"
              >
                {isRecording ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Recording...
                  </>
                ) : (
                  "Start Recording"
                )}
              </Button>
            )}
          </div>

          {recordingComplete && (
            <Button onClick={startVerification} className="w-full">
              Continue to verification
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      )}

      {/* Step 3: AI Verification */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            {verificationComplete ? "Verification complete" : "Analyzing card..."}
          </h2>

          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            {verificationSteps.map((vs) => (
              <div key={vs.id} className={cn("verify-step", vs.status)}>
                <div className="icon">
                  {vs.status === "pending" && <div className="w-5 h-5 rounded-full border-2 border-muted" />}
                  {vs.status === "checking" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                  {vs.status === "success" && <Check className="w-5 h-5 text-primary" />}
                  {vs.status === "error" && <X className="w-5 h-5 text-destructive" />}
                </div>
                <span className={cn(
                  "text-sm",
                  vs.status === "pending" && "text-muted-foreground",
                  vs.status === "checking" && "text-foreground",
                  vs.status === "success" && "text-primary",
                  vs.status === "error" && "text-destructive"
                )}>
                  {vs.label}
                </span>
              </div>
            ))}
          </div>

          {verificationComplete && verificationSuccess && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Card verified successfully!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your card has been verified. You can now proceed to launch your token.
              </p>
            </div>
          )}

          {verificationComplete && !verificationSuccess && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <X className="w-5 h-5" />
                <span className="font-semibold">Verification failed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We couldn't verify your card. Please try again with clearer images.
              </p>
            </div>
          )}

          {verificationComplete && verificationSuccess && (
            <Button onClick={() => setStep(4)} className="w-full">
              Continue to launch
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      )}

      {/* Step 4: Launch */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Launch your token</h2>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold mb-4">Token Preview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Card</span>
                <span className="font-medium">Verified Physical Card</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Rarity</span>
                <span className="badge-rarity badge-rare">Rare</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Card ID</span>
                <span className="font-mono">PSA-{Math.floor(Math.random() * 10)}-{Math.random().toString(36).substring(2, 5).toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Status</span>
                <span className="badge-status badge-verified">Verified</span>
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg">
            <Rocket className="w-5 h-5 mr-2" />
            Launch Token
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Launching will create a token backed by your verified physical card
          </p>
        </div>
      )}
    </div>
  );
}
