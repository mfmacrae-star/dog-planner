import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface WelcomeModalProps {
  userEmail: string;
}

const STORAGE_KEY = (email: string) => `dog-planner:welcome-seen:${email}`;

export function WelcomeModal({ userEmail }: WelcomeModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    if (!localStorage.getItem(STORAGE_KEY(userEmail))) {
      setVisible(true);
    }
  }, [userEmail]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY(userEmail), "1");
    setVisible(false);
  };

  if (!visible) return null;

  const features = [
    {
      icon: "🐕",
      title: "Monthly Dog Breeds",
      desc: "A new featured breed every month with history, photos, and care tips.",
    },
    {
      icon: "🗓️",
      title: "Hourly Day Planner",
      desc: "Click any day on the calendar to plan your hours with timed slots.",
    },
    {
      icon: "🙏",
      title: "Gratitude Journal",
      desc: "Record something you're grateful for each day — private to you.",
    },
    {
      icon: "✨",
      title: "Ask AI",
      desc: "Get breed-specific advice, grooming tips, and training help instantly.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white relative">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-4xl mb-2">🐾</div>
          <h2 className="text-2xl font-serif font-bold">Welcome to Digital Dog Day Planner & Calendar</h2>
          <p className="text-amber-100 text-sm mt-1">Your daily companion for paw-some planning</p>
        </div>
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-5">
            Here's everything you can do with your planner:
          </p>
          <ul className="space-y-3 mb-6">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5">{f.icon}</span>
                <div>
                  <span className="font-semibold text-gray-800 text-sm">{f.title} — </span>
                  <span className="text-gray-600 text-sm">{f.desc}</span>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={dismiss}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
