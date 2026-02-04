'use client';

import { Scene } from '@/lib/scenes';

interface SidebarProps {
  scenes: Scene[];
  activeSceneId: string;
  onSceneChange: (sceneId: string) => void;
}

export default function Sidebar({ scenes, activeSceneId, onSceneChange }: SidebarProps) {
  return (
    <aside className="w-full md:w-80 bg-black bg-opacity-70 p-6 overflow-y-auto border-r-0 md:border-r-2 border-gold border-l-2 md:border-l-0">
      <h2 className="text-2xl text-gold text-center mb-6 pb-3 border-b border-gold border-opacity-30">
        مواقع الحديقة
      </h2>
      
      <div className="space-y-3">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border-r-4 ${
              activeSceneId === scene.id
                ? 'bg-[#2e8b57] bg-opacity-70 border-r-gold'
                : 'bg-[#2e8b57] bg-opacity-30 border-r-transparent'
            } hover:bg-[#2e8b57] hover:bg-opacity-50`}
            onClick={() => onSceneChange(scene.id)}
          >
            <div className="font-bold text-lg mb-2">{scene.title}</div>
            <div className="text-sm opacity-90">{scene.description}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}