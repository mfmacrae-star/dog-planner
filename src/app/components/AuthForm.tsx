import { useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthFormProps {
  onAuthSuccess: (userId: string, email: string) => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) setError(error.message);
      else setMessage("Check your email for a password reset link.");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else if (data.user) {
        if (data.user.identities?.length === 0) {
          setError("An account with this email already exists.");
        } else {
          setMessage("Account created! Check your email to confirm, then sign in.");
          setMode("signin");
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else if (data.user) {
        onAuthSuccess(data.user.id, data.user.email || "");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐾</div>
          <h1 className="text-3xl font-serif text-gray-800 mb-1">Dog Day Planner</h1>
          <p className="text-gray-500 text-sm">Your daily companion for paw-some planning</p>
        </div>

        {/* Mode tabs */}
        {mode !== "reset" && (
          <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
            <button
              onClick={() => { setMode("signin"); setError(""); setMessage(""); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "signin" ? "bg-amber-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "signup" ? "bg-amber-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {mode === "reset" && (
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Reset Password</h2>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
            />
          </div>

          {mode !== "reset" && (
          
 <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      placeholder="••••••••"
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 pr-10"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? "🙈" : "👁️"}
    </button>
  </div>
</div>









          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2.5">
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
          {mode !== "reset" && (
            <button
              onClick={() => { setMode("reset"); setError(""); setMessage(""); }}
              className="text-amber-600 hover:underline block w-full"
            >
              Forgot your password?
            </button>
          )}
          {mode === "reset" && (
            <button
              onClick={() => { setMode("signin"); setError(""); setMessage(""); }}
              className="text-amber-600 hover:underline"
            >
              ← Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
