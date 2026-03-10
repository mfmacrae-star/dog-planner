import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { DayModal } from "./DayModal";
import { getHolidaysForDay } from "../data/holidays";
import { getDogPhotoForDate } from "../../data/dogBreedPhotos";

interface CalendarGridProps {
  month: number; year: number; weeklyImages: string[]; userEmail?: string;
}
interface ExternalEvent { id: string; title: string; time: string; }

export function CalendarGrid({ month, year, weeklyImages, userEmail }: CalendarGridProps) {
  const [events, setEvents] = useState<{ [key: number]: string }>({});
  const [externalEvents, setExternalEvents] = useState<{ [key: number]: ExternalEvent[] }>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMonthEntries();
    if (userEmail) {
      loadExternalEvents();
      const interval = setInterval(loadExternalEvents, 120000);
      return () => clearInterval(interval);
    }
  }, [month, year, userEmail]);

  const loadMonthEntries = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/calendar/month/${year}/${month}`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
      if (response.ok) { const data = await response.json(); setEvents(data.entries || {}); }
    } catch (error) { console.error("Error loading calendar entries:", error); }
  };

  const loadExternalEvents = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/google/events/${encodeURIComponent(userEmail!)}/${year}/${month}`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
      if (response.ok) { const data = await response.json(); setExternalEvents(data.events || {}); }
    } catch (error) { console.log("Error loading external calendar events:", error); }
  };

  const handleEventChange = async (day: number, value: string) => {
    setEvents(prev => ({ ...prev, [day]: value }));
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/calendar/entry`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ year, month, day, content: value }),
      });
    } catch (error) { console.error("Error saving calendar entry:", error); }
  };

  const handleSyncToGoogle = async (day: number, entry: string) => {
    if (!userEmail) { alert("Please connect your Google Calendar first"); return; }
    const timeMatch = entry.match(/\bat\s+(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    const title = timeMatch ? entry.replace(/\sat\s+\d{1,2}:\d{2}\s*(?:AM|PM)?/i, "").trim() : entry.trim();
    const time = timeMatch ? timeMatch[1].trim() : "";
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/google/sync-entry`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ email: userEmail, year, month, day, title, time }),
      });
      if (response.ok) { alert("✅ Synced to Google Calendar!"); loadExternalEvents(); }
      else { alert(`Failed to sync: ${await response.text()}`); }
    } catch (error) { alert(`Error: ${error}`); }
  };

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNumbers: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) dayNumbers.push(null);
  for (let i = 1; i <= daysInMonth; i++) dayNumbers.push(i);
  const getImageForDay = (d: number) => getDogPhotoForDate(month, d);
  const isToday = (day: number | null) => { if (!day) return false; const t = new Date(); return t.getDate() === day && t.getMonth() + 1 === month && t.getFullYear() === year; };

  return (
    <div className="w-full">
      {userEmail && (
        <div className="flex justify-end mb-3">
          <button onClick={async () => { setRefreshing(true); await loadExternalEvents(); setTimeout(() => setRefreshing(false), 500); }} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Calendar"}
          </button>
        </div>
      )}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map(day => <div key={day} className="text-center py-2 font-semibold text-gray-700">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {dayNumbers.map((day, index) => (
          <div key={index} onClick={() => day && setSelectedDay(day)}
            className={`min-h-[200px] rounded-lg overflow-hidden relative bg-white cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all ${isToday(day) ? "border-4 border-orange-500" : "border border-gray-200"}`}
            style={{ backgroundImage: day ? `url(${getImageForDay(day)})` : "none", backgroundSize: "cover", backgroundPosition: "center" }}>
            {day && (
              <>
                <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />
                <div className="relative z-10 p-2 h-full flex flex-col">
                  <div className="font-semibold text-gray-800 mb-1 text-lg">{day}</div>
                  {externalEvents[day]?.length > 0 && (
                    <div className="mb-1 space-y-1">
                      {externalEvents[day].slice(0, 2).map(event => (
                        <div key={event.id} className="text-xs bg-blue-100 border border-blue-300 rounded px-2 py-1 truncate">
                          <span className="font-semibold text-blue-700">{event.time}</span>
                        </div>
                      ))}
                      {externalEvents[day].length > 2 && <div className="text-xs text-blue-600 font-medium">+{externalEvents[day].length - 2} more</div>}
                    </div>
                  )}
                  {events[day]?.trim() && (
                    <div className="mb-1 space-y-1">
                      {events[day].split("\n").filter(l => l.trim()).slice(0, 2).map((entry, idx) => (
                        <div key={idx} className="text-xs bg-green-100 border border-green-300 rounded px-2 py-1 truncate">{entry}</div>
                      ))}
                    </div>
                  )}
                  {(() => { const h = getHolidaysForDay(month, day); return h.length > 0 ? (
                    <div className="mt-auto mb-1 space-y-0.5">
                      {h.map((hol, idx) => (
                        <div key={idx} className={`text-[9px] leading-tight truncate px-1 rounded ${hol.type === "federal" ? "text-red-700 bg-red-50" : hol.type === "religious" ? "text-purple-700 bg-purple-50" : hol.type === "dog" ? "text-amber-700 bg-amber-50" : "text-blue-700 bg-blue-50"}`}>{hol.name}</div>
                      ))}
                    </div>
                  ) : null; })()}
                  <div className="mt-auto text-xs text-gray-500 italic">Click to expand</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {selectedDay && (
        <DayModal isOpen={!!selectedDay} onClose={() => setSelectedDay(null)} day={selectedDay} month={month} year={year} photoUrl={getImageForDay(selectedDay)} plannerContent={events[selectedDay] || ""} onContentChange={(value) => handleEventChange(selectedDay, value)} externalEvents={externalEvents[selectedDay] || []} userEmail={userEmail} onSyncToGoogle={(entry) => handleSyncToGoogle(selectedDay, entry)} />
      )}
    </div>
  );
}