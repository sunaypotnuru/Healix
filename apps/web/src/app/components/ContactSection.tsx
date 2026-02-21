import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "./ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? Our team is here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-[#F8F9FA] to-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-6">Send Us a Message</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0D9488] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0D9488] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea rows={4} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0D9488] focus:outline-none transition-colors resize-none" />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-shadow">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-white/90">123 Medical Street, Health City<br />HC 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-white/90">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-white/90">netraai@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Business Hours</h4>
                    <p className="text-white/90">Mon-Fri: 9AM-6PM | Sat: 10AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F9FA] rounded-3xl p-8 border-2 border-[#0D9488]/20">
              <h4 className="text-xl font-bold text-[#0F172A] mb-3">Emergency Support</h4>
              <p className="text-gray-700 mb-4">
                For urgent medical concerns, please contact your healthcare provider or emergency services immediately.
              </p>
              <p className="text-sm text-gray-600">
                This AI screening tool is not a substitute for professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
