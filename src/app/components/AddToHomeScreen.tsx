import { useState, useEffect } from "react";
import { X, Share, Plus } from "lucide-react";

export function AddToHomeScreen() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Don't show if already installed (running in standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Don't show if dismissed recently (7 days)
    const dismissed = localStorage.getItem("a2hs-dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    // Don't show on desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios) {
      // iOS Safari — show custom instructions banner
      setTimeout(() => setShow(true), 3000);
    } else {
      // Android/Chrome — listen for native install prompt
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setTimeout(() => setShow(true), 3000);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("a2hs-dismissed", Date.now().toString());
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 p-4 max-w-sm mx-auto">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <p className="font-semibold text-gray-800 text-sm">Add to Home Screen</p>
          </div>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIOS ? (
          <div>
            <p className="text-xs text-gray-600 mb-3">
              Install Digital Dog Planner for quick access — works just like an app!
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-700 bg-amber-50 rounded-lg p-3">
              <span>Tap</span>
              <Share className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>then</span>
              <span className="font-semibold flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add to Home Screen
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 py-1"
            >
              Maybe later
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-600 mb-3">
              Install Digital Dog Planner for quick access — works just like an app!
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                Not now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
