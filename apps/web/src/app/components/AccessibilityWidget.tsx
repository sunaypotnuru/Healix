import { useState, useEffect } from 'react';
import { Accessibility, Type, Contrast, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);

    useEffect(() => {
        if (highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, [highContrast]);

    useEffect(() => {
        if (largeText) {
            document.documentElement.classList.add('large-text');
        } else {
            document.documentElement.classList.remove('large-text');
        }
    }, [largeText]);

    return (
        <>
            {/* Floating A11y Button */}
            <motion.button
                className="fixed top-24 right-0 z-50 bg-slate-900 text-white p-3 rounded-l-xl shadow-lg border-y border-l border-slate-700 hover:bg-slate-800 transition-colors"
                onClick={() => setIsOpen(true)}
                aria-label="Accessibility Options"
                whileHover={{ x: -4 }}
            >
                <Accessibility className="w-5 h-5" />
            </motion.button>

            {/* A11y Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-80 bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900">
                                        <Accessibility className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">Accessibility</h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">View Settings</h3>

                                    {/* High Contrast Toggle */}
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors mb-4">
                                        <div className="flex items-center gap-3">
                                            <Contrast className="w-5 h-5 text-slate-700" />
                                            <div>
                                                <p className="font-medium text-slate-900">High Contrast</p>
                                                <p className="text-xs text-slate-500">Increase visual distinction</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setHighContrast(!highContrast)}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${highContrast ? 'bg-teal-600' : 'bg-slate-200'}`}
                                            role="switch"
                                            aria-checked={highContrast}
                                        >
                                            <motion.div
                                                className="w-4 h-4 rounded-full bg-white absolute top-1 shadow-sm"
                                                animate={{ left: highContrast ? '26px' : '4px' }}
                                            />
                                        </button>
                                    </div>

                                    {/* Large Text Toggle */}
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Type className="w-5 h-5 text-slate-700" />
                                            <div>
                                                <p className="font-medium text-slate-900">Large Text</p>
                                                <p className="text-xs text-slate-500">Increase global font size</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setLargeText(!largeText)}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${largeText ? 'bg-teal-600' : 'bg-slate-200'}`}
                                            role="switch"
                                            aria-checked={largeText}
                                        >
                                            <motion.div
                                                className="w-4 h-4 rounded-full bg-white absolute top-1 shadow-sm"
                                                animate={{ left: largeText ? '26px' : '4px' }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
