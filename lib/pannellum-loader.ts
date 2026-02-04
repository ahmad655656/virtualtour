// حل مشكلة استيراد Pannellum في Next.js
let pannellum: any = null;

export const loadPannellum = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (pannellum) {
    return pannellum;
  }

  try {
    // تحميل Pannellum مباشرة من CDN
    if (!(window as any).pannellum) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.async = true;
        script.onload = () => {
          pannellum = (window as any).pannellum;
          resolve(true);
        };
        script.onerror = (error) => {
          reject(new Error(`Failed to load Pannellum: ${error}`));
        };
        document.head.appendChild(script);
      });
    } else {
      pannellum = (window as any).pannellum;
    }

    // تحميل CSS إذا لم يكن محملاً
    if (!document.querySelector('link[href*="pannellum.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }

    return pannellum;
  } catch (error) {
    console.error('Failed to load Pannellum:', error);
    throw error;
  }
};

export const isPannellumLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).pannellum;
};