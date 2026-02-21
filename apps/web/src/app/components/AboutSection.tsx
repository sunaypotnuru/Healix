import { Heart, Users, Award, Zap } from "lucide-react";

const features = [
  { icon: Heart, title: "Non-Invasive", description: "No blood samples required. Simple eye image analysis provides quick screening.", color: "#F43F5E" },
  { icon: Zap, title: "Instant Results", description: "Get AI-powered analysis in under 5 seconds with high accuracy rates.", color: "#F39C12" },
  { icon: Users, title: "Accessible", description: "Available to anyone with a smartphone camera. Healthcare made accessible.", color: "#0EA5E9" },
  { icon: Award, title: "95% Accuracy", description: "Trained on thousands of images with medical professional validation.", color: "#0D9488" },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text content */}
          <div>
            <span className="text-sm font-semibold text-[#0D9488] uppercase tracking-widest">About</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] mt-2 mb-6">
              About Anemia Detection
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Anemia is a condition where you lack enough healthy red blood cells
              to carry adequate oxygen to your body's tissues. It affects over{" "}
              <strong className="text-[#F43F5E]">1.62 billion people</strong>{" "}
              globally.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our AI-powered detection system analyzes the conjunctiva (inner
              eyelid) to detect signs of anemia quickly and accurately, making
              early screening accessible to everyone.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Stats visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] rounded-3xl p-12 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-2xl" />
              <div className="absolute bottom-12 left-8 w-20 h-20 bg-white/10 rounded-2xl" />

              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-white text-center">
                  <div className="text-6xl font-bold mb-2">10K+</div>
                  <div className="text-lg mb-6 text-white/90">Successful Scans</div>
                  <div className="h-px bg-white/20 my-6" />
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="hover:scale-110 transition-transform">
                      <div className="text-3xl font-bold">95%</div>
                      <div className="text-xs text-white/80 mt-1">Accuracy</div>
                    </div>
                    <div className="hover:scale-110 transition-transform">
                      <div className="text-3xl font-bold">&lt;5s</div>
                      <div className="text-xs text-white/80 mt-1">Speed</div>
                    </div>
                    <div className="hover:scale-110 transition-transform">
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-xs text-white/80 mt-1">Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-[#0D9488]/15 to-[#0EA5E9]/15 rounded-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
