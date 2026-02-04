'use client';

interface ErrorMessageProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function ErrorMessage({ message, show, onClose }: ErrorMessageProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-2xl max-w-lg w-full mx-auto text-center shadow-2xl border-2 border-gold">
        <div className="text-2xl mb-4 font-bold text-white">
          ⚠️ خطأ في تحميل الجولة
        </div>
        <div 
          className="mb-6 text-white bg-red-900 bg-opacity-30 p-4 rounded-lg" 
          dangerouslySetInnerHTML={{ __html: message }} 
        />
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition transform hover:scale-105"
          >
            إغلاق
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold text-red-800 px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition transform hover:scale-105"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    </div>
  );
}