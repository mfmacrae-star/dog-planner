interface TermsOfServiceProps {
  onClose: () => void;
}

export function TermsOfService({ onClose }: TermsOfServiceProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
        <h2 className="text-2xl font-serif text-gray-800 mb-4">Terms of Service</h2>
        <p className="text-gray-600 mb-4">By using the Digital Dog Day Planner & Calendar, you agree to these terms.</p>
        <p className="text-gray-600 mb-4">This application is provided for personal use. All content is copyright 2025 Digital Dog Day Planner & Calendar. All Rights Reserved.</p>
        <button onClick={onClose} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">Close</button>
      </div>
    </div>
  );
}
