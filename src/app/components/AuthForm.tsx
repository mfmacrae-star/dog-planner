import { useState } from "react";
import { supabase } from "../lib/supabase";
import { projectId, publicAnonKey } from "../../../utils/supabase/info.tsx";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  onAuthSuccess: (userId: string, email: string) => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/auth/signup`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to sign up");
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (signInData.session) onAuthSuccess(signInData.user.id, signInData.user.email || email);
    } catch (err: any) { setError(err.message || "An error occurred during sign up"); }
    finally { setLoading(false); }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (data.session) onAuthSuccess(data.user.id, data.user.email || email);
    } catch (err: any) { setError(err.message || "An error occurred during sign in"); }
    finally { setLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(""); setSuccessMessage("");
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      if (err) throw err;
      setSuccessMessage("Password reset email sent! Please check your inbox.");
      setTimeout(() => { setShowForgotPassword(false); setSuccessMessage(""); }, 3000);
    } catch (err: any) { setError(err.message || "An error occurred"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-800 mb-2">Dog Day Planner</h1>
          <p className="text-gray-600">{showForgotPassword ? "Reset your password" : isSignUp ? "Create your account" : "Welcome back! Sign in to continue"}</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{successMessage}</div>}
        {showForgotPassword ? (
          <>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 disabled:bg-gray-400">{loading ? "Sending..." : "Send Reset Link"}</button>
            </form>
            <div className="mt-4 text-center"><button onClick={() => { setShowForgotPassword(false); setError(""); }} className="text-gray-500 text-sm">Back to Sign In</button></div>
          </>
        ) : (
          <>
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
              {isSignUp && <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" required /></div>}
              <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" required /></div>
              <div className="mb-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" required minLength={6} />
                <button type="button" className="absolute top-0 right-0 h-full px-3 text-gray-500" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {!isSignUp && <div className="mb-6 text-right"><button type="button" onClick={() => { setShowForgotPassword(true); setError(""); }} className="text-sm text-amber-600">Forgot Password?</button></div>}
              {isSignUp && <div className="mb-6"></div>}
              <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 disabled:bg-gray-400">{loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}</button>
            </form>
            <div className="mt-6 text-center"><button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="text-amber-600 text-sm">{isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}</button></div>
          </>
        )}
      </div>
    </div>
  );
}
