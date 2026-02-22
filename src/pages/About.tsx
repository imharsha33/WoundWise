import { motion } from "framer-motion";
import {
    Brain, Database, Code2, Layers, Activity,
    ShieldCheck, GitBranch, Users, GraduationCap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
    }),
};

const techStack = [
    { icon: Code2, name: "React + TypeScript", desc: "Modern frontend framework with type safety" },
    { icon: Brain, name: "TensorFlow / PyTorch", desc: "Deep learning for wound image classification" },
    { icon: Layers, name: "ResNet50 / EfficientNet", desc: "Transfer learning for medical image analysis" },
    { icon: Activity, name: "Scikit-learn", desc: "Risk assessment and recovery prediction models" },
    { icon: GitBranch, name: "FastAPI", desc: "High-performance Python backend API" },
    { icon: Database, name: "PostgreSQL", desc: "Reliable database for patient data storage" },
];

const flowSteps = [
    "User uploads wound image",
    "CNN classifies wound type & severity",
    "Patient enters health details",
    "Risk model adjusts severity score",
    "Recovery predictor estimates healing time",
    "Decision engine recommends hospital or home care",
    "Precaution instructions are generated",
];

const About = () => (
    <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-1 pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div initial="hidden" animate="visible" className="space-y-16">

                    {/* Overview */}
                    <motion.section variants={fadeUp} custom={0} className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coral-light text-primary text-sm font-medium mb-4">
                            <GraduationCap className="w-4 h-4" />
                            Final Year Project
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">About WoundWise</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            WoundWise is an AI-powered web application designed to assist in preliminary wound assessment.
                            It classifies wound types, predicts recovery timelines, and provides care recommendations
                            using machine learning models trained on medical image datasets.
                        </p>
                    </motion.section>

                    {/* Objectives */}
                    <motion.section variants={fadeUp} custom={1}>
                        <h2 className="font-display text-2xl font-bold mb-6 text-center">Project Objectives</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                "Classify wound types from uploaded images using CNN models",
                                "Assess severity with probability-based scoring",
                                "Predict recovery time using regression models",
                                "Recommend hospital visit or home care based on risk analysis",
                                "Generate wound-specific precautions and care instructions",
                                "Provide an accessible, user-friendly interface for non-technical users",
                            ].map((obj, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                                    <div className="w-7 h-7 rounded-lg bg-sage-light flex items-center justify-center shrink-0 mt-0.5">
                                        <ShieldCheck className="w-4 h-4 text-accent" />
                                    </div>
                                    <p className="text-sm text-foreground">{obj}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* System Architecture */}
                    <motion.section variants={fadeUp} custom={2}>
                        <h2 className="font-display text-2xl font-bold mb-6 text-center">System Architecture</h2>
                        <div className="bg-card rounded-2xl border border-border p-8">
                            <div className="space-y-0">
                                {flowSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${i === 0 ? "bg-primary text-primary-foreground" :
                                                    i === flowSteps.length - 1 ? "bg-accent text-accent-foreground" :
                                                        "bg-secondary text-foreground"
                                                }`}>
                                                {i + 1}
                                            </div>
                                            {i < flowSteps.length - 1 && <div className="w-0.5 h-6 bg-border" />}
                                        </div>
                                        <p className="text-sm font-medium text-foreground pb-6">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* Tech Stack */}
                    <motion.section variants={fadeUp} custom={3}>
                        <h2 className="font-display text-2xl font-bold mb-6 text-center">Technology Stack</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {techStack.map((tech) => (
                                <div key={tech.name} className="p-5 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center mb-3">
                                        <tech.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-sm mb-1">{tech.name}</h4>
                                    <p className="text-xs text-muted-foreground">{tech.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Team */}
                    <motion.section variants={fadeUp} custom={4} className="text-center">
                        <div className="w-14 h-14 rounded-2xl bg-coral-light flex items-center justify-center mx-auto mb-4">
                            <Users className="w-7 h-7 text-primary" />
                        </div>
                        <h2 className="font-display text-2xl font-bold mb-3">Project Team</h2>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Developed as a final year project, combining expertise in machine learning,
                            web development, and healthcare domain knowledge.
                        </p>
                    </motion.section>

                    {/* Disclaimer */}
                    <motion.div variants={fadeUp} custom={5} className="bg-amber-light/50 border border-amber/20 rounded-2xl p-6 text-sm text-foreground text-center leading-relaxed">
                        ⚠️ <strong>Medical Disclaimer:</strong> This application provides preliminary guidance and does not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment. The AI models used in this project are trained on limited datasets and should not be used as the sole basis for medical decisions.
                    </motion.div>
                </motion.div>
            </div>
        </main>

        <Footer />
    </div>
);

export default About;
