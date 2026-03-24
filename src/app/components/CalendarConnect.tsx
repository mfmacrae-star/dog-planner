import { useState, useEffect } from "react";
import { Calendar, Link, Unlink, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface CalendarConnectProps {
  userEmail: string;
  onConnectionChange?: (connected: boolean) => void;
}

export function CalendarConnect({ userEmail, onConnectionChange }: CalendarConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProviderSelect, setShowProviderSelect] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => { if (userEmail) checkConnectionStatus(); else setIsLoading(false); }, [userEmail]);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => { if (event.data.type === "calendar-connected") checkConnectionStatus(); };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch(`/api/google-status?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) { const data = await response.json(); setIsConnected(data.connected); setProvider(data.provider || null); onConnectionChange?.(data.connected); }
    } catch (error) { console.error("Error checking calendar status:", error); }
    finally { setIsLoading(false); }
  };

  const handleProviderConfirm = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch(`/api/google-auth-init`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      if (response.ok) {
        const data = await response.json();
        const width = 600, height = 700, left = (window.screen.width - width) / 2, top = (window.screen.height - height) / 2;
        window.open(data.authUrl, "Calendar Authentication", `width=${width},height=${height},left=${left},top=${top},popup=yes`);
        setShowProviderSelect(false);
      } else { alert(`Failed to start authentication: ${await response.text()}`); }
    } catch (error) { alert("An error occurred while starting authentication."); }
    finally { setIsConnecting(false); }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your calendar?")) return;
    try {
      const response = await fetch(`/api/google-disconnect?email=${encodeURIComponent(userEmail)}`, { method: "DELETE" });
      if (response.ok) { setIsConnected(false); setProvider(null); onConnectionChange?.(false); }
    } catch (error) { alert("An error occurred while disconnecting."); }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/google-sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Sync complete! Added ${data.from_google} events from Google Calendar, ${data.to_google} events to Google Calendar.`);
      } else {
        alert("Sync failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred during sync.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) return <div className="bg-white rounded-lg p-4 shadow-sm"><div className="flex items-center gap-2 text-gray-500"><Calendar className="w-5 h-5 animate-pulse" /><span>Checking calendar connection...</span></div></div>;

  if (showProviderSelect) return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect Google Calendar</h3>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">🔐 Click below to securely connect your Google Calendar.</p>
      </div>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label><input type="email" value={userEmail} disabled className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600" /></div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleProviderConfirm} disabled={isConnecting} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">{isConnecting ? "Opening Google..." : "Connect with Google"}</button>
          <button onClick={() => setShowProviderSelect(false)} disabled={isConnecting} className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {isConnected ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div><p className="font-medium text-gray-900">Calendar Connected</p><p className="text-sm text-gray-500">{provider === "google" ? "Google Calendar" : "External Calendar"}</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
            <button onClick={handleDisconnect} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Unlink className="w-4 h-4" />Disconnect</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div><p className="font-medium text-gray-900">Connect Your Calendar</p><p className="text-sm text-gray-500">Sync with Google Calendar</p></div>
          </div>
          <button onClick={() => setShowProviderSelect(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Link className="w-4 h-4" />Connect Calendar</button>
        </div>
      )}
    </div>
  );
}
