import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface Message { role: "user" | "assistant"; content: string; }
interface AskAIProps { currentBreed: string; currentMonth: string; currentDate: string; }

export function AskAI({ currentBreed, currentMonth, currentDate }: AskAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: `Hello! 🐕 I'm here to help you with questions about ${currentBreed} and general dog care. What would you like to know?` }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const suggestedPrompts = [`Tell me more about ${currentBreed} temperament`, `What exercise does a ${currentBreed} need?`, `Best dog activities for ${currentMonth}`, "Suggest a gratitude prompt about my dog"];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/ask-ai`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ messages: newMessages, context: { breed: currentBreed, month: currentMonth, date: currentDate } }),
      });
      if (!response.ok) throw new Error(`AI request failed: ${response.status}`);
      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "I'm sorry, I encountered an error. Please check your OpenAI API key configuration." }]);
    } finally { setIsLoading(false); }
  };

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 group">
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">Ask me!</span>
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2"><Sparkles className="w-5 h-5" /><h3 className="font-semibold">Ask AI About Dogs</h3></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMessages([{ role: "assistant", content: `Hello! 🐕 I'm here to help with ${currentBreed} questions!` }])} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded">Clear</button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded"><X className="w-5 h-5" /></button>
            </div>
          </div>
          {messages.length <= 1 && (
            <div className="p-4 bg-purple-50 border-b">
              <p className="text-sm text-gray-600 mb-2">💡 You can ask me:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button key={index} onClick={() => setInput(prompt)} className="text-xs bg-white hover:bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200 transition-colors">{prompt}</button>
                ))}
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === "user" ? "bg-purple-600 text-white" : "bg-white text-gray-800 border border-gray-200"}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && <div className="flex justify-start"><div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><p className="text-sm">Thinking...</p></div></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type your question..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" disabled={isLoading} />
              <button onClick={handleSend} disabled={!input.trim() || isLoading} className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300"><Send className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Context: {currentBreed} • {currentMonth} • {currentDate}</p>
          </div>
        </div>
      )}
    </>
  );
}
