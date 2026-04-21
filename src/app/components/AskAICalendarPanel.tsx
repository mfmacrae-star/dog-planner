/*
 * AskAICalendarPanel.tsx
 * Calendar-aware Ask AI slide-in panel for Digital Dog Day Planner
 * Reads today's planner entries + Google events, answers schedule questions,
 * and accepts Alexa voice intent handoffs via the same input flow.
 *
 * Copyright (c) 2026. All Rights Reserved.
 */

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Send, Mic, ChevronRight, Calendar, Clock, PawPrint, List } from "lucide-react";
import { projectId, publicAnonKey, supabase } from "../../../utils/supabase/info";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ExternalEvent {
  id: string;
  title: string;
  time: string;
}

interface PlannerEntry {
  hour: number;
  plan: string;
}

interface AskAICalendarPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  currentBreed: string;
  currentMonth: string;
  currentMonthNum: number;
  currentYear: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatHour(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}

function buildCalendarContextString(
  today: number,
  entries: PlannerEntry[],
  external: ExternalEvent[]
): string {
  const parts: string[] = [];

  if (external.length > 0) {
    parts.push("Google Calendar events today:\n" + external.map(e => `  - ${e.time}: ${e.title}`).join("\n"));
  }

  if (entries.length > 0) {
    parts.push("Personal planner entries today:\n" + entries.map(e => `  - ${formatHour(e.hour)}: ${e.plan}`).join("\n"));
  }

  if (parts.length === 0) {
    parts.push("No planner entries or Google Calendar events found for today.");
  }

  return parts.join("\n\n");
}

