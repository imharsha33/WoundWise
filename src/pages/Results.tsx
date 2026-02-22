import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    Activity, Clock, Hospital, Home, ShieldCheck,
    AlertTriangle, ChevronRight, Printer, RotateCcw, TrendingUp, Brain,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { AssessmentResult, PatientData } from "@/lib/geminiAssessment";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
    }),
};

const urgencyColors: Record<string, { bg: string; text: string; border: string }> = {
    low: { bg: "bg-sage-light", text: "text-accent", border: "border-accent/20" },
    moderate: { bg: "bg-amber-light", text: "text-amber", border: "border-amber/20" },
    high: { bg: "bg-coral-light", text: "text-primary", border: "border-primary/20" },
    critical: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
};

const impactColors: Record<string, string> = {
    low: "bg-sage-light text-accent",
    moderate: "bg-amber-light text-amber",
    high: "bg-coral-light text-primary",
};

const Results = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [patient, setPatient] = useState<PatientData | null>(null);

    useEffect(() => {
        const r = sessionStorage.getItem("assessmentResult");
        const p = sessionStorage.getItem("patientData");
        if (r && p) {
            setResult(JSON.parse(r));
            setPatient(JSON.parse(p));
        } else {
            navigate("/assess");
        }
    }, []);

    if (!result || !patient) return null;

    const uc = urgencyColors[result.urgency];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <motion.div initial="hidden" animate="visible" className="space-y-6">

                        {/* Header */}
                        <motion.div variants={fadeUp} custom={0} className="text-center mb-8">
                            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Assessment Results</h1>
                            <p className="text-muted-foreground">Based on AI analysis of your wound image and health profile</p>
                        </motion.div>

                        {/* AI Summary */}
                        {result.aiSummary && (
                            <motion.div
                                variants={fadeUp}
                                custom={0.5}
                                className={`rounded-2xl p-6 flex gap-4 items-start mb-2 ${result.usedFallback
                                    ? "bg-amber-light/60 border border-amber/30"
                                    : "bg-primary/5 border border-primary/20"}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${result.usedFallback ? "bg-amber" : "bg-primary"}`}>
                                    <Brain className={`w-5 h-5 ${result.usedFallback ? "text-white" : "text-primary-foreground"}`} />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-base mb-1">
                                        {result.usedFallback ? "⚠️ Estimated Assessment (AI Image Analysis Failed)" : "AI Clinical Summary"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{result.aiSummary}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Top row: Classification + Hospital */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Wound Classification */}
                            <motion.div variants={fadeUp} custom={1} className="bg-card rounded-2xl border border-border p-7">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-display text-lg font-semibold">Wound Classification</h3>
                                </div>
                                <div className="mb-4">
                                    <div className="text-2xl font-bold font-display text-foreground">{result.woundType}</div>
                                    <div className="text-sm text-muted-foreground">{result.severityLabel} Severity</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Severity Score</span>
                                        <span className="font-semibold text-foreground">{result.severity}%</span>
                                    </div>
                                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.severity}%` }}
                                            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                                            className={`h-full rounded-full ${result.severity > 80 ? "bg-destructive" :
                                                result.severity > 60 ? "bg-primary" :
                                                    result.severity > 40 ? "bg-amber" : "bg-accent"
                                                }`}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Hospital Recommendation */}
                            <motion.div variants={fadeUp} custom={2} className={`rounded-2xl border ${uc.border} p-7 ${uc.bg}`}>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`w-10 h-10 rounded-xl ${result.hospitalRecommended ? "bg-primary" : "bg-accent"} flex items-center justify-center`}>
                                        {result.hospitalRecommended
                                            ? <Hospital className="w-5 h-5 text-primary-foreground" />
                                            : <Home className="w-5 h-5 text-accent-foreground" />}
                                    </div>
                                    <h3 className="font-display text-lg font-semibold">Hospital Recommendation</h3>
                                </div>
                                <div className="text-2xl font-bold font-display mb-1">
                                    {result.hospitalRecommended ? "Hospital Visit Recommended" : "Home Care Sufficient"}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {result.hospitalRecommended
                                        ? result.urgency === "critical"
                                            ? "Seek medical attention immediately. Do not delay treatment."
                                            : "Please visit a healthcare facility within 24 hours for proper evaluation."
                                        : "This wound can likely be managed at home with proper care. Monitor for changes."}
                                </p>
                                <div className={`inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${uc.text} bg-background/50`}>
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {result.urgency} urgency
                                </div>
                            </motion.div>
                        </div>

                        {/* Recovery Timeline */}
                        <motion.div variants={fadeUp} custom={3} className="bg-card rounded-2xl border border-border p-7">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="font-display text-lg font-semibold">Recovery Timeline</h3>
                            </div>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-4xl font-bold font-display">{result.recoveryMin}–{result.recoveryMax}</span>
                                <span className="text-lg text-muted-foreground mb-1">days</span>
                            </div>
                            <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, delay: 0.7 }}
                                    className="absolute inset-y-0 left-0 rounded-full"
                                    style={{
                                        background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--amber)), hsl(var(--primary)))",
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>Best case: {result.recoveryMin} days</span>
                                <span>Estimated: {result.recoveryMax} days</span>
                            </div>
                        </motion.div>

                        {/* Precautions */}
                        <motion.div variants={fadeUp} custom={4} className="bg-card rounded-2xl border border-border p-7">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-amber-light flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-amber" />
                                </div>
                                <h3 className="font-display text-lg font-semibold">Precautions & Care Instructions</h3>
                            </div>
                            <Accordion type="multiple" defaultValue={[result.precautions[0]?.title]} className="space-y-2">
                                {result.precautions.map((group) => (
                                    <AccordionItem key={group.title} value={group.title} className="border rounded-xl px-4">
                                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">{group.title}</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="space-y-2">
                                                {group.items.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>

                        {/* Risk Factors */}
                        <motion.div variants={fadeUp} custom={5} className="bg-card rounded-2xl border border-border p-7">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-display text-lg font-semibold">Risk Factors Summary</h3>
                            </div>
                            <div className="space-y-4">
                                {result.riskFactors.map((rf) => (
                                    <div key={rf.label} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                                        <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize shrink-0 ${impactColors[rf.impact]}`}>
                                            {rf.impact}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">{rf.label}</div>
                                            <p className="text-sm text-muted-foreground mt-0.5">{rf.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Disclaimer */}
                        <motion.div variants={fadeUp} custom={6} className="bg-amber-light/50 border border-amber/20 rounded-2xl p-5 text-sm text-foreground text-center">
                            ⚠️ <strong>Medical Disclaimer:</strong> This assessment is AI-generated and provides preliminary guidance only. Always consult a qualified healthcare provider for proper diagnosis and treatment.
                        </motion.div>

                        {/* Actions */}
                        <motion.div variants={fadeUp} custom={7} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                onClick={() => window.print()}
                                variant="outline"
                                size="lg"
                                className="rounded-xl gap-2"
                            >
                                <Printer className="w-4 h-4" /> Download Report
                            </Button>
                            <Link to="/assess">
                                <Button size="lg" className="rounded-xl gap-2 w-full sm:w-auto">
                                    <RotateCcw className="w-4 h-4" /> New Assessment
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Results;
