// app/components/ReactPannellumViewer.tsx
'use client';

import { ReactPannellum } from 'react-pannellum';

interface ReactPannellumViewerProps {
  scenes: Array<{
    id: string;
    title: string;
    imageUrl: string;
    description: string;
  }>;
  activeSceneId: string;
}

export default function ReactPannellumViewer({ scenes, activeSceneId }: ReactPannellumViewerProps) {
  const config = {
    autoRotate: -2,
    compass: true,
    showZoomCtrl: true,
    showFullscreenCtrl: true,
  };

  const sceneConfig = scenes.reduce((acc, scene) => {
    acc[scene.id] = {
      panorama: scene.imageUrl,
      title: scene.title,
      haov: 360,
      vaov: 180,
      hotSpots: [],
    };
    return acc;
  }, {} as any);

  return (
    <ReactPannellum
      id="panorama"
      sceneId={activeSceneId}
      config={config}
      scenes={sceneConfig}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}