'use client';

import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar.tsxSidebar';
import ErrorMessage from './components/ErrorMessage';
import TourControls from './components/TourControls';
import InfoPanel from './components/InfoPanel';
import { 
  createCompleteScenes, 
  sceneInfo,
  sceneAudio 
} from '@/lib/scenes';
import { PanoramaViewer } from '@/lib/panorama';

const scenes = createCompleteScenes();

export default function HomePage() {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PanoramaViewer | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState('entrance');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentHotspot, setCurrentHotspot] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // الحصول على المشهد الحالي
  const currentScene = scenes.find(scene => scene.id === currentSceneId);
  const currentSceneTitle = currentScene?.title || 'المدخل الرئيسي';
  const currentSceneInfo = sceneInfo[currentSceneId];

  // تحميل CSS ديناميكياً
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // إدارة الصوت
  useEffect(() => {
    if (!currentScene || !audioEnabled) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (sceneAudio[currentSceneId]) {
      audioRef.current = new Audio(sceneAudio[currentSceneId]);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentSceneId, audioEnabled]);

  // استماع للأحداث
  useEffect(() => {
    const handleSceneChange = (event: CustomEvent) => {
      setCurrentSceneId(event.detail.sceneId);
      setCurrentHotspot(null);
    };

    const handleHotspotClick = (event: CustomEvent) => {
      setCurrentHotspot(event.detail.text);
      if (event.detail.type === 'info') {
        setShowInfo(true);
      }
    };

    window.addEventListener('panorama-scenechange', handleSceneChange as EventListener);
    window.addEventListener('panorama-hotspotclick', handleHotspotClick as EventListener);

    return () => {
      window.removeEventListener('panorama-scenechange', handleSceneChange as EventListener);
      window.removeEventListener('panorama-hotspotclick', handleHotspotClick as EventListener);
    };
  }, []);

  // محاكاة تقدم التحميل
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  // تهيئة العارض
  useEffect(() => {
    let isMounted = true;

    const initViewer = async () => {
      try {
        if (!isMounted || !panoramaRef.current) return;

        setIsLoading(true);
        
        // إنشاء العارض
        viewerRef.current = new PanoramaViewer('panorama-container', scenes);
        
        // انتظار تهيئة العارض
        setTimeout(() => {
          if (isMounted) {
            setProgress(100);
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }
        }, 800);

      } catch (err: any) {
        console.error('فشل تحميل العارض:', err);
        if (isMounted) {
          setError(`
            <div class="space-y-4">
              <div class="text-2xl font-bold text-white">⚠️ تعذر تحميل الجولة الافتراضية</div>
              <div class="text-red-200">${err.message || 'حدث خطأ غير معروف'}</div>
              <div class="bg-red-900/30 p-4 rounded-xl border border-red-700/50">
                <h4 class="font-bold mb-2 text-gold">تأكد من:</h4>
                <ul class="space-y-2 text-right">
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-gold rounded-full"></span>
                    اتصال الإنترنت يعمل بشكل صحيح
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-gold rounded-full"></span>
                    المتصفح يدعم WebGL (جرب Chrome أو Firefox)
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-gold rounded-full"></span>
                    تفعيل JavaScript في المتصفح
                  </li>
                </ul>
              </div>
            </div>
          `);
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      initViewer();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // دالة لتغيير المشهد
  const handleSceneChange = async (sceneId: string) => {
    if (viewerRef.current && sceneId !== currentSceneId) {
      try {
        await viewerRef.current.loadScene(sceneId);
        setCurrentSceneId(sceneId);
        setCurrentHotspot(null);
      } catch (err) {
        console.error('فشل تغيير المشهد:', err);
        setError('فشل في تغيير المشهد. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  // التحكم في الصوت
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  // الدخول في وضع ملء الشاشة
  const enterFullscreen = async () => {
    try {
      await viewerRef.current?.enterFullscreen();
    } catch (err) {
      console.error('فشل الدخول إلى وضع ملء الشاشة:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0a2919] via-[#0d351f] to-[#093316] overflow-hidden">
      <Header currentSceneTitle={currentSceneTitle} />
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        {/* تأثيرات خلفية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* منطقة عرض البانوراما */}
        <div className="flex-1 relative" dir="ltr">
          <div 
            ref={panoramaRef} 
            id="panorama-container" 
            className="w-full h-full rounded-none lg:rounded-r-3xl shadow-2xl border-2 border-gold/30"
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a2919]/95 to-[#0d351f]/95 backdrop-blur-sm">
              <div className="text-center max-w-md p-8 bg-gradient-to-br from-[#0a2919] to-[#0d351f] rounded-2xl shadow-2xl border border-gold/30">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl">🌿</div>
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-gold mb-4">جاري تحميل الجولة الافتراضية</div>
                <p className="text-gray-300 mb-6">نحضر لك تجربة غامرة في حديقة النخيل</p>
                
                {/* شريط التقدم */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>تحميل المشاهد التفاعلية...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-gold to-yellow-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>جاري تحميل النقاط الساخنة والمحتوى التفاعلي...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* معلومات النقطة الساخنة */}
          {currentHotspot && (
            <div className="absolute top-6 left-6 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md p-4 rounded-2xl border border-gold/30 shadow-2xl max-w-md animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold">📍</span>
                <h3 className="text-white font-bold">{currentHotspot}</h3>
              </div>
              <p className="text-gray-300 text-sm">انقر على أيقونة المعلومات لمزيد من التفاصيل</p>
            </div>
          )}
          
          {/* شارة تفاعلية */}
          <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600/80 to-purple-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-purple-300/30 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-white animate-pulse">✨</span>
              <span className="text-white text-sm font-medium">جولة تفاعلية</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
        
        {/* القائمة الجانبية */}
        <Sidebar 
          scenes={scenes} 
          activeSceneId={currentSceneId} 
          onSceneChange={handleSceneChange} 
        />
      </div>
      
      {/* لوحة التحكم */}
      <TourControls 
        onAudioToggle={toggleAudio}
        onFullscreen={enterFullscreen}
        onInfoToggle={() => setShowInfo(!showInfo)}
        audioEnabled={audioEnabled}
        infoEnabled={showInfo}
      />
      
      {/* لوحة المعلومات */}
      <InfoPanel 
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        sceneInfo={currentSceneInfo}
        sceneTitle={currentSceneTitle}
      />
      
      {/* رسالة الخطأ */}
      <ErrorMessage 
        message={error || ''} 
        show={!!error} 
        onClose={() => setError(null)}
      />
      
      {/* إرشادات الجوال */}
      <div className="lg:hidden bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md p-3 text-center border-t border-gold/30">
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="text-gold">👆</span>
            <span className="text-white">اسحب للتدوير</span>
          </span>
          <span className="h-4 w-px bg-gold/30"></span>
          <span className="flex items-center gap-1">
            <span className="text-gold">📍</span>
            <span className="text-white">انقر على النقاط</span>
          </span>
        </div>
      </div>
    </div>
  );
}