import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface FeedbackButtonProps {
  userEmail?: string;
}

export function FeedbackButton({ userEmail }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleClose = () => {
    setIsOpen(false);
    setMessage("");
    setStatus("idle");
  };

  const handleSubmit = async () => {
    if (!message.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
          body: JSON.stringify({ email: userEmail, message }),
        }
      );
      if (response.ok) {
        setStatus("sent");
        setMessage("");
        setTimeout(handleClose, 2500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 left-8 z-40 bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-full shadow-md hover:shadow-lg hover:text-gray-800 transition-all text-sm font-medium flex items-center gap-1.5"
        >
          <MessageSquare className="w-4 h-4" />
          Feedback
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-8 left-8 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="font-semibold text-gray-800 text-sm">Send Feedback</span>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            {status === "sent" ? (
              <p className="text-green-600 text-sm text-center py-4">Thanks for your feedback! 🐾</p>
            ) : (
              <>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
                  placeholder="Tell us what you think..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                  rows={4}
                  disabled={status === "sending"}
                />
                {status === "error" && (
                  <p className="text-red-500 text-xs mt-1">Something went wrong. Please try again.</p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || status === "sending"}
                  className="mt-3 w-full bg-amber-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {status === "sending" ? "Sending..." : "Send Feedback"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
