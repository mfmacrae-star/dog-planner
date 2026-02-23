import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { breeds, monthNames } from "../data/breeds";
import { getQuoteForDate } from "../data/quotes";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarConnect } from "./CalendarConnect";
import { AskAI } from "./AskAI";
import { BreedImage } from "./BreedImage";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface MonthlyCalendarProps {
  userEmail: string;
}

export function MonthlyCalendar({ userEmail }: MonthlyCalendarProps) {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
  const [currentYear] = useState(currentDate.getFullYear());
  const [gratitude, setGratitude] = useState("");
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  const currentBreed = breeds.find((b) => b.month === currentMonth)!;
  const today = currentDate.getDate();
  const todayDate = new Date(currentYear, currentMonth - 1, today);
  const dailyQuote = getQuoteForDate(todayDate);

  useEffect(() => { loadGratitudeEntry(); }, [currentMonth, currentYear]);

  const loadGratitudeEntry = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/gratitude/${currentYear}/${currentMonth}/${today}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setGratitude(data.content || "");
      }
    } catch (error) { console.error("Error loading gratitude entry:", error); }
  };

  const handleGratitudeChange = async (value: string) => {
    setGratitude(value);
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/gratitude/entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ year: currentYear, month: currentMonth, day: today, content: value }),
      });
    } catch (error) { console.error("Error saving gratitude entry:", error); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentMonth(prev => prev === 1 ? 12 : prev - 1)} className="p-2 rounded-full hover:bg-white/50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-4xl font-serif text-gray-800">{monthNames[currentMonth - 1]} {currentYear}</h1>
          <button onClick={() => setCurrentMonth(prev => prev === 12 ? 1 : prev + 1)} className="p-2 rounded-full hover:bg-white/50 transition-colors">
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <BreedImage src={currentBreed.imageUrl} alt={currentBreed.name} breedName={currentBreed.name} />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-serif text-gray-800 mb-3">{currentBreed.name}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{currentBreed.history}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">Today I am grateful for:</label>
                <div className="mb-3 p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm italic text-gray-600">"{dailyQuote}"</p>
                </div>
                <textarea value={gratitude} onChange={(e) => handleGratitudeChange(e.target.value)} placeholder="Add your personal gratitude entry here..." className="w-full p-3 border border-amber-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" rows={3} />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <CalendarConnect userEmail={userEmail} onConnectionChange={setIsCalendarConnected} />
          </div>
          <CalendarGrid month={currentMonth} year={currentYear} weeklyImages={currentBreed.weeklyImages} userEmail={isCalendarConnected ? userEmail : undefined} />
        </div>
      </div>
      <AskAI currentBreed={currentBreed.name} currentMonth={monthNames[currentMonth - 1]} currentDate={todayDate.toLocaleDateString()} />
    </div>
  );
}
