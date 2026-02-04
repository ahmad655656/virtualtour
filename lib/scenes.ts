// روابط صور بديلة مجانية للاستخدام
export const fallbackImages = {
  entrance: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/2016-05-26_122834_Wunstorfer_Moor.jpg/1280px-2016-05-26_122834_Wunstorfer_Moor.jpg',
  fountain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/2015-08-06_09-50-50_915.0_Switzerland_Kanton_Appenzell_Innerrhoden_Appenzell_Meistersr%C3%BCte_Gais_5h_360%C2%B0_aerial.JPG/2560px-2015-08-06_09-50-50_915.0_Switzerland_Kanton_Appenzell_Innerrhoden_Appenzell_Meistersr%C3%BCte_Gais_5h_360%C2%B0_aerial.jpg',
  rest: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/%22Pensar_es_un_hecho_revolucionario%22_una_obra_de_Marie_Orensanz.jpg/1280px-%22Pensar_es_un_hecho_revolucionario%22_una_obra_de_Marie_Orensanz.jpg',
  playground: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/%22Pensar_es_un_hecho_revolucionario%22_Parque_de_la_memoria.jpg/1280px-%22Pensar_es_un_hecho_revolucionario%22_Parque_de_la_memoria.jpg',
};

// تعريف واجهات البيانات
export interface Scene {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  hotSpots?: HotSpot[];
  audioUrl?: string;
  info?: SceneInfo;
}

export interface HotSpot {
  pitch: number;
  yaw: number;
  type: 'scene' | 'info' | 'video' | 'image';
  text: string;
  sceneId?: string;
  url?: string;
  content?: string;
}

export interface SceneInfo {
  history?: string;
  features?: string[];
  bestTime?: string;
  tips?: string[];
}

// Hotspots تفاعلية لكل مشهد
export const sceneHotspots: Record<string, HotSpot[]> = {
  entrance: [
    {
      pitch: -10,
      yaw: 30,
      type: 'info',
      text: 'معلومات المدخل',
      content: 'المدخل الرئيسي للحديقة، تم إنشاؤه عام 1985 ويضم 50 نخلة من أندر الأنواع.'
    },
    {
      pitch: 5,
      yaw: 120,
      type: 'scene',
      text: 'اذهب إلى النافورة',
      sceneId: 'fountain'
    },
    {
      pitch: -15,
      yaw: 200,
      type: 'scene',
      text: 'اذهب إلى حديقة الزهور',
      sceneId: 'flower'
    }
  ],
  
  fountain: [
    {
      pitch: 10,
      yaw: 0,
      type: 'info',
      text: 'النافورة المركزية',
      content: 'نافورة مائية بقطر 15 متر، تعمل بأنظمة توفير الطاقة وتضيء ليلاً بألوان متعددة.'
    },
    {
      pitch: -5,
      yaw: 270,
      type: 'scene',
      text: 'اذهب إلى المدخل',
      sceneId: 'entrance'
    },
    {
      pitch: 15,
      yaw: 90,
      type: 'scene',
      text: 'اذهب إلى الملعب',
      sceneId: 'playground'
    }
  ],
  rest: [
    {
      pitch: -10,
      yaw: 45,
      type: 'info',
      text: 'منطقة الاستراحة',
      content: 'مجهزة بـ 50 مقعداً مظللاً، مع نقاط شحن وخدمة الواي فاي المجانية.'
    },
    {
      pitch: 0,
      yaw: 135,
      type: 'scene',
      text: 'اذهب إلى حديقة الزهور',
      sceneId: 'flower'
    }
  ],
  playground: [
    {
      pitch: 5,
      yaw: 180,
      type: 'info',
      text: 'ملعب الأطفال',
      content: 'ملعب آمن للأطفال من عمر 3-12 سنة، مجهز بألعاب معتمدة عالمياً.'
    },
    {
      pitch: -15,
      yaw: 315,
      type: 'scene',
      text: 'اذهب إلى النافورة',
      sceneId: 'fountain'
    }
  ]
};

// معلومات إضافية لكل مشهد
export const sceneInfo: Record<string, SceneInfo> = {
  entrance: {
    history: 'أقيم عام 1985 بمناسبة الاحتفال باليوم الوطني',
    features: ['50 نخلة نادرة', 'نظام ري متطور', 'إضاءة LED موفرة للطاقة'],
    bestTime: 'الصباح الباكر أو قبل المغيب',
    tips: ['احتفظ بتذكرتك', 'التقط صوراً بجانب النخيل العملاق']
  },
 
  fountain: {
    history: 'صممها المهندس الإيطالي ماركو بولي',
    features: ['عرض ضوئي مسائي', 'موسيقى مصاحبة', 'نظام توفير مياه'],
    bestTime: 'المساء بعد الساعة 7',
    tips: ['احضر كاميرا لالتقاط العروض الضوئية', 'جرب التصوير بانورامياً']
  },
  rest: {
    features: ['50 مقعداً مظللاً', 'واي فاي مجاني', 'نقاط شحن', 'مقاهي صغيرة'],
    bestTime: 'أوقات الظهيرة',
    tips: ['احجز مقعدك مبكراً', 'استفد من الواي فاي المجاني']
  },
  playground: {
    features: ['ألعاب لجميع الأعمار', 'أرضيات آمنة', 'مشرفين متواجدين'],
    bestTime: 'الصباح أو بعد العصر',
    tips: ['راقب أطفالك', 'استخدم المعدات بحذر']
  }
};

// روابط صوتية خلفية (اختيارية)
export const sceneAudio: Record<string, string> = {
  entrance: 'https://assets.mixkit.co/music/preview/mixkit-garden-sounds-1296.mp3',
  fountain: 'https://assets.mixkit.co/sfx/preview/mixkit-waterfall-nature-loop-1195.mp3',
  rest: 'https://assets.mixkit.co/music/preview/mixkit-relaxing-guitar-melody-2327.mp3',
  playground: 'https://assets.mixkit.co/sfx/preview/mixkit-children-playing-happily-2498.mp3'
};

// إنشاء المشاهد الكاملة
export const createCompleteScenes = () => {
  const sceneIds = ['entrance', 'fountain', 'rest', 'playground'];
  
  return sceneIds.map(id => ({
    id,
    title: getSceneTitle(id),
    description: getSceneDescription(id),
    imageUrl: fallbackImages[id as keyof typeof fallbackImages],
    hotSpots: sceneHotspots[id] || [],
    audioUrl: sceneAudio[id],
    info: sceneInfo[id]
  }));
};

// دوال مساعدة
const getSceneTitle = (id: string): string => {
  const titles: Record<string, string> = {
    entrance: 'المدخل الرئيسي',
    fountain: 'النافورة المركزية',
    rest: 'منطقة الاستراحة',
    playground: 'ملعب الأطفال'
  };
  return titles[id] || id;
};

const getSceneDescription = (id: string): string => {
  const descriptions: Record<string, string> = {
    entrance: 'بوابة الحديقة مع أشجار النخيل النادرة',
    fountain: 'نافورة مائية في وسط الحديقة بعروض ضوئية',
    rest: 'مقاعد مظللة للراحة والاسترخاء مع خدمات متكاملة',
    playground: 'منطقة ألعاب آمنة وممتعة للأطفال'
  };
  return descriptions[id] || '';
};