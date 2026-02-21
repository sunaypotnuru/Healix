import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Save } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useAuthStore } from "../../lib/store";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    date_of_birth: profile?.date_of_birth || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile(formData);
    if (result.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-[#0F172A] mb-8">Profile Settings</h1>

          <Card className="p-8">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-[#0D9488] text-white text-3xl">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">{profile?.full_name}</h2>
                <p className="text-[#0F172A]/70">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    value={user?.email}
                    disabled
                    className="pl-11 bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#0D9488] hover:bg-[#0F766E]"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
