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

interface MonthlyCalendarProps {
  userEmail: string;
}

export function MonthlyCalendar({ userEmail }: MonthlyCalendarProps) {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
  const [currentYear] = useState(currentDate.getFullYear());
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  const currentBreed = breeds.find((b) => b.month === currentMonth)!;

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
    </div>
  );
}
