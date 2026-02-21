import { motion } from "motion/react";
import { Activity } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-[#0D9488]" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F43F5E] rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold text-white">Anemia AI</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              Contact
            </a>
          </div>

          {/* CTA Button */}
          <Button className="bg-white text-[#0D9488] hover:bg-white/90 font-semibold shadow-lg">
            Get Started
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
