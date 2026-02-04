import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'جولة افتراضية - حديقة النخيل',
  description: 'جولة افتراضية 360 درجة تفاعلية في حديقة النخيل',
  keywords: ['جولة افتراضية', 'حديقة', 'النخيل', 'بانوراما', '360 درجة', 'تفاعلية'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        {/* إضافة Pannellum CSS */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" 
        />
      </head>
      <body className="min-h-screen bg-[#0a2919] text-white overflow-x-hidden">
        {children}
        
        {/* إضافة Pannellum JS ديناميكياً من خلال المكون */}
      </body>
    </html>
  );
}