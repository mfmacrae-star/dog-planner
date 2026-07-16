/*
 * Digital Dog Day Planner & Calendar
 * Copyright (c) 2026. All Rights Reserved.
 */

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { AuthForm } from "./components/AuthForm";
import { Calendar, BookOpen, LogOut, HelpCircle, Menu, X } from "lucide-react";
import { MonthlyCalendar } from "./components/MonthlyCalendar";
import { BreedBook } from "./components/BreedBook";
import { TermsOfService } from "./components/TermsOfService";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { QuickStartGuide } from "./components/QuickStartGuide";
import { AddToHomeScreen } from "./components/AddToHomeScreen";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "book">("calendar");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsPasswordReset(true);
          setLoading(false);
          return;
        }
        if (session) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || "");
          setLoading(false);
        } else {
          setIsAuthenticated(false);
          setUserEmail("");
          setLoading(false);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handlePasswordUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setResetMsg("Error: " + error.message);
    } else {
      setResetMsg("Password updated! Signing you in...");
      setTimeout(() => {
        setIsPasswordReset(false);
      }, 1500);
    }
  };

  const handleAuthSuccess = (userId: string, email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail("");
  };

  if (isPasswordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-serif text-gray-800 mb-2 text-center">Set New Password</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Enter your new password below</p>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={handlePasswordUpdate}
            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Update Password
          </button>
          {resetMsg && <p className="mt-4 text-center text-sm text-gray-600">{resetMsg}</p>}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col">
        <section className="max-w-3xl mx-auto px-6 pt-12 pb-4 text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h1 className="text-4xl font-serif text-gray-800 mb-4">Digital Dog Planner</h1>
          <p className="text-gray-600 mb-6">
            Digital Dog Planner is a day planner and calendar built for dog owners.
            Organize your dog's daily schedule — walks, meals, grooming, vet visits,
            and medications — in one place, and sync it with your Google Calendar so
            reminders follow you everywhere.
          </p>
          <ul className="text-gray-700 text-left inline-block list-disc list-inside mb-4">
            <li>Monthly calendar for walks, meals, grooming, and vet appointments</li>
            <li>Google Calendar sync for automatic reminders</li>
            <li>Breed Book with care information for popular dog breeds</li>
            <li>Printable daily and monthly schedules</li>
            <li>Works on desktop and mobile — add it to your home screen</li>
          </ul>
        </section>

        <AuthForm onAuthSuccess={handleAuthSuccess} />

        <footer className="bg-gray-50 border-t border-gray-200 py-4 mt-auto">
          <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
            <span>© 2026 Digital Dog Day Planner & Calendar. All Rights Reserved.</span>
            <span className="flex gap-4">
              <a href="/privacy-policy.html" className="underline hover:text-amber-600">Privacy Policy</a>
              <a href="/terms-of-service.html" className="underline hover:text-amber-600">Terms of Service</a>
            </span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col">
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-2xl font-serif text-gray-800 truncate pr-2">
              Digital Dog Day Planner
            </h1>
            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setView("calendar")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    view === "calendar"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  Calendar
                </button>
                <button
                  onClick={() => setView("book")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    view === "book"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Breed Book
                </button>
              </div>
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-amber-600 transition-colors"
                title="Quick Start Guide"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm">Help</span>
              </button>
              <span className="text-sm text-gray-500 hidden md:inline truncate max-w-[160px]">{userEmail}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-2 pb-3 border-t border-gray-100 pt-3 flex flex-col gap-2">
              <button
                onClick={() => { setView("calendar"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full ${
                  view === "calendar" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                <Calendar className="w-5 h-5" /> Calendar
              </button>
              <button
                onClick={() => { setView("book"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full ${
                  view === "book" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                <BookOpen className="w-5 h-5" /> Breed Book
              </button>
              <button
                onClick={() => { setShowGuide(true); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
              >
                <HelpCircle className="w-5 h-5" /> Help
              </button>
              <p className="text-xs text-gray-400 px-4 truncate">{userEmail}</p>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-20 print:pt-0 flex-1">
        {view === "calendar" ? (
          <MonthlyCalendar userEmail={userEmail} />
        ) : (
          <BreedBook />
        )}
      </div>

      <footer className="no-print bg-gray-50 border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              © 2026 Digital Dog Day Planner & Calendar. All Rights Reserved.
            </div>
            <div className="flex gap-4 text-sm">
              <button onClick={() => setShowTerms(true)} className="text-gray-600 hover:text-amber-600 transition-colors underline">
                Terms of Service
              </button>
              <button onClick={() => setShowPrivacy(true)} className="text-gray-600 hover:text-amber-600 transition-colors underline">
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showGuide && <QuickStartGuide onClose={() => setShowGuide(false)} />}
      <AddToHomeScreen />

    </div>
  );
}
// Force rebuild 1774375579