import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Upload, X, Image as ImageIcon, ChevronRight, ChevronLeft,
    Brain, Activity, Clock, ShieldCheck, Check, AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { runGeminiAssessment, type PatientData } from "@/lib/geminiAssessment";

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const processingStages = [
    { icon: Brain, label: "Analysing wound image with AI…" },
    { icon: Activity, label: "Assessing severity & risk factors…" },
    { icon: Clock, label: "Predicting recovery timeline…" },
    { icon: ShieldCheck, label: "Generating care recommendations…" },
];

const Assessment = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);

    // Step 1: Image
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    // Step 2: Patient data
    const [age, setAge] = useState("");
    const [hasHighBP, setHasHighBP] = useState(false);
    const [hasDiabetes, setHasDiabetes] = useState(false);
    const [medications, setMedications] = useState("");

    // Step 3: Processing
    const [processingStage, setProcessingStage] = useState(0);
    const [apiError, setApiError] = useState<string | null>(null);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    }, []);

    const goNext = () => { setDirection(1); setStep((s) => s + 1); };
    const goBack = () => { setDirection(-1); setStep((s) => s - 1); };

    // Processing: call Gemini API
    useEffect(() => {
        if (step !== 2) return;

        setProcessingStage(0);
        setApiError(null);

        let stageIndex = 0;
        const stageInterval = setInterval(() => {
            stageIndex = Math.min(stageIndex + 1, processingStages.length - 1);
            setProcessingStage(stageIndex);
        }, 1400);

        const patientData: PatientData = {
            age: parseInt(age) || 30,
            hasHighBP,
            hasDiabetes,
            medications,
        };

        runGeminiAssessment(imagePreview!, patientData)
            .then((result) => {
                clearInterval(stageInterval);
                sessionStorage.setItem("assessmentResult", JSON.stringify(result));
                sessionStorage.setItem("patientData", JSON.stringify(patientData));
                // Brief pause so user sees the final stage complete
                setTimeout(() => navigate("/results"), 600);
            })
            .catch((err) => {
                clearInterval(stageInterval);
                console.error(err);
                setApiError("Something went wrong during analysis. Please try again.");
            });

        return () => clearInterval(stageInterval);
    }, [step]);

    const canProceedStep1 = !!imagePreview;
    const canProceedStep2 = age.trim() !== "" && parseInt(age) > 0;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-2xl">
                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-2 mb-10">
                        {["Upload", "Health Info", "Analysis"].map((label, i) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${i < step ? "bg-accent text-accent-foreground" :
                                    i === step ? "bg-primary text-primary-foreground" :
                                        "bg-secondary text-muted-foreground"
                                    }`}>
                                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className={`hidden sm:inline text-sm font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                                    {label}
                                </span>
                                {i < 2 && <div className={`w-10 h-0.5 ${i < step ? "bg-accent" : "bg-border"}`} />}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait" custom={direction}>
                        {/* Step 1: Image Upload */}
                        {step === 0 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35 }}
                            >
                                <div className="text-center mb-8">
                                    <h2 className="font-display text-2xl font-bold mb-2">Upload Wound Image</h2>
                                    <p className="text-muted-foreground text-sm">Take a clear photo or upload an existing image of the wound</p>
                                </div>

                                {!imagePreview ? (
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                        onDragLeave={() => setDragActive(false)}
                                        onDrop={onDrop}
                                        className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${dragActive ? "border-primary bg-coral-light/50" : "border-border hover:border-primary/40 hover:bg-secondary/50"
                                            }`}
                                        onClick={() => document.getElementById("file-input")?.click()}
                                    >
                                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="font-medium text-foreground mb-1">Drag & drop your image here</p>
                                        <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                                        <p className="text-xs text-muted-foreground">Supports JPG, PNG, WEBP • Max 10MB</p>
                                        <input
                                            id="file-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                        />
                                    </div>
                                ) : (
                                    <div className="relative rounded-2xl overflow-hidden border border-border">
                                        <img src={imagePreview} alt="Wound preview" className="w-full max-h-80 object-cover" />
                                        <button
                                            onClick={() => setImagePreview(null)}
                                            className="absolute top-3 right-3 w-8 h-8 bg-foreground/70 text-background rounded-full flex items-center justify-center hover:bg-foreground transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-background/80 backdrop-blur rounded-lg px-3 py-1.5 text-sm">
                                            <ImageIcon className="w-4 h-4 text-accent" />
                                            <span className="text-foreground font-medium">Image uploaded</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end mt-8">
                                    <Button onClick={goNext} disabled={!canProceedStep1} size="lg" className="rounded-xl gap-2">
                                        Continue <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Health Details */}
                        {step === 1 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35 }}
                            >
                                <div className="text-center mb-8">
                                    <h2 className="font-display text-2xl font-bold mb-2">Patient Health Details</h2>
                                    <p className="text-muted-foreground text-sm">This information helps the AI adjust the assessment for your specific health profile</p>
                                </div>

                                <div className="space-y-6 bg-card rounded-2xl border border-border p-8">
                                    <div>
                                        <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            placeholder="Enter your age"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="mt-1.5 rounded-xl"
                                            min="1"
                                            max="120"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Do you have high blood pressure?</Label>
                                        <div className="flex gap-3">
                                            {[true, false].map((val) => (
                                                <button
                                                    key={String(val)}
                                                    onClick={() => setHasHighBP(val)}
                                                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${hasHighBP === val
                                                        ? "border-primary bg-primary/10 text-primary"
                                                        : "border-border text-muted-foreground hover:border-primary/30"
                                                        }`}
                                                >
                                                    {val ? "Yes" : "No"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Do you have diabetes?</Label>
                                        <div className="flex gap-3">
                                            {[true, false].map((val) => (
                                                <button
                                                    key={String(val)}
                                                    onClick={() => setHasDiabetes(val)}
                                                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${hasDiabetes === val
                                                        ? "border-primary bg-primary/10 text-primary"
                                                        : "border-border text-muted-foreground hover:border-primary/30"
                                                        }`}
                                                >
                                                    {val ? "Yes" : "No"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="meds" className="text-sm font-medium">Current Medications (optional)</Label>
                                        <Input
                                            id="meds"
                                            placeholder="e.g. Metformin, Lisinopril"
                                            value={medications}
                                            onChange={(e) => setMedications(e.target.value)}
                                            className="mt-1.5 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-8">
                                    <Button onClick={goBack} variant="outline" size="lg" className="rounded-xl gap-2">
                                        <ChevronLeft className="w-4 h-4" /> Back
                                    </Button>
                                    <Button onClick={goNext} disabled={!canProceedStep2} size="lg" className="rounded-xl gap-2">
                                        Analyze <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Processing */}
                        {step === 2 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35 }}
                                className="text-center py-16"
                            >
                                {apiError ? (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                            <AlertCircle className="w-8 h-8 text-destructive" />
                                        </div>
                                        <div>
                                            <h2 className="font-display text-xl font-bold mb-2 text-destructive">Analysis Failed</h2>
                                            <p className="text-muted-foreground text-sm mb-6">{apiError}</p>
                                        </div>
                                        <Button onClick={goBack} variant="outline" size="lg" className="rounded-xl gap-2">
                                            <ChevronLeft className="w-4 h-4" /> Go Back & Retry
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-20 h-20 rounded-full border-4 border-secondary border-t-primary mx-auto mb-8"
                                        />

                                        <h2 className="font-display text-2xl font-bold mb-2">AI Analysing Your Wound</h2>
                                        <p className="text-muted-foreground text-sm mb-10">Google Gemini Vision is processing your image and health data</p>

                                        <div className="max-w-sm mx-auto space-y-4">
                                            {processingStages.map((stage, i) => {
                                                const Icon = stage.icon;
                                                const done = i < processingStage;
                                                const active = i === processingStage;
                                                return (
                                                    <motion.div
                                                        key={stage.label}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.2 }}
                                                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${done ? "bg-sage-light" : active ? "bg-coral-light" : "bg-secondary"
                                                            }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${done ? "bg-accent text-accent-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                                            }`}>
                                                            {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                                        </div>
                                                        <span className={`text-sm font-medium ${done ? "text-accent" : active ? "text-primary" : "text-muted-foreground"}`}>
                                                            {stage.label}
                                                        </span>
                                                        {active && (
                                                            <motion.div
                                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                                transition={{ duration: 1.2, repeat: Infinity }}
                                                                className="ml-auto w-2 h-2 rounded-full bg-primary"
                                                            />
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Assessment;
