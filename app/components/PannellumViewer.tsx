'use client';

import { useEffect, useRef, useState } from 'react';
import { loadPannellum } from '@/lib/pannellum-loader';
import { Scene } from '@/lib/scenes';
import { motion, AnimatePresence } from 'framer-motion';

interface PannellumViewerProps {
  scenes: Scene[];
  activeSceneId: string;
  onSceneChange?: (sceneId: string) => void;
  onHotspotClick?: (hotspot: any) => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
  className?: string;
}

export default function PannellumViewer({
  scenes,
  activeSceneId,
  onSceneChange,
  onHotspotClick,
  onLoad,
  onError,
  className = ''
}: PannellumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);

  // تحويل المشاهد بتنسيق مخصص
  const getPannellumScenes = () => {
    const pannellumScenes: any = {};
    scenes.forEach(scene => {
      pannellumScenes[scene.id] = {
        title: scene.title,
        panorama: scene.imageUrl,
        hotSpots: scene.hotSpots?.map(hotspot => ({
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          type: hotspot.type === 'scene' ? 'scene' : 'info',
          text: hotspot.text,
          sceneId: hotspot.sceneId,
          cssClass: hotspot.type === 'info' ? 'luxury-info-hotspot' : 'luxury-scene-hotspot'
        })) || [],
        autoLoad: true
      };
    });
    return pannellumScenes;
  };

  useEffect(() => {
    let isMounted = true;
    const initializeViewer = async () => {
      try {
        if (!containerRef.current || !isMounted) return;
        const pannellum = await loadPannellum();
        if (viewerRef.current) viewerRef.current.destroy();

        viewerRef.current = pannellum.viewer(containerRef.current, {
          default: {
            firstScene: activeSceneId,
            autoLoad: true,
            autoRotate: -1.0,
            sceneFadeDuration: 1200,
            compass: false,
            mouseZoom: true,
            showControls: false, // إخفاء أزرار Pannellum الافتراضية تماماً
            dragToThrow: true,
          },
          scenes: getPannellumScenes()
        });

        viewerRef.current.on('scenechange', (id: string) => onSceneChange?.(id));
        viewerRef.current.on('load', () => { setIsInitialized(true); onLoad?.(); });
        viewerRef.current.on('error', (err: any) => setError(err.message));
      } catch (err: any) { setError(err.message); }
    };
    initializeViewer();
    return () => { if (viewerRef.current) viewerRef.current.destroy(); };
  }, []);

  // وظائف التحكم اليدوية
  const handleZoom = (delta: number) => {
    if (!viewerRef.current) return;
    const currentZoom = viewerRef.current.getHfov();
    viewerRef.current.setHfov(currentZoom + delta);
  };

  return (
    <div className={`relative w-full h-full group overflow-hidden bg-[#040d08] ${className}`}>
      {/* الطبقة الجمالية العلوية */}
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      {/* حاوية Pannellum */}
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: '500px' }} />

      {/* زر القائمة العائم (Magic Button) */}
      <div className="absolute bottom-8 right-8 z-30 flex flex-col-reverse items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowControls(!showControls)}
          className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl transition-colors duration-500 ${
            showControls ? 'bg-gold text-black' : 'bg-black/40 text-gold'
          }`}
        >
          {showControls ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="LengthM4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </motion.button>

        {/* أزرار التحكم المخفية */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="flex flex-col gap-3 p-3 rounded-3xl bg-black/30 backdrop-blur-2xl border border-white/10"
            >
              {[
                { icon: '➕', label: 'Zoom In', onClick: () => handleZoom(-10) },
                { icon: '➖', label: 'Zoom Out', onClick: () => handleZoom(10) },
                { icon: '🔄', label: 'Reset', onClick: () => viewerRef.current.setHfov(100) },
                { icon: '📷', label: 'Capture', onClick: () => {} },
              ].map((btn, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={btn.onClick}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 hover:bg-gold hover:text-black text-white transition-all border border-white/5 hover:border-gold shadow-lg"
                  title={btn.label}
                >
                  <span className="text-xl">{btn.icon}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* مؤشر التنقل (بسيط وأنيق في الزاوية) */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[10px] text-white/70 uppercase tracking-[0.2em] font-medium">360° Vision Active</span>
        </div>
      </div>

      {/* رسالة الخطأ المصممة */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#040d08]/90 backdrop-blur-xl"
          >
            <div className="text-center p-8 bg-white/5 border border-red-500/20 rounded-[2.5rem] shadow-2xl max-w-sm">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-white font-bold text-xl mb-2">عذراً، تعذر التحميل</h3>
              <p className="text-white/40 text-sm mb-6">{error}</p>
              <button onClick={() => window.location.reload()} className="px-8 py-3 bg-gold text-black rounded-full font-bold">تحديث</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}