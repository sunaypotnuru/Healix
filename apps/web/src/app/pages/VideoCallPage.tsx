/// <reference types="vite/client" />
import { useEffect, useState } from "react";
// @ts-ignore
import { useParams, useNavigate } from "react-router";
// @ts-ignore
import { motion, AnimatePresence } from "motion/react";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import {
  Globe, Activity, X, Shield, FileText
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../../lib/store";
import { videoAPI } from "../../lib/api";

// Mock dialogue demonstrating active translation
const mockDialogue = [
  { speaker: 'Doctor', original: 'How are you feeling today?', translated: 'आप आज कैसा महसूस कर रहे हैं?', time: '10:02 AM' },
  { speaker: 'Patient', original: 'मुझे हर समय बहुत थकान महसूस होती है।', translated: 'I feel very tired all the time.', time: '10:03 AM' },
  { speaker: 'Doctor', original: 'We will check your hemoglobin levels.', translated: 'हम आपके हीमोग्लोबिन स्तर की जांच करेंगे।', time: '10:04 AM' },
];

export default function VideoCallPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'doctor';

  const [token, setToken] = useState("");
  const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "wss://netrai-consult-b4c4xk1c.livekit.cloud";

  const [showScribe, setShowScribe] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Translation States
  const [translationActive, setTranslationActive] = useState(false);
  const [myLanguage, setMyLanguage] = useState(isDoctor ? 'English' : 'Hindi');

  useEffect(() => {
    if (!user || !appointmentId) return;
    const fetchToken = async () => {
      try {
        const res = await videoAPI.getToken(appointmentId, user.name || "Guest");
        if (res.data?.token) {
          setToken(res.data.token);
        }
      } catch (err) {
        console.error("Failed to fetch LiveKit token", err);
      }
    };
    fetchToken();
  }, [user, appointmentId]);

  const handleEndCall = () => {
    // Navigating away will unmount the room and disconnect automatically via component teardown.
    navigate(isDoctor ? "/doctor/appointments" : "/patient/appointments");
  };

  return (
    <div className="h-screen max-h-screen bg-[#0F172A] flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-6 bg-[#1E293B] border-b border-white/10 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium text-sm hidden sm:block">End-to-End Encrypted</span>
          </div>
          <div className="w-px h-6 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span className="font-mono">{appointmentId}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTranslationActive(!translationActive)}
            className={`gap-2 ${translationActive ? 'text-[#0D9488] bg-[#0D9488]/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:block">Live Translation: {translationActive ? 'ON' : 'OFF'}</span>
          </Button>

          {isDoctor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowScribe(!showScribe)}
              className={`gap-2 ${showScribe ? 'text-[#8B5CF6] bg-[#8B5CF6]/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:block">AI Scribe</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Area containing LiveKit */}
        <div className="flex-1 relative flex flex-col bg-black">
          {!token ? (
            <div className="flex-1 flex items-center justify-center text-white flex-col gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p>Joining secure room...</p>
            </div>
          ) : (
            <LiveKitRoom
              video={true}
              audio={true}
              token={token}
              serverUrl={serverUrl}
              connect={true}
              onDisconnected={handleEndCall}
              data-lk-theme="default"
              style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
            >
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          )}
        </div>

        {/* Side Panels - Independent from LiveKit for custom integrations */}
        <AnimatePresence mode="wait">
          {(showScribe && isDoctor) ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              className="bg-white/95 backdrop-blur-xl border-l border-white/20 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col z-10"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-2 text-[#0F172A]">
                  <Activity className="w-5 h-5 text-[#8B5CF6]" />
                  <h3 className="font-bold">AI Clinical Scribe</h3>
                </div>
                <button onClick={() => setShowScribe(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto bg-gray-50/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Listening Stream...</span>
                  </div>

                  <Card className="p-4 shadow-sm border-gray-200">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Auto-Generated Notes</h4>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      Patient complains of chronic fatigue and weakness over the past 3 weeks.
                      Noted pallor in conjunctiva during visual inspection.
                      Recent blood work indicates microcytic anemia with Hb at 10.2 g/dL.
                    </p>
                    <div className="bg-[#F0F9FF] border border-[#BAE6FD] p-3 rounded-lg">
                      <h5 className="text-xs font-bold text-[#0284C7] mb-1">Suggested Diagnosis</h5>
                      <p className="text-sm text-[#0369A1]">Iron Deficiency Anemia (IDA)</p>
                    </div>
                  </Card>
                </div>
              </div>
              <div className="p-4 bg-white border-t border-gray-200">
                <Button className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Save to Patient Record
                </Button>
              </div>
            </motion.div>
          ) : (translationActive) ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              className="bg-white/95 backdrop-blur-xl border-l border-white/20 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col z-10"
            >
              <div className="p-4 border-b border-gray-100 flex flex-col gap-3 bg-white/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0F172A]">
                    <Globe className={`w-5 h-5 ${translationActive ? 'text-[#0D9488]' : 'text-gray-400'}`} />
                    <h3 className="font-bold">Live Transcript & Translation</h3>
                  </div>
                  <button onClick={() => setTranslationActive(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm bg-white p-2 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">My Language</p>
                    <select
                      className="w-full bg-transparent font-semibold text-[#0F172A] outline-none"
                      value={myLanguage}
                      onChange={(e) => setMyLanguage(e.target.value)}
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Telugu</option>
                      <option>Tamil</option>
                    </select>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Translating To</p>
                    <p className="font-semibold text-[#0F172A]">{myLanguage}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto bg-gray-50/50 space-y-4">
                {mockDialogue.map((msg, i) => {
                  const isMe = msg.speaker === (isDoctor ? 'Doctor' : 'Patient');
                  const displayMessage = isMe ? msg.original : msg.translated;

                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">{msg.speaker}</span>
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                      </div>
                      <div className={`max-w-[85%] rounded-2xl p-3 ${isMe
                        ? 'bg-[#0D9488] text-white rounded-tr-sm'
                        : 'bg-white border border-gray-200 text-[#0F172A] rounded-tl-sm shadow-sm'
                        }`}>
                        <p className="text-sm">{displayMessage}</p>
                      </div>
                      {(!isMe) && (
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Translated
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
