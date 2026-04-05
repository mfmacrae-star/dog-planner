/*
 * Digital Dog Day Planner & Calendar
 * Copyright (c) 2025. All Rights Reserved.
 */

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { AuthForm } from "./components/AuthForm";
import { Calendar, BookOpen, LogOut } from "lucide-react";
import { MonthlyCalendar } from "./components/MonthlyCalendar";
import { BreedBook } from "./components/BreedBook";
import { TermsOfService } from "./components/TermsOfService";
import { PrivacyPolicy } from "./components/PrivacyPolicy";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "book">("calendar");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
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
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="size-full flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif text-gray-800">
              Dog Day Planner & Calendar
            </h1>
            <div className="flex items-center gap-4">
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
              <span className="text-sm text-gray-600">{userEmail}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 flex-1">
        {view === "calendar" ? (
          <MonthlyCalendar userEmail={userEmail} />
        ) : (
          <BreedBook />
        )}
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              © 2025 Digital Dog Day Planner & Calendar. All Rights Reserved.
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

      {/* Feedback Button */}
      <a
        href="https://forms.gle/pvtrv7Ct2mbGpTNw5"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#b45309',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '20px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 9999,
        }}
      >
        💬 Feedback
      </a>
    </div>
  );
}
// Force rebuild 1774375579