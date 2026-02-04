// حل مشكلة استيراد Pannellum في Next.js
let pannellum: any = null;

export const loadPannellum = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    return null; // لا تحميل على السيرفر
  }

  if (pannellum) {
    return pannellum;
  }

  try {
    // الطريقة 1: تحميل كـ script خارجي
    if (!(window as any).pannellum) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.onload = () => {
          pannellum = (window as any).pannellum;
          resolve(true);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    } else {
      pannellum = (window as any).pannellum;
    }

    return pannellum;
  } catch (error) {
    console.error('Failed to load Pannellum:', error);
    throw error;
  }
};

// دالة مساعدة للتحقق من تحميل المكتبة
export const isPannellumLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).pannellum;
};