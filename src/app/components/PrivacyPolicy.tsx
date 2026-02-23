interface PrivacyPolicyProps {
  onClose: () => void;
}

export function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
        <h2 className="text-2xl font-serif text-gray-800 mb-4">Privacy Policy</h2>
        <p className="text-gray-600 mb-4">Your privacy is important to us. We collect only the information necessary to provide the service.</p>
        <p className="text-gray-600 mb-4">We use Supabase for authentication and data storage. Your data is encrypted and secure.</p>
        <button onClick={onClose} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">Close</button>
      </div>
    </div>
  );
}
