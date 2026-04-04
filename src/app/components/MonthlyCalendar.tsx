/*
 * Digital Dog Day Planner & Calendar
 * Copyright (c) 2025. All Rights Reserved.
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { breeds, monthNames } from "../data/breeds";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarConnect } from "./CalendarConnect";
import { AskAI } from "./AskAI";
import { BreedImage } from "./BreedImage";
import { FeedbackButton } from "./FeedbackButton";
import { WelcomeModal } from "./WelcomeModal";

interface MonthlyCalendarProps {
  userEmail: string;
}

export function MonthlyCalendar({ userEmail }: MonthlyCalendarProps) {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
  const [currentYear] = useState(currentDate.getFullYear());
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  const currentBreed = breeds.find((b) => b.month === currentMonth)!;

  const pawSvg = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><ellipse cx='40' cy='56' rx='13' ry='10' fill='%231d4ed8'/><ellipse cx='20' cy='39' rx='6' ry='8' fill='%231d4ed8' transform='rotate(-20 20 39)'/><ellipse cx='32' cy='31' rx='6' ry='8' fill='%231d4ed8' transform='rotate(-7 32 31)'/><ellipse cx='48' cy='31' rx='6' ry='8' fill='%231d4ed8' transform='rotate(7 48 31)'/><ellipse cx='60' cy='39' rx='6' ry='8' fill='%231d4ed8' transform='rotate(20 60 39)'/></svg>")`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: pawSvg, backgroundRepeat: 'repeat', backgroundSize: '80px 80px', opacity: 0.25 }}
      />
      <div className="relative max-w-7xl mx-auto">
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
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <CalendarConnect userEmail={userEmail} onConnectionChange={setIsCalendarConnected} />
          </div>
          <CalendarGrid month={currentMonth} year={currentYear} weeklyImages={currentBreed.weeklyImages} userEmail={userEmail} />
        </div>
      </div>
      <AskAI currentBreed={currentBreed.name} currentMonth={monthNames[currentMonth - 1]} currentDate={new Date().toLocaleDateString()} userEmail={userEmail} />
      <FeedbackButton userEmail={userEmail} />
      <WelcomeModal userEmail={userEmail} />
    </div>
  );
}
