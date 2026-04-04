import { X, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { getQuoteForDate } from "../data/quotes";
import { projectId, publicAnonKey, supabase } from "../../../utils/supabase/info";

interface ExternalEvent { id: string; title: string; time: string; }
interface DayModalProps {
  isOpen: boolean; onClose: () => void; day: number; month: number; year: number;
  photoUrl: string; plannerContent: string; onContentChange: (value: string) => void;
  externalEvents: ExternalEvent[]; userEmail?: string; onSyncToGoogle: (entry: string) => void;
}

export function DayModal({ isOpen, onClose, day, month, year, photoUrl, plannerContent, onContentChange, externalEvents, userEmail, onSyncToGoogle }: DayModalProps) {
  const saveTimers = useRef<{[key: number]: ReturnType<typeof setTimeout>}>({});
  const statusTimers = useRef<{[key: number]: ReturnType<typeof setTimeout>}>({});
  const [saveStatus, setSaveStatus] = useState<{[hour: number]: { ok: boolean; message: string }}>({});
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [syncingEntry, setSyncingEntry] = useState<string | null>(null);
  const [eventTime, setEventTime] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [hourlyPlans, setHourlyPlans] = useState<{[key: number]: string}>({});
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateObj = new Date(year, month - 1, day);
  const dailyQuote = getQuoteForDate(dateObj);

  useEffect(() => {
    if (isOpen) {
      loadGratitude();
      loadHourlyPlans();
    }
  }, [isOpen, day, month, year, userEmail]);

  useEffect(() => {
    if (openDropdown === null) return;
    const handler = (e: MouseEvent) => setOpenDropdown(null);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  const loadGratitude = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/gratitude/${year}/${month}/${day}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      if (res.ok) { const data = await res.json(); setGratitude(data.content || ""); }
    } catch (e) { console.error(e); }
  };

  const loadHourlyPlans = async () => {
    if (!userEmail) return;
    try {
      const { data, error } = await supabase
        .from('hourly_plans')
        .select('hour, plan')
        .eq('email', userEmail)
        .eq('year', year)
        .eq('month', month)
        .eq('day', day);

      if (error) {
        console.error('Error loading hourly plans:', error);
        return;
      }

      const plansObj: {[key: number]: string} = {};
      data?.forEach((item: any) => {
        plansObj[item.hour] = item.plan;
      });
      setHourlyPlans(plansObj);
    } catch (error) {
      console.error('Error loading hourly plans:', error);
    }
  };

  const handleGratitudeChange = async (value: string) => {
    setGratitude(value);
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/gratitude/entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ year, month, day, content: value }),
      });
    } catch (e) { console.error(e); }
  };

  const handleHourlyPlanChange = (hour: number, value: string) => {
    setHourlyPlans(prev => ({ ...prev, [hour]: value }));
    if (saveTimers.current[hour]) clearTimeout(saveTimers.current[hour]);
    saveTimers.current[hour] = setTimeout(() => saveHourlyPlan(hour, value), 500);
  };

  const showSaveStatus = (hour: number, ok: boolean, message: string) => {
    setSaveStatus(prev => ({ ...prev, [hour]: { ok, message } }));
    if (statusTimers.current[hour]) clearTimeout(statusTimers.current[hour]);
    statusTimers.current[hour] = setTimeout(() => {
      setSaveStatus(prev => { const next = { ...prev }; delete next[hour]; return next; });
    }, 3000);
  };

  const saveHourlyPlan = async (hour: number, value: string) => {
    if (!userEmail) {
      showSaveStatus(hour, false, 'Error: no user email');
      console.error('[saveHourlyPlan] Aborted — userEmail is empty:', userEmail);
      return;
    }
    console.log('[saveHourlyPlan] Starting save:', { hour, value, userEmail, year, month, day });
    try {
      if (!value.trim()) {
        const deleteResult = await supabase
          .from('hourly_plans')
          .delete()
          .eq('email', userEmail)
          .eq('year', year)
          .eq('month', month)
          .eq('day', day)
          .eq('hour', hour);
        console.log('[saveHourlyPlan] Delete (clear):', deleteResult);
        if (deleteResult.error) {
          showSaveStatus(hour, false, `Error: ${deleteResult.error.message}`);
        } else {
          showSaveStatus(hour, true, 'Cleared');
        }
      } else {
        const deleteResult = await supabase
          .from('hourly_plans')
          .delete()
          .eq('email', userEmail)
          .eq('year', year)
          .eq('month', month)
          .eq('day', day)
          .eq('hour', hour);
        console.log('[saveHourlyPlan] Delete (pre-insert):', deleteResult);

        const insertResult = await supabase
          .from('hourly_plans')
          .insert({
            email: userEmail,
            year,
            month,
            day,
            hour,
            plan: value,
            updated_at: new Date().toISOString()
          });
        console.log('[saveHourlyPlan] Insert:', insertResult);

        if (insertResult.error) {
          showSaveStatus(hour, false, `Error: ${insertResult.error.message}`);
        } else {
          showSaveStatus(hour, true, 'Saved');
        }
      }
    } catch (err: any) {
      console.error('[saveHourlyPlan] Exception:', err);
      showSaveStatus(hour, false, `Error: ${err?.message ?? 'unknown'}`);
    }
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  const buildICSContent = (title: string, hour: number) => {
    const formatLocal = (y: number, mo: number, d: number, h: number) =>
      `${y}${pad(mo)}${pad(d)}T${pad(h)}0000`;
    const uid = `${Date.now()}@dog-planner.app`;
    const now = new Date();
    const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dog Day Planner//EN',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      `UID:${uid}`, `DTSTAMP:${stamp}`,
      `DTSTART;TZID=America/New_York:${formatLocal(year, month, day, hour)}`,
      `DTEND;TZID=America/New_York:${formatLocal(year, month, day, hour + 1)}`,
      `SUMMARY:${title}`, 'DESCRIPTION:Added from Dog Day Planner',
      'STATUS:CONFIRMED', 'SEQUENCE:0', 'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
  };

  const downloadICS = (hour: number, suffix: string) => {
    const plan = hourlyPlans[hour];
    if (!plan?.trim()) return;
    const blob = new Blob([buildICSContent(plan, hour)], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.replace(/[^a-z0-9]/gi, '_')}_${suffix}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGoogleCalendar = (hour: number) => {
    const plan = hourlyPlans[hour];
    if (!plan?.trim()) return;
    const startDt = `${year}${pad(month)}${pad(day)}T${pad(hour)}0000`;
    const endDt = `${year}${pad(month)}${pad(day)}T${pad(hour + 1)}0000`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(plan)}&dates=${startDt}/${endDt}&details=${encodeURIComponent('Added from Dog Day Planner')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{monthNames[month - 1]} {day}, {year}</h2>
            <p className="text-sm text-gray-600 mt-1">Plan your day with hourly slots</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-full transition-colors"><X className="w-6 h-6 text-gray-600" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-square">
                <img src={photoUrl} alt={`Dog of the day ${day}`} className="w-full h-full object-cover" />
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">🙏 Today I am grateful for:</label>
                <div className="mb-2 p-2 bg-white rounded-lg border border-amber-100">
                  <p className="text-xs italic text-gray-500">"{dailyQuote}"</p>
                </div>
                <textarea
                  value={gratitude}
                  onChange={(e) => handleGratitudeChange(e.target.value)}
                  placeholder="Add your gratitude entry here..."
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  className="w-full p-2 border border-amber-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-sm"
                  rows={3}
                />
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
                <h3 className="font-semibold text-gray-800 mb-3">Plans for the Day</h3>
                <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((hour) => {
                      const displayHour = hour > 12 ? hour - 12 : hour;
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const formattedHour = hour === 12 ? '12' : displayHour.toString();
                      return (
                        <div key={hour} className="flex hover:bg-gray-50 transition-colors group">
                          <div className="w-20 flex-shrink-0 px-3 py-2 text-xs font-medium text-gray-500 border-r border-gray-100">
                            {formattedHour}:00 {ampm}
                          </div>
                          <div className="flex-1 px-3 py-2 flex items-center gap-2">
                            <input
                              type="text"
                              value={hourlyPlans[hour] || ''}
                              onChange={(e) => handleHourlyPlanChange(hour, e.target.value)}
                              placeholder=""
                              data-gramm="false"
                              data-gramm_editor="false"
                              data-enable-grammarly="false"
                              className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent border-none outline-none focus:ring-0"
                            />
                            {hourlyPlans[hour]?.trim() && (
                              <div className="relative">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === hour ? null : hour); }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-blue-100 rounded text-blue-600"
                                  title="Add to calendar"
                                >
                                  <CalendarIcon className="w-4 h-4" />
                                </button>
                                {openDropdown === hour && (
                                  <div
                                    className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[190px]"
                                    onMouseDown={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => { handleGoogleCalendar(hour); setOpenDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                                    >
                                      Google Calendar
                                    </button>
                                    <button
                                      onClick={() => { downloadICS(hour, 'apple'); setOpenDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                                    >
                                      Apple Calendar (.ics)
                                    </button>
                                    <button
                                      onClick={() => { downloadICS(hour, 'outlook'); setOpenDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                                    >
                                      Outlook (.ics)
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                            {saveStatus[hour] && (
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${saveStatus[hour].ok ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                {saveStatus[hour].message}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-xs text-gray-500 italic mt-2">Tip: Type a plan, then hover and click the calendar icon to add it to Google, Apple, or Outlook Calendar.</div>
              </div>
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
