import { Upload, Brain, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Eye Image",
    description: "Take a photo of the conjunctiva (inner eyelid) and upload it securely to our platform.",
    color: "#0D9488",
    step: "01",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced machine learning model analyzes the image to detect signs of anemia.",
    color: "#0EA5E9",
    step: "02",
  },
  {
    icon: CheckCircle,
    title: "Get Result Instantly",
    description: "Receive accurate results within seconds with confidence scores and recommendations.",
    color: "#F43F5E",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-[#F8F9FA] to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-[#0D9488] uppercase tracking-widest">Process</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] mt-2 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get anemia screening results in three simple steps with our AI-powered detection system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-[#0D9488]/30 via-[#0EA5E9]/30 to-[#F43F5E]/30" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden border border-gray-50 hover:-translate-y-2">
                {/* Background decoration */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                  style={{ backgroundColor: step.color }}
                />

                {/* Step number */}
                <div className="absolute top-6 right-6 text-6xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors">
                  {step.step}
                </div>

                {/* Icon with hover effect */}
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                    style={{ backgroundColor: `${step.color}15` }}
                  >
                    <step.icon className="w-10 h-10" style={{ color: step.color }} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3" style={{ color: step.color }}>
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
