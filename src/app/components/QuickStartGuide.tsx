import { X, Calendar, BookOpen, Printer, Smartphone, Sparkles, MessageSquare } from "lucide-react";

interface QuickStartGuideProps {
  onClose: () => void;
}

const features = [
  {
    icon: <Calendar className="w-5 h-5 text-amber-600" />,
    title: "Monthly Calendar",
    desc: "Browse months using the arrows next to the month name. Each day shows the month's featured dog breed photo — the photo rotates each week.",
  },
  {
    icon: <Calendar className="w-5 h-5 text-amber-500" />,
    title: "Day Planner",
    desc: "Click any calendar day to open an hourly planner (6am–10pm). Type notes into any time slot — they save automatically.",
  },
  {
    icon: <BookOpen className="w-5 h-5 text-amber-600" />,
    title: "Breed Book",
    desc: 'Tap "Breed Book" in the top menu to explore all 12 featured dog breeds — their history, personality, and what makes each one unique.',
  },
  {
    icon: <Printer className="w-5 h-5 text-gray-600" />,
    title: "Print Your Calendar",
    desc: 'Click the "Print" button next to the month name. The app automatically hides navigation and buttons so only the clean calendar grid prints.',
  },
  {
    icon: <Smartphone className="w-5 h-5 text-amber-600" />,
    title: "Add to Your Phone",
    desc: "iPhone: Open in Safari → tap Share (box with arrow) → Add to Home Screen. Android: Open in Chrome → tap ⋮ menu → Add to Home Screen. The app appears as an icon just like a native app.",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    title: "Ask AI",
    desc: "Tap the sparkle button in the bottom-right corner. Ask anything — dog breed questions, care tips, what's on your schedule, or how to use any feature.",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-gray-500" />,
    title: "Feedback",
    desc: "Use the Feedback button to send suggestions or comments directly to our team.",
  },
];

export function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-semibold">Quick Start Guide</h2>
            <p className="text-sm text-white/80 mt-0.5">Digital Dog Day Planner & Calendar</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {features.map((f, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="mt-0.5 shrink-0">{f.icon}</div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                <p className="text-gray-600 text-sm mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-amber-50 text-center">
          <p className="text-sm text-amber-800">
            <Sparkles className="w-4 h-4 inline mr-1 text-amber-500" />
            Have a question not covered here? Tap <strong>Ask AI</strong> for detailed help on any topic.
          </p>
        </div>
      </div>
    </div>
  );
}
