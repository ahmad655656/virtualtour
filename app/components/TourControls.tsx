'use client';

import { motion } from 'framer-motion';

interface TourControlsProps {
  onAudioToggle: () => void;
  onFullscreen: () => void;
  onInfoToggle: () => void;
  audioEnabled: boolean;
  infoEnabled: boolean;
  className?: string; // أضفنا هذا لدعمه من الصفحة الرئيسية
}

export default function TourControls({
  onAudioToggle,
  onFullscreen,
  onInfoToggle,
  audioEnabled,
  infoEnabled,
  className = ""
}: TourControlsProps) {
  
  const iconVariants = {
    active: { scale: 1.2, color: "#D4AF37", filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.8))" },
    inactive: { scale: 1, color: "#ffffff" }
  };

  const buttonClass = (isActive: boolean) => `
    relative w-14 h-14 rounded-2xl flex items-center justify-center 
    transition-all duration-500 group overflow-hidden
    ${isActive 
      ? 'bg-gold/20 border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
    } border backdrop-blur-xl
  `;

  return (
    <div className={`flex items-center gap-4 p-3 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/5 shadow-2xl ${className}`}>
      
      {/* زر المعلومات */}
      <motion.button
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onInfoToggle}
        className={buttonClass(infoEnabled)}
      >
        <span className={`text-xl transition-colors duration-300 ${infoEnabled ? 'text-gold' : 'text-white/70'}`}>
          {infoEnabled ? '✦' : '✧'}
        </span>
        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
        {infoEnabled && <div className="absolute inset-0 bg-gold/5 animate-pulse" />}
      </motion.button>

      {/* زر الصوت */}
      <motion.button
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAudioToggle}
        className={buttonClass(audioEnabled)}
      >
        <div className="relative">
          <span className={`text-xl ${audioEnabled ? 'text-gold' : 'text-white/70'}`}>
            {audioEnabled ? '🔊' : '🔈'}
          </span>
          {audioEnabled && (
            <motion.span 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-2 border border-gold/30 rounded-full"
            />
          )}
        </div>
      </motion.button>

      {/* فاصل أنيق */}
      <div className="w-[1px] h-8 bg-white/10 mx-1" />

      {/* زر ملء الشاشة */}
      <motion.button
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onFullscreen}
        className={buttonClass(false)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/70 group-hover:text-gold transition-colors">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      {/* زر VR المتقدم */}
      <motion.button
        whileHover={{ y: -5, width: "100px" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => alert('Coming Soon: تجربة الواقع الافتراضي الفاخرة')}
        className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-600/40 to-emerald-900/40 border border-emerald-400/30 flex items-center justify-center transition-all duration-500 group overflow-hidden"
      >
        <span className="text-xl z-10">🥽</span>
        <span className="absolute right-4 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">VR MODE</span>
        <div className="absolute inset-0 bg-emerald-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </motion.button>

    </div>
  );
}