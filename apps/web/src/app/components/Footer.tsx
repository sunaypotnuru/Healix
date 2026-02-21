import { motion } from "motion/react";
import { Link } from "react-router";
import { Eye, Github, Twitter, Linkedin, Heart, Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  { Icon: Github, href: "https://github.com/sunaypotnuru/Healix", label: "GitHub", color: "#333" },
  { Icon: Twitter, href: "#", label: "Twitter", color: "#1DA1F2" },
  { Icon: Linkedin, href: "#", label: "LinkedIn", color: "#0A66C2" },
];

const footerLinks = {
  "Platform": [
    { label: "AI Scan", path: "/patient/scan" },
    { label: "Find Doctors", path: "/patient/doctors" },
    { label: "Nearby Hospitals", path: "/patient/hospitals" },
    { label: "Appointments", path: "/patient/appointments" },
  ],
  "For Doctors": [
    { label: "Doctor Portal", path: "/login/doctor" },
    { label: "Manage Availability", path: "/doctor/availability" },
    { label: "Patient Records", path: "/doctor/appointments" },
  ],
  "Company": [
    { label: "About Us", path: "/#about" },
    { label: "How It Works", path: "/#how-it-works" },
    { label: "Contact", path: "/#contact" },
    { label: "Privacy Policy", path: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative">
      {/* Wave Separator */}
      <div className="w-full overflow-hidden -mb-1">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,70 1440,80 L1440,120 L0,120 Z" fill="#0F172A" />
        </svg>
      </div>

      <div className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2.5 mb-4"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#0D9488] to-[#0F766E] rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Netra AI</span>
              </motion.div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
                AI-powered anemia detection through eye scan analysis. Connecting patients with doctors through smart, multilingual consultations.
              </p>
              <div className="space-y-2 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> netraai@gmail.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +91 98765 43210
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Hyderabad, India
                </div>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-white/90 mb-4">{title}</h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="text-sm text-white/50 hover:text-[#2DD4BF] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © 2026 Netra AI. Built with{" "}
              <Heart className="inline w-3 h-3 text-[#F43F5E]" /> for accessible healthcare.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: `${color}20`,
                    boxShadow: `0 0 20px ${color}40`,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
