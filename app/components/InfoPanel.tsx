'use client';

import { SceneInfo } from '@/lib/scenes';

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sceneInfo?: SceneInfo;
  sceneTitle: string;
}

export default function InfoPanel({ isOpen, onClose, sceneInfo, sceneTitle }: InfoPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset 0 z-50">
      {/* طبقة خلفية */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* اللوحة */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-b from-[#0a2919] via-[#0d351f] to-[#093316] border-r border-gold/30 shadow-2xl overflow-hidden">
        {/* الرأس */}
        <div className="p-6 border-b border-gold/20 bg-gradient-to-r from-black/40 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-gold">📚</span>
              معلومات الموقع
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center hover:bg-gold/30 transition"
            >
              <span className="text-gold text-xl">✕</span>
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-gold/10 to-transparent p-4 rounded-xl border border-gold/20">
            <h3 className="text-xl font-bold text-gold mb-2">{sceneTitle}</h3>
            <p className="text-gray-300">استكشف كل التفاصيل والمعلومات عن هذا الموقع</p>
          </div>
        </div>

        {/* المحتوى */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
          {sceneInfo ? (
            <div className="space-y-8">
              {/* التاريخ */}
              {sceneInfo.history && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                      <span className="text-gold">📜</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">التاريخ</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{sceneInfo.history}</p>
                </div>
              )}

              {/* المميزات */}
              {sceneInfo.features && sceneInfo.features.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                      <span className="text-gold">⭐</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">المميزات</h4>
                  </div>
                  <ul className="space-y-2">
                    {sceneInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-gold rounded-full mt-2"></span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* أفضل وقت للزيارة */}
              {sceneInfo.bestTime && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                      <span className="text-gold">⏰</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">أفضل وقت للزيارة</h4>
                  </div>
                  <p className="text-gray-300">{sceneInfo.bestTime}</p>
                </div>
              )}

              {/* نصائح */}
              {sceneInfo.tips && sceneInfo.tips.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                      <span className="text-gold">💡</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">نصائح للزوار</h4>
                  </div>
                  <ul className="space-y-2">
                    {sceneInfo.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 bg-black/30 p-3 rounded-lg">
                        <span className="text-gold">✓</span>
                        <span className="text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gold/20 rounded-full flex items-center justify-center">
                <span className="text-3xl text-gold">ℹ️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">لا توجد معلومات متاحة</h3>
              <p className="text-gray-400">المعلومات عن هذا الموقع غير متوفرة حالياً</p>
            </div>
          )}
        </div>

        {/* التذييل */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gold/20 bg-gradient-to-t from-black/40 to-transparent">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">حديقة النخيل الافتراضية</span>
            <span className="text-gold">جولة تفاعلية 360°</span>
          </div>
        </div>
      </div>
    </div>
  );
}