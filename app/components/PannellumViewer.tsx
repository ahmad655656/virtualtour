'use client';

import { useEffect, useRef, useState } from 'react';
import { loadPannellum } from '@/lib/pannellum-loader';
import { Scene } from '@/lib/scenes';

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

  // تحويل المشاهد إلى تنسيق Pannellum
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
          URL: hotspot.url,
          cssClass: hotspot.type === 'info' ? 'custom-info-hotspot' : 'custom-scene-hotspot'
        })) || [],
        autoLoad: true
      };
    });

    return pannellumScenes;
  };

  // تهيئة العارض
  useEffect(() => {
    let isMounted = true;
    let viewerInstance: any = null;

    const initializeViewer = async () => {
      try {
        if (!containerRef.current || !isMounted) return;

        // تحميل مكتبة Pannellum
        const pannellum = await loadPannellum();
        
        if (!pannellum || !pannellum.viewer) {
          throw new Error('فشل تحميل مكتبة Pannellum');
        }

        // تنظيف العارض السابق إذا كان موجوداً
        if (viewerRef.current) {
          try {
            viewerRef.current.destroy();
          } catch (e) {
            console.warn('Error destroying previous viewer:', e);
          }
        }

        // إنشاء العارض
        viewerInstance = pannellum.viewer(containerRef.current, {
          default: {
            firstScene: activeSceneId,
            autoLoad: true,
            autoRotate: -2,
            sceneFadeDuration: 1000,
            compass: true,
            mouseZoom: true,
            showFullscreenCtrl: true,
            showZoomCtrl: true,
            showControls: true,
          },
          scenes: getPannellumScenes()
        });

        // إضافة مستمعات الأحداث
        viewerInstance.on('scenechange', (newSceneId: string) => {
          onSceneChange?.(newSceneId);
        });

        viewerInstance.on('hotspotclick', (hotspot: any) => {
          onHotspotClick?.(hotspot);
        });

        viewerInstance.on('load', () => {
          setIsInitialized(true);
          onLoad?.();
        });

        viewerInstance.on('error', (err: any) => {
          console.error('Pannellum error:', err);
          setError('حدث خطأ في تحميل المشهد البانورامي');
          onError?.(err);
        });

        viewerRef.current = viewerInstance;

      } catch (err: any) {
        console.error('Failed to initialize Pannellum viewer:', err);
        setError(err.message || 'فشل تهيئة العارض البانورامي');
        onError?.(err);
      }
    };

    // بدء التهيئة
    const timer = setTimeout(() => {
      initializeViewer();
    }, 500);

    // تنظيف
    return () => {
      isMounted = false;
      clearTimeout(timer);
      
      if (viewerInstance) {
        try {
          viewerInstance.destroy();
        } catch (e) {
          console.warn('Error destroying viewer:', e);
        }
        viewerInstance = null;
      }
    };
  }, []); // تهيئة مرة واحدة فقط

  // تغيير المشهد عند تغيير activeSceneId
  useEffect(() => {
    if (viewerRef.current && activeSceneId && isInitialized) {
      try {
        viewerRef.current.loadScene(activeSceneId);
      } catch (err) {
        console.error('Failed to change scene:', err);
      }
    }
  }, [activeSceneId, isInitialized]);

  // إعادة تهيئة عند تغيير المشاهد
  useEffect(() => {
    if (viewerRef.current && isInitialized) {
      try {
        viewerRef.current.destroy();
        
        const timer = setTimeout(async () => {
          const pannellum = await loadPannellum();
          if (pannellum && containerRef.current) {
            viewerRef.current = pannellum.viewer(containerRef.current, {
              default: {
                firstScene: activeSceneId,
                autoLoad: true,
                autoRotate: -2,
                sceneFadeDuration: 1000,
                compass: true,
                mouseZoom: true,
                showFullscreenCtrl: true,
                showZoomCtrl: true,
                showControls: true,
              },
              scenes: getPannellumScenes()
            });
          }
        }, 100);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Failed to reinitialize viewer:', err);
      }
    }
  }, [scenes]); // إعادة التهيئة عند تغيير المشاهد

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a2919] bg-opacity-90 backdrop-blur-sm">
          <div className="text-center p-6 bg-gradient-to-br from-red-900/80 to-red-800/60 rounded-2xl border border-red-700/50 max-w-md">
            <div className="text-2xl text-white mb-4">⚠️ خطأ في تحميل العارض</div>
            <div className="text-gray-200 mb-6">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gold text-red-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}