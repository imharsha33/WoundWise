import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
    { to: "/", label: "Home" },
    { to: "/assess", label: "Assessment" },
    { to: "/about", label: "About" },
];

const Navbar = () => {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
        >
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-display text-lg font-semibold text-foreground">WoundWise</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.to
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {item.label}
                            {location.pathname === item.to && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                <Link
                    to="/assess"
                    className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                    Start Assessment
                </Link>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 text-foreground"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-border bg-background"
                >
                    <div className="flex flex-col p-4 gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileOpen(false)}
                                className={`px-4 py-3 rounded-lg text-sm font-medium ${location.pathname === item.to
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            to="/assess"
                            onClick={() => setMobileOpen(false)}
                            className="mt-2 text-center px-5 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-xl"
                        >
                            Start Assessment
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
