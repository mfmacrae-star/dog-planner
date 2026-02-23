import { X, Upload } from "lucide-react";
import { useState } from "react";

interface ExternalEvent { id: string; title: string; time: string; }
interface DayModalProps {
  isOpen: boolean; onClose: () => void; day: number; month: number; year: number;
  photoUrl: string; plannerContent: string; onContentChange: (value: string) => void;
  externalEvents: ExternalEvent[]; userEmail?: string; onSyncToGoogle: (entry: string) => void;
}

export function DayModal({ isOpen, onClose, day, month, year, photoUrl, plannerContent, onContentChange, externalEvents, userEmail, onSyncToGoogle }: DayModalProps) {
  const [syncingEntry, setSyncingEntry] = useState<string | null>(null);
  const [eventTime, setEventTime] = useState("");
  if (!isOpen) return null;
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{monthNames[month - 1]} {day}, {year}</h2>
            <p className="text-sm text-gray-600 mt-1">Plan your day</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-full transition-colors"><X className="w-6 h-6 text-gray-600" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-square">
                <img src={photoUrl} alt={`Dog of the day ${day}`} className="w-full h-full object-cover" />
              </div>
              {externalEvents.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Google Calendar Events</h3>
                  <div className="space-y-2">
                    {externalEvents.map(event => (
                      <div key={event.id} className="bg-white rounded px-3 py-2 border border-blue-200">
                        <div className="font-semibold text-blue-700 text-sm">{event.time}</div>
                        <div className="text-blue-900 text-sm">{event.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Your Plans for Today</h3>
                {plannerContent?.trim() && (
                  <div className="mb-4 space-y-2">
                    {plannerContent.split("\n").filter(l => l.trim()).map((entry, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg px-3 py-2 flex items-center justify-between group">
                        <span className="text-green-900 font-medium">{entry}</span>
                        {userEmail && (
                          <button onClick={() => { setSyncingEntry(entry); setEventTime(""); }} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-green-100 rounded">
                            <Upload className="w-4 h-4 text-green-700" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 focus-within:border-amber-400 transition-colors">
                <textarea value={plannerContent} onChange={(e) => onContentChange(e.target.value)} placeholder="Add your plans for the day" className="w-full h-96 text-base bg-transparent border-none outline-none resize-none text-gray-700 placeholder:text-gray-400" />
              </div>
              <div className="text-xs text-gray-500 italic">Tip: Each line becomes a separate to-do. Hover over entries to sync with Google Calendar.</div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">Done</button>
        </div>
      </div>
    </div>
  );
}
