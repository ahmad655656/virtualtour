'use client';

import { motion } from 'framer-motion';

interface HeaderProps {
  currentSceneTitle: string;
}

export default function Header({ currentSceneTitle }: HeaderProps) {
  return (
    <header className="relative z-50 h-20 flex justify-between items-center px-8 bg-[#040d08]/80 backdrop-blur-md border-b border-white/5">
      {/* شعار الحديقة والاسم */}
      <div className="flex items-center gap-5">
        <div className="w-10 h-10 bg-gradient-to-br from-gold/20 to-emerald-900/40 rounded-xl border border-gold/30 flex items-center justify-center shadow-lg shadow-black/20">
          <span className="text-2xl">🌴</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-l from-gold via-yellow-200 to-gold bg-clip-text text-transparent leading-none">
            حديقة النخيل
          </h1>
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/60 font-medium">
            Virtual Experience
          </span>
        </div>
      </div>

      {/* اسم المشهد الحالي بتصميم انسيابي */}
      <div className="relative group hidden sm:block">
        <motion.div 
          key={currentSceneTitle}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10 shadow-inner"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#D4AF37]"></span>
          <span className="text-sm md:text-base font-light text-slate-200 tracking-wide">
            {currentSceneTitle}
          </span>
        </motion.div>
        
        {/* تأثير توهج سفلي للمشهد */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent blur-[1px]"></div>
      </div>

      {/* لمسة جمالية في الزاوية اليسرى (أزرار تفاعلية أو مجرد جمالية) */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex flex-col items-end text-[10px] text-white/30 tracking-tighter leading-tight border-r border-white/10 pr-4">
          <span>PROJECT REV 2.0</span>
          <span>FEBRUARY 2026</span>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/50 transition-all cursor-help">
          ?
        </div>
      </div>

      {/* خط الإضاءة الذهبي السفلي النحيف جداً */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
    </header>
  );
}