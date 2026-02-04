'use client';

import { Scene } from '@/lib/scenes';
import { motion } from 'framer-motion';

interface SidebarProps {
  scenes: Scene[];
  activeSceneId: string;
  onSceneChange: (sceneId: string) => void;
}

export default function Sidebar({ scenes, activeSceneId, onSceneChange }: SidebarProps) {
  return (
    <aside className="w-full lg:w-[350px] xl:w-[400px] h-full flex flex-col bg-[#040d08]/40 backdrop-blur-2xl border-l border-white/5 shadow-2xl overflow-hidden">
      {/* عنوان القائمة الجانبية */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-gold text-xl">🗺️</span>
          <h2 className="text-xl font-bold tracking-tight text-white/90">خريطة المواقع</h2>
        </div>
        <p className="text-xs text-white/40 leading-relaxed uppercase tracking-[0.1em]">
          اختر وجهتك لاستكشاف تفاصيل الحديقة
        </p>
      </div>

      {/* قائمة المواقع */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        {scenes.map((scene, index) => {
          const isActive = activeSceneId === scene.id;

          return (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSceneChange(scene.id)}
              className={`relative group cursor-pointer rounded-[1.5rem] overflow-hidden transition-all duration-500 border ${
                isActive 
                  ? 'bg-gradient-to-br from-emerald-900/60 to-emerald-950/80 border-gold/40 shadow-xl shadow-black/40' 
                  : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] hover:border-white/10'
              }`}
            >
              {/* صورة مصغرة خلفية خفيفة */}
              <div 
                className={`absolute inset-0 opacity-10 grayscale transition-transform duration-700 group-hover:scale-110 ${isActive ? 'opacity-20 grayscale-0' : ''}`}
                style={{ 
                  backgroundImage: `url(${scene.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />

              <div className="relative p-5 flex items-center gap-4 z-10">
                {/* رقم الموقع أو أيقونة */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${
                  isActive 
                    ? 'bg-gold text-[#040d08] rotate-[10deg] shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                    : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-gold'
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h3 className={`font-bold text-base transition-colors duration-300 ${
                    isActive ? 'text-gold' : 'text-white/80 group-hover:text-white'
                  }`}>
                    {scene.title}
                  </h3>
                  <p className="text-xs text-white/40 line-clamp-1 mt-1 font-light group-hover:text-white/60">
                    {scene.description}
                  </p>
                </div>

                {/* مؤشر الحالة */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_#D4AF37]"
                  />
                )}
              </div>

              {/* تأثير التوهج عند التفعيل */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* تذييل القائمة الجانبية */}
      <div className="p-6 bg-black/20 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] text-white/30 tracking-widest uppercase">
          <span>Total Scenes: {scenes.length}</span>
          <span className="flex items-center gap-1 italic text-gold/60">
            <span className="w-1 h-1 rounded-full bg-gold animate-pulse"></span>
            Auto-Sync Ready
          </span>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.3);
        }
      `}</style>
    </aside>
  );
}