'use client';

interface HeaderProps {
  currentSceneTitle: string;
}

export default function Header({ currentSceneTitle }: HeaderProps) {
  return (
    <header className="bg-[#0a2919] bg-opacity-95 h-16 flex justify-between items-center px-6 border-b-2 border-gold">
      <div className="text-xl md:text-2xl text-gold font-bold">
        🌿 جولة افتراضية في حديقة النخيل
      </div>
      <div className="text-lg md:text-xl" id="currentScene">
        {currentSceneTitle}
      </div>
    </header>
  );
}