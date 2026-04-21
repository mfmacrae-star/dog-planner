import { X, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { getQuoteForDate } from "../data/quotes";
import { projectId, publicAnonKey, supabase } from "../../../utils/supabase/info";

interface ExternalEvent {
  id: string;
  title: string;
  time: string;
}

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  month: number;
  year: number;
  photoUrl: string;
  plannerContent: string;
  onContentChange: (value: string) => void;
  externalEvents: ExternalEvent[];
  userEmail?: string;
  onSyncToGoogle: (entry: string) => void;
  onRefreshEvents?: () => void;
}

export function DayModal({
  isOpen,
  onClose,
  day,
  month,
  year,
  photoUrl,
  plannerContent,
  onContentChange,
  externalEvents,
  userEmail,
  onSyncToGoogle,
  onRefreshEvents,
}: DayModalProps) {
  const saveTimers = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});
  const statusTimers = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});
  const dirtyHours = useRef<Set<number>>(new Set());

  const [saveStatus, setSaveStatus] = useState<{
    [hour: number]: { ok: boolean; message: string };
  }>({});
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [syncingEntry, setSyncingEntry] = useState<string | null>(null);
  const [eventTime, setEventTime] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [hourlyPlans, setHourlyPlans] = useState<{ [key: number]: string }>({});

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateObj = new Date(year, month - 1, day);
  const dailyQuote = getQuoteForDate(dateObj);

  useEffect(() => {
    if (isOpen) {
      dirtyHours.current = new Set();
      loadGratitude();
      loadHourlyPlans();
    }
  }, [isOpen, day, month, year, userEmail]);

  useEffect(() => {
    if (openDropdown === null) return;

    const handler = (_e: MouseEvent) => setOpenDropdown(null);
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown]);

  const loadGratitude = async () => {
    if (!userEmail) return;

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/gratitude/${encodeURIComponent(
          userEmail
        )}/${year}/${month}/${day}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setGratitude(data.content || "");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadHourlyPlans = async () => {
    if (!userEmail) return;

    try {
      const { data, error } = await supabase
        .from("hourly_plans")
        .select("hour, plan")
        .eq("email", userEmail)
        .eq("year", year)
        .eq("month", month)
        .eq("day", day);

      if (error) {
        console.error("Error loading hourly plans:", error);
        return;
      }

      const plansObj: { [key: number]: string } = {};
      data?.forEach((item: any) => {
        plansObj[item.hour] = item.plan;
      });

      setHourlyPlans(plansObj);
    } catch (error) {
      console.error("Error loading hourly plans:", error);
    }
  };

  const handleGratitudeChange = async (value: string) => {
    setGratitude(value);

    if (!userEmail) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/gratitude/entry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: userEmail,
            year,
            month,
            day,
            content: value,
          }),
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleHourlyPlanChange = (hour: number, value: string) => {
    setHourlyPlans((prev) => ({ ...prev, [hour]: value }));
    dirtyHours.current.add(hour);

    if (saveTimers.current[hour]) clearTimeout(saveTimers.current[hour]);

    saveTimers.current[hour] = setTimeout(() => saveHourlyPlan(hour, value), 500);
  };

  const showSaveStatus = (hour: number, ok: boolean, message: string) => {
    setSaveStatus((prev) => ({ ...prev, [hour]: { ok, message } }));

    if (statusTimers.current[hour]) clearTimeout(statusTimers.current[hour]);

    statusTimers.current[hour] = setTimeout(() => {
      setSaveStatus((prev) => {
        const next = { ...prev };
        delete next[hour];
        return next;
      });
    }, 3000);
  };

  const syncHourToGoogle = async (hour: number, value: string) => {
    if (!userEmail || !value.trim()) return;

    const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/google/sync-entry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: userEmail,
            year,
            month,
            day,
            hour,
            title: value,
            time: `${h}:00 ${ampm}`,
          }),
        }
      );
    } catch (e) {
      console.error("[syncHourToGoogle] Error:", e);
    }
  };

  const saveHourlyPlan = async (hour: number, value: string) => {
    if (!userEmail) {
      showSaveStatus(hour, false, "Error: no user email");
      return;
    }

    try {
      if (!value.trim()) {
        const deleteResult = await supabase
          .from("hourly_plans")
          .delete()
          .eq("email", userEmail)
          .eq("year", year)
          .eq("month", month)
          .eq("day", day)
          .eq("hour", hour);

        if (deleteResult.error) {
          showSaveStatus(hour, false, `Error: ${deleteResult.error.message}`);
        } else {
          showSaveStatus(hour, true, "Cleared");
        }
      } else {
        await supabase
          .from("hourly_plans")
          .delete()
          .eq("email", userEmail)
          .eq("year", year)
          .eq("month", month)
          .eq("day", day)
          .eq("hour", hour);

        const insertResult = await supabase.from("hourly_plans").insert({
          email: userEmail,
          year,
          month,
          day,
          hour,
          plan: value,
          updated_at: new Date().toISOString(),
        });

        if (insertResult.error) {
          showSaveStatus(hour, false, `Error: ${insertResult.error.message}`);
        } else {
          await syncHourToGoogle(hour, value);
          showSaveStatus(hour, true, "Saved + synced");
        }
      }
    } catch (err: any) {
      showSaveStatus(hour, false, `Error: ${err?.message ?? "unknown"}`);
    }
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  const buildICSContent = (title: string, hour: number) => {
    const formatLocal = (y: number, mo: number, d: number, h: number) =>
      `${y}${pad(mo)}${pad(d)}T${pad(h)}0000`;

    const uid = `${Date.now()}@dog-planner.app`;
    const now = new Date();
    const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(
      now.getHours()
    )}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Digital Dog Day Planner & Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=America/New_York:${formatLocal(year, month, day, hour)}`,
      `DTEND;TZID=America/New_York:${formatLocal(year, month, day, hour + 1)}`,
      `SUMMARY:${title}`,
      "DESCRIPTION:Added from Digital Dog Day Planner & Calendar",
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\\r\\n");
  };

  const downloadICS = (hour: number, suffix: string) => {
    const plan = hourlyPlans[hour];
    if (!plan?.trim()) return;

    const blob = new Blob([buildICSContent(plan, hour)], {
      type: "text/calendar;charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${plan.replace(/[^a-z0-9]/gi, "_")}_${suffix}.ics`;

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

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      plan
    )}&dates=${startDt}/${endDt}&details=${encodeURIComponent(
      "Added from Digital Dog Day Planner & Calendar"
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleOutlookCalendar = (hour: number) => {
    const plan = hourlyPlans[hour];
    if (!plan?.trim()) return;

    const startDt = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:00:00`;
    const endDt = `${year}-${pad(month)}-${pad(day)}T${pad(hour + 1)}:00:00`;

    const url = `https://outlook.live.com/calendar/0/action/compose?subject=${encodeURIComponent(
      plan
    )}&startdt=${encodeURIComponent(startDt)}&enddt=${encodeURIComponent(
      endDt
    )}&body=${encodeURIComponent("Added from Digital Dog Day Planner & Calendar")}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDone = () => {
    const dirty = Array.from(dirtyHours.current).filter((h) => hourlyPlans[h]?.trim());

    if (dirty.length > 0) {
      Promise.all(dirty.map((h) => syncHourToGoogle(h, hourlyPlans[h]))).then(() =>
        onRefreshEvents?.()
      );
    }

    onClose();
  };

  if (!isOpen) return null;

  const timeSlots = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];

  const getTimeLabel = (hour: number) => {
    if (hour === 0) return "12:00 AM";

    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${displayHour}:00 ${ampm}`;
  };

  const getExternalEventsForHour = (hour: number) => {
    return externalEvents.filter((event) => {
      const match = event.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return false;

      let h = parseInt(match[1]);
      const ampm = match[3].toUpperCase();

      if (ampm === "PM" && h !== 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;

      return h === hour;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {dateObj.toLocaleDateString("en-US", { weekday: "long" })},{" "}
              {monthNames[month - 1]} {day}, {year}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Plan your day with hourly slots</p>
          </div>

          <button
            onClick={handleDone}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg" style={{ minHeight: "420px" }}>
              <img
                src={photoUrl}
                alt={`Dog of the day ${day}`}
                className="w-full h-full object-cover"
                style={{ minHeight: "420px" }}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🙏 Today I am grateful for:
                </label>

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
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm">Google Calendar</h3>
                  <div className="space-y-1.5">
                    {externalEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded px-3 py-2 border border-blue-200 flex items-baseline gap-3"
                      >
                        <span className="font-semibold text-blue-700 text-xs whitespace-nowrap">
                          {event.time}
                        </span>
                        <span className="text-gray-800 text-sm">{event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Plans for the Day</h3>

                <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {timeSlots.map((hour) => (
                      <div key={hour} className="flex hover:bg-gray-50 transition-colors group">
                        <div className="w-20 flex-shrink-0 px-3 py-2 text-xs font-medium text-gray-500 border-r border-gray-100">
                          {getTimeLabel(hour)}
                        </div>

                        <div className="flex-1 px-3 py-2 flex flex-col gap-1">
                          {getExternalEventsForHour(hour).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs bg-blue-50 border border-blue-200 rounded px-2 py-0.5 text-blue-700 truncate"
                            >
                              {event.title}
                            </div>
                          ))}

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={hourlyPlans[hour] || ""}
                              onChange={(e) => handleHourlyPlanChange(hour, e.target.value)}
                              placeholder=""
                              data-gramm="false"
                              data-gramm_editor="false"
                              data-enable-grammarly="false"
                              className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent border-none outline-none focus:ring-0"
                            />

                            {saveStatus[hour] && (
                              <span
                                className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                                  saveStatus[hour].ok
                                    ? "text-green-700 bg-green-100"
                                    : "text-red-700 bg-red-100"
                                }`}
                              >
                                {saveStatus[hour].message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500 italic mt-2">
                  Tip: Type a plan, then hover and click the calendar icon to add it to Google,
                  Apple, or Outlook Calendar.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={handleDone}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
