// app/components/PannellumLoader.tsx
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface PannellumLoaderProps {
  onLoad: () => void;
  onError: () => void;
}

export default function PannellumLoader({ onLoad, onError }: PannellumLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        strategy="beforeInteractive"
        onLoad={() => {
          setIsLoaded(true);
          onLoad();
          console.log('Pannellum script loaded');
        }}
        onError={() => {
          console.error('Failed to load Pannellum script');
          onError();
        }}
      />
    </>
  );
}