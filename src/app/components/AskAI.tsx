import { useState, useRef, useEffect, type ReactNode } from "react";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface Message { role: "user" | "assistant"; content: string; }
interface AskAIProps { currentBreed: string; currentMonth: string; currentDate: string; userEmail?: string; }

// "a Poodle" but "an Australian Cattle Dog"
const withArticle = (name: string) => `${/^[aeiou]/i.test(name.trim()) ? "an" : "a"} ${name}`;

// Turns **bold**, *italic* and `code` inside one line into React elements.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let count = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${count++}`;
    if (token.startsWith("**")) parts.push(<strong key={key} className="font-semibold">{token.slice(2, -2)}</strong>);
    else if (token.startsWith("`")) parts.push(<code key={key} className="bg-gray-100 px-1 rounded text-xs">{token.slice(1, -1)}</code>);
    else parts.push(<em key={key}>{token.slice(1, -1)}</em>);
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// Renders the AI's Markdown answer (headings, bullet lists, numbered lists, bold) as formatted text.
// Builds React elements only — no raw HTML is injected.
function FormattedAnswer({ content }: { content: string }) {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const k = key++;
    blocks.push(<p key={k} className="whitespace-pre-wrap">{renderInline(paragraph.join("\n"), `p${k}`)}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    const k = key++;
    const items = list.items.map((item, i) => <li key={i}>{renderInline(item, `l${k}-${i}`)}</li>);
    blocks.push(list.ordered
      ? <ol key={k} className="list-decimal pl-5 space-y-1">{items}</ol>
      : <ul key={k} className="list-disc pl-5 space-y-1">{items}</ul>);
    list = null;
  };

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trimEnd();
    const heading = line.match(/^\s*(#{1,6})\s+(.*)$/);
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);

    if (line.trim() === "") { flushParagraph(); flushList(); continue; }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushParagraph(); flushList();
      blocks.push(<hr key={key++} className="border-gray-200" />);
      continue;
    }
    if (heading) {
      flushParagraph(); flushList();
      const k = key++;
      blocks.push(<p key={k} className={heading[1].length === 1 ? "font-semibold text-base" : "font-semibold"}>{renderInline(heading[2], `h${k}`)}</p>);
      continue;
    }
    if (bullet || numbered) {
      flushParagraph();
      const ordered = !bullet;
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    flushList();
    paragraph.push(line);
  }
  flushParagraph();
  flushList();

  return <div className="text-sm space-y-2">{blocks}</div>;
}

export function AskAI({ currentBreed, currentMonth, currentDate, userEmail }: AskAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: `Hello! 🐕 I'm here to help you with questions about ${currentBreed}, general dog care, and your calendar appointments. What would you like to know?` }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const suggestedPrompts = [
    `Tell me more about ${currentBreed} temperament`, 
    `What exercise does ${withArticle(currentBreed)} need?`, 
    `Best dog activities for ${currentMonth}`, 
    "What appointments do I have this week?",
    "When is my next vet appointment?"
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    
    try {
      // Check if this is a calendar-related question
      const calendarKeywords = ['appointment', 'calendar', 'schedule', 'event', 'meeting', 'vet', 'grooming', 'plan', 'free', 'busy', 'available', 'when'];
      const isCalendarQuestion = calendarKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));
      
      let calendarContext = null;
      
      // If it's a calendar question and we have user email, fetch calendar data
      if (isCalendarQuestion && userEmail) {
        try {
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/calendar-events/${encodeURIComponent(userEmail)}`, {
            headers: { Authorization: `Bearer ${publicAnonKey}` }
          });
          if (response.ok) {
            const events = await response.json();
            calendarContext = events;
          }
        } catch (e) {
          console.error("Error fetching calendar:", e);
        }
      }
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/ask-ai`, {
        method: "POST", 
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ 
          messages: newMessages, 
          context: { 
            breed: currentBreed, 
            month: currentMonth, 
            date: currentDate,
            calendarEvents: calendarContext 
          } 
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed: ${response.status}`);
      }
      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error: any) {
      setMessages([...newMessages, { role: "assistant", content: `I'm sorry, I encountered an error: ${error?.message ?? "unknown error"}` }]);
    } finally { setIsLoading(false); }
  };

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full
