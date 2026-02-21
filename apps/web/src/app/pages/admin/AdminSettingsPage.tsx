import { motion } from 'motion/react';
import { Settings, Shield, Bell, Key } from 'lucide-react';
import { Card } from '../../components/ui/card';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Platform Settings</h1>
                <p className="text-[#64748B]">Manage global configuration and security preferences</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-6 bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm h-full">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">Security & Access</h3>
                        <p className="text-[#64748B] text-sm mb-4">Configure role-based access control and 2FA requirements for staff accounts.</p>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Configure Security →</button>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="p-6 bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm h-full">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">Global Notifications</h3>
                        <p className="text-[#64748B] text-sm mb-4">Manage SMS and Email notification templates sent to patients and doctors.</p>
                        <button className="text-sm font-semibold text-purple-600 hover:text-purple-700">Manage Templates →</button>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="p-6 bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm h-full">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                            <Key className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">API Keys & Integrations</h3>
                        <p className="text-[#64748B] text-sm mb-4">Manage connection keys for LiveKit (Video), SendGrid (Emails), and ML Models.</p>
                        <button className="text-sm font-semibold text-teal-600 hover:text-teal-700">View API Keys →</button>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="p-6 bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm h-full">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">System Preferences</h3>
                        <p className="text-[#64748B] text-sm mb-4">Adjust timezone, base currency, and regional compliance settings.</p>
                        <button className="text-sm font-semibold text-slate-600 hover:text-slate-700">General Settings →</button>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
