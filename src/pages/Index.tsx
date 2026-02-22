import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Upload, ClipboardList, Brain, BarChart3,
    ShieldCheck, Activity, Clock, Hospital,
    AlertTriangle, ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
    }),
};

const steps = [
    { icon: Upload, label: "Upload Image", desc: "Take or upload a photo of the wound" },
    { icon: ClipboardList, label: "Health Info", desc: "Enter your health details and history" },
    { icon: Brain, label: "AI Analysis", desc: "Our AI classifies and assesses the wound" },
    { icon: BarChart3, label: "Get Results", desc: "Receive detailed recovery guidance" },
];

const features = [
    { icon: Activity, title: "Wound Classification", desc: "AI-powered identification of wound type — burns, lacerations, abrasions, infections, and diabetic ulcers with severity scoring.", color: "bg-coral-light text-primary" },
    { icon: Clock, title: "Recovery Prediction", desc: "Estimated healing timeline adjusted for your age, health conditions, and risk factors using regression models.", color: "bg-sage-light text-accent" },
    { icon: Hospital, title: "Hospital Guidance", desc: "Clear recommendation on whether to seek hospital care or manage at home, with urgency indicators.", color: "bg-amber-light text-amber" },
    { icon: ShieldCheck, title: "Care Instructions", desc: "Step-by-step precautions and care guidelines specific to your wound type and health profile.", color: "bg-coral-light text-primary" },
];

const Index = () => (
    <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coral-light text-primary text-sm font-medium mb-6"
                >
                    <Brain className="w-4 h-4" />
                    AI-Powered Assessment
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
                >
                    Smart Wound &{" "}
                    <span className="text-primary">Injury Assessment</span>{" "}
                    Companion
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Upload a wound image, share your health details, and receive AI-driven classification, recovery predictions, and care recommendations — all in seconds.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to="/assess"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 text-base"
                    >
                        Start Assessment
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                    <Link
                        to="/about"
                        className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-medium rounded-2xl hover:bg-secondary transition-colors text-base"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-card">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="text-center mb-14"
                >
                    <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold mb-4">
                        How It Works
                    </motion.h2>
                    <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-lg mx-auto">
                        Four simple steps to get a comprehensive wound assessment
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.label}
                            variants={fadeUp}
                            custom={i + 1}
                            className="relative bg-background rounded-2xl p-6 border border-border hover:border-primary/30 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <step.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                            </div>
                            <div className="text-xs font-semibold text-muted-foreground mb-1">Step {i + 1}</div>
                            <h3 className="font-display font-semibold text-lg mb-1">{step.label}</h3>
                            <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* Key Features */}
        <section className="py-20 px-4">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="text-center mb-14"
                >
                    <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold mb-4">
                        Key Features
                    </motion.h2>
                    <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-lg mx-auto">
                        Comprehensive wound analysis powered by machine learning
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid sm:grid-cols-2 gap-6"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            variants={fadeUp}
                            custom={i + 1}
                            className="rounded-2xl border border-border p-7 hover:shadow-md transition-shadow bg-background"
                        >
                            <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                                <f.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* Safety & Trust */}
        <section className="py-20 px-4 bg-card">
            <div className="container mx-auto max-w-3xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="text-center"
                >
                    <motion.div variants={fadeUp} custom={0} className="w-14 h-14 rounded-2xl bg-amber-light flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-7 h-7 text-amber" />
                    </motion.div>
                    <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold mb-4">
                        Safety & Trust
                    </motion.h2>
                    <motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
                        Your health data stays on your device. We do not store any images or personal information. This tool is designed to complement, never replace, professional medical care.
                    </motion.p>
                    <motion.div variants={fadeUp} custom={3} className="bg-amber-light/50 border border-amber/20 rounded-2xl p-6 text-sm text-foreground leading-relaxed">
                        <strong>⚠️ Medical Disclaimer:</strong> This application provides preliminary guidance and does not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.
                    </motion.div>
                </motion.div>
            </div>
        </section>

        <Footer />
    </div>
);

export default Index;
