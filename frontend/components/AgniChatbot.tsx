"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  sources?: string[];
  confidence?: number;
  suggested_actions?: string[];
  follow_up_questions?: string[];
  data_card?: any;
  map_action?: { lat: number; lon: number; zoom?: number };
}

interface AgniChatbotProps {
  context?: Record<string, any>;
  onPanToCoords?: (coords: [number, number], zoom?: number) => void;
  onOpenDispatch?: (fire: any) => void;
}

const DEFAULT_SUGGESTIONS = [
  "What's the current emergency status?",
  "How to fight chemical fire?",
  "Nearest fire station to Surat?",
  "Evacuation protocol for oil refinery",
  "Compare this fire to historical data",
  "What equipment for forest fire?",
];

export default function AgniChatbot({
  context = {},
  onPanToCoords,
  onOpenDispatch,
}: AgniChatbotProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [attachedContext, setAttachedContext] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "### 🤖 AGNI-AI :: Tactical Command Assistant\n\nI am initialized with **NDMA Disaster Guidelines**, **IS Fire Safety Codes**, material safety sheets (MSDS), station directories, and live VIIRS telemetry.\n\nAsk me about fire tactics, chemical containment, nearest stations, or historical risk.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sources: ["NDMA IRS Guidelines", "Bureau of Indian Standards IS 2190"],
      confidence: 0.96,
      suggested_actions: ["Check active emergencies", "Query nearest fire station", "Chemical hazard protocol"],
      follow_up_questions: [
        "What's the current emergency status?",
        "How to fight chemical fire?",
        "Nearest fire station to Surat?",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Initialize Web Speech API for voice input
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputMessage(transcript);
        };

        recognition.onerror = (err: any) => {
          console.warn("[AGNI-VOICE] Recognition error:", err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Web Speech API is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("[AGNI-VOICE] Start error:", e);
      }
    }
  };

  const handleSpeakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown characters for clean speech
    const clean = text
      .replace(/[#*`_\[\]()]/g, "")
      .replace(/>\s*/g, "")
      .replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const payload: any = {
        message: query,
      };

      if (attachedContext) {
        payload.context = {
          ...context,
          client_timestamp: new Date().toISOString(),
        };
      }

      const res = await axios.post("/api/chat", payload);
      const data = res.data;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.response || "No response received from command unit.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources || [],
        confidence: data.confidence || 0.9,
        suggested_actions: data.suggested_actions || [],
        follow_up_questions: data.follow_up_questions || [],
        data_card: data.data_card,
        map_action: data.map_action,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If AI recommends panning map and callback provided
      if (aiMsg.map_action && onPanToCoords) {
        onPanToCoords([aiMsg.map_action.lat, aiMsg.map_action.lon], aiMsg.map_action.zoom || 11);
      }
    } catch (err: any) {
      console.warn("[AGNI-AI] Query failure:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "### ⚠️ Communications Degradation\nCould not reach remote inference node. Displaying local cached doctrine: For chemical fires, deploy AFFF foam immediately. Maintain 800m perimeter.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sources: ["IGNIS Local Fallback Cache"],
          confidence: 0.85,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: "Session cleared. AGNI-AI standing by for tactical guidance.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: ["NDMA / BIS"],
        suggested_actions: ["Query active fires", "Locate nearest station"],
        follow_up_questions: [
          "What's the current emergency status?",
          "How to fight chemical fire?",
        ],
      },
    ]);
  };

  return (
    <div className="fixed bottom-8 right-4 z-[9999] font-mono select-none">
      {/* ===================================================================== */}
      {/* 1) MINIMIZED FLOATING LAUNCHER BUTTON                                 */}
      {/* ===================================================================== */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2.5 bg-[#0f141b] border-2 border-[#00d4ff] text-[#d0d8e0] hover:text-[#00ff9c] hover:border-[#00ff9c] shadow-[0_0_20px_rgba(0,212,255,0.35)] hover:shadow-[0_0_25px_rgba(0,255,156,0.45)] transition-all duration-200 cursor-pointer corner-brackets"
          title="Open AGNI-AI Fire Response Assistant"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff9c] animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-[#00ff9c]" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-[#00d4ff] group-hover:text-[#00ff9c]">
            [ 🤖 AGNI-AI // ONLINE ]
          </span>
          <span className="text-[10px] text-[#6b7785] hidden sm:inline">[RAG-ACTIVE]</span>
        </button>
      )}

      {/* ===================================================================== */}
      {/* 2) EXPANDED TACTICAL CHAT DRAWER                                      */}
      {/* ===================================================================== */}
      {isOpen && (
        <div className="w-[360px] sm:w-[440px] h-[600px] max-h-[82vh] bg-[#0a0e14] border-2 border-[#00d4ff] shadow-[0_0_35px_rgba(0,212,255,0.4)] flex flex-col overflow-hidden corner-brackets animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="bg-[#131a22] border-b border-[#1f2933] px-3 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#ff3b3b] font-bold animate-pulse">🔥</span>
              <div>
                <div className="font-bold text-[#d0d8e0] text-[11px] tracking-wider uppercase">
                  // AGNI-AI :: FIRE RESPONSE ASSISTANT
                </div>
                <div className="text-[9px] text-[#00ff9c] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9c]" />
                  <span>RAG INDEX: NDMA • IS-CODES • FIRMS</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="px-1.5 py-0.5 border border-[#1f2933] text-[#6b7785] hover:text-[#ffb800] hover:border-[#ffb800] text-[10px] cursor-pointer"
                title="Clear Chat History"
              >
                [ ⟲ ]
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-2 py-0.5 border border-[#1f2933] text-[#6b7785] hover:text-[#ff3b3b] hover:border-[#ff3b3b] text-[10px] cursor-pointer font-bold"
                title="Minimize AGNI-AI Widget"
              >
                [ — ]
              </button>
            </div>
          </div>

          {/* Suggested Quick Prompt Carousel */}
          <div className="bg-[#0f141b] border-b border-[#1f2933] px-2 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
            {DEFAULT_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="whitespace-nowrap px-2 py-1 bg-[#15202c] border border-[#1f2933] text-[#00d4ff] hover:text-white hover:border-[#00d4ff] text-[9px] transition cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Message Scrollport */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-[#070a0e]">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? "items-start" : "items-end"}`}
                >
                  {/* Sender & Timestamp Header */}
                  <div className="flex items-center gap-2 mb-1 text-[9px] text-[#6b7785]">
                    {isAi ? (
                      <span className="text-[#00ff9c] font-bold flex items-center gap-1">
                        <span>🤖</span> [AGNI-AI]
                      </span>
                    ) : (
                      <span className="text-[#00d4ff] font-bold">[OPERATOR]</span>
                    )}
                    <span>{msg.timestamp}</span>
                    {msg.confidence && (
                      <span className="text-[#ffb800]">[{Math.round(msg.confidence * 100)}% CONF]</span>
                    )}
                  </div>

                  {/* Message Bubble Container */}
                  <div
                    className={`p-2.5 max-w-[92%] border leading-relaxed break-words ${
                      isAi
                        ? "bg-[#0f141b] border-[#1f2933] text-[#d0d8e0]"
                        : "bg-[#131d28] border-[#00d4ff]/40 text-white"
                    }`}
                  >
                    {/* Message Body with simple markdown line parsing */}
                    <div className="space-y-1.5 text-[11px]">
                      {msg.text.split("\n").map((line, lIdx) => {
                        if (line.startsWith("### ")) {
                          return (
                            <div key={lIdx} className="text-[#00d4ff] font-bold text-xs border-b border-[#1f2933] pb-0.5">
                              {line.replace("### ", "")}
                            </div>
                          );
                        }
                        if (line.startsWith("> ")) {
                          return (
                            <div key={lIdx} className="border-l-2 border-[#ffb800] pl-2 text-[#ffb800] italic text-[10px] my-1">
                              {line.replace("> ", "")}
                            </div>
                          );
                        }
                        if (line.startsWith("- ") || line.startsWith("• ")) {
                          return (
                            <div key={lIdx} className="flex items-start gap-1.5 pl-1 text-[#d0d8e0]">
                              <span className="text-[#00ff9c]">•</span>
                              <span>{line.replace(/^[-•]\s*/, "")}</span>
                            </div>
                          );
                        }
                        if (/^\d+\.\s*/.test(line)) {
                          return (
                            <div key={lIdx} className="flex items-start gap-1.5 pl-1 text-[#d0d8e0] font-semibold">
                              <span className="text-[#00d4ff]">{line.match(/^\d+\./)?.[0]}</span>
                              <span>{line.replace(/^\d+\.\s*/, "")}</span>
                            </div>
                          );
                        }
                        return line.trim() ? <p key={lIdx}>{line}</p> : <div key={lIdx} className="h-1" />;
                      })}
                    </div>

                    {/* Interactive Data Card (if provided) */}
                    {msg.data_card && (
                      <div className="mt-2.5 p-2 bg-[#080b0f] border border-[#00d4ff]/30 text-[10px] space-y-1">
                        <div className="text-[#00d4ff] font-bold flex justify-between border-b border-[#1f2933] pb-1">
                          <span>// TELEMETRY ARTIFACT</span>
                          <span className="text-[#00ff9c]">{msg.data_card.type}</span>
                        </div>
                        {msg.data_card.station_name && (
                          <div>
                            <div className="text-white font-bold">{msg.data_card.station_name}</div>
                            <div className="text-[#6b7785] flex justify-between">
                              <span>DIST: {msg.data_card.distance_km} KM</span>
                              <span className="text-[#00ff9c]">ETA: {msg.data_card.eta_minutes} MIN</span>
                            </div>
                            {onOpenDispatch && (
                              <button
                                onClick={() =>
                                  onOpenDispatch({
                                    station_name: msg.data_card.station_name,
                                    station_distance_km: msg.data_card.distance_km,
                                    station_eta_minutes: msg.data_card.eta_minutes,
                                    latitude: msg.data_card.lat || 21.1702,
                                    longitude: msg.data_card.lon || 72.8311,
                                    frp: 145.0,
                                    category: "EMERGENCY_INDUSTRIAL",
                                    risk_level: "CRITICAL",
                                  })
                                }
                                className="w-full mt-1.5 py-1 bg-[#ff3b3b]/15 border border-[#ff3b3b] text-[#ff8080] hover:text-white hover:bg-[#ff3b3b]/30 font-bold uppercase tracking-wider text-center cursor-pointer transition"
                              >
                                [ 🚒 SIMULATE DISPATCH ]
                              </button>
                            )}
                          </div>
                        )}
                        {msg.data_card.material && (
                          <div>
                            <div className="text-white font-bold">{msg.data_card.material}</div>
                            <div className="text-[#ffb800]">AGENT: {msg.data_card.primary_agent}</div>
                            <div className="text-[#ff3b3b]">AVOID: {msg.data_card.avoid}</div>
                            <div className="text-[#6b7785]">ISOLATION: {msg.data_card.isolation_m}m | DOWNWIND: {msg.data_card.evacuation_km}km</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sources Cited Pill Badges */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-[#1f2933] flex flex-wrap gap-1 items-center">
                        <span className="text-[8px] text-[#4a5563] uppercase">SOURCES:</span>
                        {msg.sources.map((src, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-1.5 py-0.5 bg-[#101721] border border-[#1f2933] text-[8px] text-[#00d4ff] truncate max-w-[200px]"
                            title={src}
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Interactive Follow-up Action Buttons */}
                    {msg.follow_up_questions && msg.follow_up_questions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="text-[8px] text-[#6b7785] uppercase tracking-wider">
                          // SUGGESTED FOLLOW-UPS:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {msg.follow_up_questions.map((fq, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => handleSendMessage(fq)}
                              className="px-2 py-0.5 bg-[#121a24] hover:bg-[#182330] border border-[#1f2933] hover:border-[#00d4ff] text-[9px] text-[#d0d8e0] text-left cursor-pointer transition"
                            >
                              ▸ {fq}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Message Footer Actions: Copy, Read Aloud, Pan Map */}
                    {isAi && (
                      <div className="mt-2 pt-1 flex items-center justify-between text-[9px] text-[#6b7785]">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="hover:text-[#00d4ff] cursor-pointer"
                          >
                            [ {copiedId === msg.id ? "COPIED ✓" : "COPY"} ]
                          </button>
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            className="hover:text-[#ffb800] cursor-pointer"
                          >
                            [ {isSpeaking ? "MUTE 🔇" : "SPEAK 🔊"} ]
                          </button>
                        </div>

                        {msg.map_action && onPanToCoords && (
                          <button
                            onClick={() =>
                              onPanToCoords(
                                [msg.map_action!.lat, msg.map_action!.lon],
                                msg.map_action!.zoom || 11
                              )
                            }
                            className="text-[#00ff9c] hover:underline cursor-pointer font-bold"
                          >
                            [ 🎯 PAN TO COORDS ]
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Thinking / Streaming Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-2 text-[#00d4ff] text-[10px] bg-[#0f141b] border border-[#1f2933]">
                <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-ping" />
                <span className="animate-pulse">AGNI-AI RETRIEVING RAG DOCTRINE & SYNTHESIZING...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Control Deck */}
          <div className="bg-[#0f141b] border-t border-[#1f2933] p-2 space-y-2">
            {/* Context & Mic Status Strip */}
            <div className="flex items-center justify-between text-[9px] text-[#6b7785]">
              <button
                onClick={() => setAttachedContext((prev) => !prev)}
                className={`flex items-center gap-1 cursor-pointer transition ${
                  attachedContext ? "text-[#00ff9c] font-bold" : "text-[#4a5563]"
                }`}
                title="Toggle real-time dashboard telemetry context"
              >
                <span>{attachedContext ? "●" : "○"}</span>
                <span>[CONTEXT: {attachedContext ? "ATTACHED" : "OFF"}]</span>
              </button>

              {isListening && (
                <span className="text-[#ff3b3b] font-bold animate-pulse">
                  🎙️ LISTENING (SPEAK NOW)...
                </span>
              )}

              <span className="hidden sm:inline">ENTER TO SEND // ESC TO CLOSE</span>
            </div>

            {/* Input Row */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isListening ? "Listening to voice input..." : "Ask AGNI-AI regarding tactics, chemical SOPs, or dispatch..."}
                disabled={isLoading}
                className="flex-1 bg-[#070a0e] border border-[#1f2933] border-b-2 border-b-[#00d4ff] px-2.5 py-1.5 text-xs text-[#d0d8e0] placeholder-[#4a5563] focus:outline-none focus:border-b-[#00ff9c] rounded-none font-mono"
              />

              {/* Voice Speech-to-Text Button */}
              <button
                onClick={toggleVoiceInput}
                disabled={isLoading}
                className={`px-2.5 py-1.5 border text-xs cursor-pointer transition ${
                  isListening
                    ? "bg-[#ff3b3b]/20 border-[#ff3b3b] text-[#ff3b3b] animate-pulse"
                    : "bg-[#121a24] border-[#1f2933] text-[#6b7785] hover:text-[#00d4ff] hover:border-[#00d4ff]"
                }`}
                title="Voice Input (Speech-to-Text)"
              >
                {isListening ? "🔴" : "🎙️"}
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="px-3 py-1.5 bg-[#00d4ff]/15 hover:bg-[#00d4ff]/30 active:bg-[#00d4ff]/40 border border-[#00d4ff] text-[#00d4ff] hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? "..." : "SEND ▷"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
