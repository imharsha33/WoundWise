import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
    <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                            <Heart className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-display text-lg font-semibold">WoundWise</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        AI-powered wound assessment companion providing preliminary guidance for injury evaluation and recovery planning.
                    </p>
                </div>
                <div>
                    <h4 className="font-display font-semibold mb-3">Quick Links</h4>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                        <Link to="/assess" className="hover:text-foreground transition-colors">Assessment Tool</Link>
                        <Link to="/about" className="hover:text-foreground transition-colors">About Project</Link>
                    </div>
                </div>
                <div>
                    <h4 className="font-display font-semibold mb-3">Technology</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Built with React, TypeScript, TensorFlow, and FastAPI. Uses transfer learning with ResNet50 for wound classification.
                    </p>
                </div>
            </div>
            <div className="mt-10 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    ⚠️ <strong>Medical Disclaimer:</strong> This application provides preliminary guidance and does not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