// Simple markdown bold renderer
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Suggested prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  { icon: Calendar, label: "What's on my schedule today?" },
  { icon: Clock,    label: "How much free time do I have this afternoon?" },
  { icon: PawPrint, label: "Reschedule my next grooming appointment" },
  { icon: List,     label: "Summarize my day in 3 bullet points" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AskAICalendarPanel({
  isOpen,
  onClose,
  userEmail,
  currentBreed,
  currentMonth,
  currentMonthNum,
  currentYear,
}: AskAICalendarPanelProps) {
  const today = new Date().getDate();
  const todayStr = `${currentMonth} ${today}, ${currentYear}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextLoaded, setContextLoaded] = useState(false);
  const [plannerEntries, setPlannerEntries] = useState<PlannerEntry[]>([]);
  const [externalEvents, setExternalEvents] = useState<ExternalEvent[]>([]);
  const [contextPills, setContextPills] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load calendar context when panel opens
  useEffect(() => {
    if (isOpen && userEmail) {
      loadTodayContext();
    }
    if (!isOpen) {
      // Reset conversation when closed
      setMessages([]);
      setContextLoaded(false);
    }
  }, [isOpen, userEmail]);

  const loadTodayContext = async () => {
    setContextLoaded(false);
    const pills: string[] = [`${currentMonth} ${today}`];

    // 1. Load personal planner entries for today from Supabase
    try {
      const { data } = await supabase
        .from("hourly_plans")
        .select("hour, plan")
        .eq("email", userEmail)
        .eq("year", currentYear)
        .eq("month", currentMonthNum)
        .eq("day", today)
        .order("hour", { ascending: true });

      if (data && data.length > 0) {
        setPlannerEntries(data as PlannerEntry[]);
        pills.push(`${data.length} planner entr${data.length > 1 ? "ies" : "y"}`);
      } else {
        setPlannerEntries([]);
      }
    } catch (e) {
      console.error("AskAICalendarPanel: error loading planner entries", e);
      setPlannerEntries([]);
    }

    // 2. Load Google Calendar events for today
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/google/events/${encodeURIComponent(userEmail)}/${currentYear}/${currentMonthNum}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const todayEvents: ExternalEvent[] = data.events?.[today] ?? [];
        setExternalEvents(todayEvents);
        if (todayEvents.length > 0) {
          pills.push(`${todayEvents.length} Google event${todayEvents.length > 1 ? "s" : ""}`);
        }
      }
    } catch (e) {
      console.error("AskAICalendarPanel: error loading Google events", e);
      setExternalEvents([]);
    }

    setContextPills(pills);
    setContextLoaded(true);
  };

  // ── Send a message ──────────────────────────────────────────────────────────

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    const calendarContext = buildCalendarContextString(today, plannerEntries, externalEvents);

    const systemPromptSuffix = `
You are a calendar assistant for the Digital Dog Day Planner app.
Today is ${todayStr}. The user's breed of the month is ${currentBreed}.

${calendarContext}

Answer concisely. If the user asks to reschedule or create an event, describe what action you would take and confirm with them first. Do not fabricate events not listed above.`;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/ask-ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            messages: updatedMessages,
            context: {
              breed: currentBreed,
              month: currentMonth,
              date: todayStr,
              calendarContext: calendarContext,
              systemSuffix: systemPromptSuffix,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.response }]);
    } catch (error: any) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: `Sorry, I hit an error: ${error?.message ?? "unknown"}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Voice input (Web Speech API) ────────────────────────────────────────────
  // Alexa handoffs arrive via the same flow — Alexa POSTs to /api/alexa on
  // your backend, which injects the resolved query text into this input and
  // calls handleSend() programmatically.

  const handleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-submit after voice input
      setTimeout(() => handleSend(transcript), 200);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — dim calendar without blocking it */}
      <div
        className="fixed inset-0 z-30 bg-black/20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-40 w-96 bg-white shadow-2xl flex flex-col border-l border-gray-200"
        style={{ animation: "slideInFromRight 0.25s ease-out" }}
        role="dialog"
        aria-label="Ask AI Calendar Panel"
      >
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <div>
              <h3 className="font-semibold text-sm leading-tight">Ask AI — Calendar</h3>
              <p className="text-xs text-white/80 leading-tight">Reads your live schedule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            aria-label="Close Ask AI panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Context strip ── */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 shrink-0">
          <p className="text-xs text-amber-700 font-semibold mb-1.5 uppercase tracking-wide">
            Context loaded
          </p>
          {contextLoaded ? (
            <div className="flex flex-wrap gap-1.5">
              {contextPills.map((pill) => (
                <span
                  key={pill}
                  className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 rounded-full text-xs text-amber-800"
                >
                  {pill}
                </span>
              ))}
              <span className="px-2.5 py-0.5 bg-green-100 border border-green-300 rounded-full text-xs text-green-800">
                ● Google Calendar
              </span>
            </div>
          ) : (
            <div className="flex gap-2">
              {[80, 60, 90].map((w, i) => (
                <div
                  key={i}
                  className="h-5 rounded-full bg-amber-200 animate-pulse"
                  style={{ width: w }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Chat area ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-3">

          {/* Suggestions — shown when no messages yet */}
          {messages.length === 0 && contextLoaded && (
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                Suggested questions
              </p>
              <div className="space-y-2">
                {SUGGESTED_PROMPTS.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => handleSend(label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-amber-400 hover:bg-amber-50 transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading skeleton for context */}
          {messages.length === 0 && !contextLoaded && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-xl bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 mr-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-amber-600 text-white rounded-tr-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant"
                  ? renderMarkdown(msg.content)
                  : msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Sources strip (after first reply) ── */}
        {messages.some((m) => m.role === "assistant") && (
          <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-100 flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-gray-400 font-medium">Sources:</span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-gray-500">Supabase hourly_plans</span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-gray-500">Google Calendar</span>
          </div>
        )}

        {/* ── Input bar ── */}
        <div className="px-4 py-3 bg-white border-t border-gray-200 shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your schedule..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 text-gray-800"
              disabled={isLoading}
            />
            <button
              onClick={handleVoice}
              title={isListening ? "Stop listening" : "Voice input"}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isListening
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                input.trim() && !isLoading
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            Reads your live schedule · Never stores chat history
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
