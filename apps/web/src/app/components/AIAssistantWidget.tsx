import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: 'Hi! I am the Netra AI Assistant. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const { user } = useAuth();

    if (!user) return null; // Only show if logged in

    const handleSend = () => {
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
        setInputValue('');

        // Mock AI response
        setTimeout(() => {
            let response = "I can help with that. Could you provide a bit more detail?";
            if (user.role === 'patient') response = "Based on your recent symptoms, I recommend scheduling a consultation with your doctor.";
            if (user.role === 'doctor') response = "I've analyzed the patient's symptoms. This points towards mild iron-deficiency anemia.";
            if (user.role === 'admin') response = "Checking system logs... All AI diagnostic services are running nominally.";

            setMessages(prev => [...prev, { role: 'ai', text: response }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 left-6 z-40">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-16 left-0 mb-4 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden flex flex-col"
                        style={{ height: '400px' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                <h3 className="font-semibold text-sm">Netra AI Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user'
                                                ? 'bg-teal-600 text-white rounded-br-sm'
                                                : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 text-sm outline-none px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:border-teal-500 transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center ring-4 ring-white relative group"
            >
                <div className="absolute inset-0 bg-teal-500 rounded-full blur group-hover:opacity-100 opacity-60 transition-opacity -z-10" />
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
