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
    setTimeout(() => {
      setIsRecording(false);
      setRecordingComplete(true);
    }, 5000);
  };

  const startVerification = () => {
    setStep(3);
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
        <h1 className="font-display text-5xl text-foreground mb-2">CREATE TOKEN</h1>
        <p className="text-muted-foreground">Submit proof of your physical card</p>
      </div>

      {/* Divider */}
      <div className="divider-red mb-8" />

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={cn(
                "step-indicator",
                step === s && "active",
                step > s && "completed"
              )}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 4 && (
              <div className={cn(
                "w-12 h-0.5 rounded-full",
                step > s ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Proof method selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground">CHOOSE PROOF METHOD</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setProofMethod("photo"); setStep(2); }}
              className="pokemon-card p-6 text-left hover:scale-[1.02] transition-transform"
            >
              <Camera className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">PHOTO PROOF</h3>
              <p className="text-sm text-muted-foreground">
                Upload photos of your card with a handwritten verification code
              </p>
            </button>
            <button
              onClick={() => { setProofMethod("video"); setStep(2); }}
              className="pokemon-card p-6 text-left hover:scale-[1.02] transition-transform"
            >
              <Video className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">VIDEO PROOF</h3>
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
            <h2 className="font-display text-2xl text-foreground">UPLOAD PHOTOS</h2>
            <button 
              onClick={() => { setStep(1); setProofMethod(null); }}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="pokemon-card p-4">
            <p className="text-sm text-muted-foreground">
              Your verification code: <span className="font-mono font-semibold text-primary">{verificationCode}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Write this code on paper and include it in your proof photo
            </p>
          </div>

          <div className="grid gap-4">
            {[
              { label: "Front of card", file: frontPhoto, setter: setFrontPhoto },
              { label: "Back of card", file: backPhoto, setter: setBackPhoto },
              { label: "Card + handwritten code", file: proofPhoto, setter: setProofPhoto },
            ].map((item) => (
              <div key={item.label}>
                <label className="block text-sm font-medium mb-2 text-foreground">{item.label}</label>
                <label className={cn("upload-zone block", item.file && "border-primary bg-primary/5")}>
                  <input type="file" accept="image/*" onChange={handleFileUpload(item.setter)} className="hidden" />
                  {item.file ? (
                    <div className="flex items-center gap-2 text-primary">
                      <Check className="w-5 h-5" />
                      <span>{item.file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Click to upload</span>
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>

          <Button 
            onClick={startVerification} 
            disabled={!canProceedFromStep2}
            className="w-full gap-2"
            size="lg"
          >
            Continue to verification
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 2B: Video proof */}
      {step === 2 && proofMethod === "video" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-foreground">RECORD VIDEO</h2>
            <button 
              onClick={() => { setStep(1); setProofMethod(null); }}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="pokemon-card p-6">
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center mb-4">
              {isRecording ? (
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full bg-primary animate-pulse mx-auto mb-2" />
                  <p className="text-foreground">Recording...</p>
                  <p className="text-xs text-muted-foreground">Show all sides of your card</p>
                </div>
              ) : recordingComplete ? (
                <div className="text-center text-primary">
                  <Check className="w-10 h-10 mx-auto mb-2" />
                  <p>Recording complete</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Video className="w-10 h-10 mx-auto mb-2" />
                  <p>Camera preview</p>
                </div>
              )}
            </div>

            <ul className="text-sm text-muted-foreground space-y-1 mb-4">
              <li>• Hold your card in frame</li>
              <li>• Slowly rotate to show all angles</li>
              <li>• Flip to show front and back</li>
            </ul>

            {!recordingComplete && (
              <Button onClick={startRecording} disabled={isRecording} className="w-full">
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
            <Button onClick={startVerification} className="w-full gap-2" size="lg">
              Continue to verification
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Step 3: AI Verification */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground">
            {verificationComplete ? "VERIFICATION COMPLETE" : "ANALYZING CARD..."}
          </h2>

          <div className="pokemon-card p-6 space-y-4">
            {verificationSteps.map((vs) => (
              <div key={vs.id} className="flex items-center gap-4 py-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  {vs.status === "pending" && <div className="w-6 h-6 rounded-full border-2 border-muted" />}
                  {vs.status === "checking" && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
                  {vs.status === "success" && <Check className="w-6 h-6 text-primary" />}
                  {vs.status === "error" && <X className="w-6 h-6 text-destructive" />}
                </div>
                <span className={cn(
                  "text-sm font-medium",
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
            <>
              <div className="pokemon-card p-4 border-primary/50 bg-primary/5">
                <div className="flex items-center gap-2 text-primary">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Card verified successfully!</span>
                </div>
              </div>
              <Button onClick={() => setStep(4)} className="w-full gap-2" size="lg">
                Continue to launch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Step 4: Launch */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground">LAUNCH YOUR TOKEN</h2>

          <div className="pokemon-card p-6">
            <h3 className="font-display text-lg text-foreground mb-4">TOKEN PREVIEW</h3>
            <div className="space-y-3">
              {[
                { label: "Card", value: "Verified Physical Card" },
                { label: "Rarity", value: <span className="badge-rarity badge-rare">Rare</span> },
                { label: "Card ID", value: <span className="font-mono">PSA-9-{Math.random().toString(36).substring(2, 5).toUpperCase()}</span> },
                { label: "Status", value: <span className="badge-status badge-verified">Verified</span> },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full gap-2" size="lg">
            <Rocket className="w-5 h-5" />
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
