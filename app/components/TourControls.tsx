'use client';

interface TourControlsProps {
  onAudioToggle: () => void;
  onFullscreen: () => void;
  onInfoToggle: () => void;
  audioEnabled: boolean;
  infoEnabled: boolean;
}

export default function TourControls({
  onAudioToggle,
  onFullscreen,
  onInfoToggle,
  audioEnabled,
  infoEnabled
}: TourControlsProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      {/* معلومات */}
      <button
        onClick={onInfoToggle}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl ${
          infoEnabled
            ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400'
            : 'bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-gold/30 hover:border-gold/50'
        }`}
      >
        <span className={`text-2xl ${infoEnabled ? 'text-white' : 'text-gold'}`}>
          ℹ️
        </span>
      </button>

      {/* صوت */}
      <button
        onClick={onAudioToggle}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl ${
          audioEnabled
            ? 'bg-gradient-to-br from-green-600 to-green-800 border-2 border-green-400'
            : 'bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-gold/30 hover:border-gold/50'
        }`}
      >
        <span className={`text-2xl ${audioEnabled ? 'text-white' : 'text-gold'}`}>
          {audioEnabled ? '🔊' : '🔈'}
        </span>
      </button>

      {/* ملء الشاشة */}
      <button
        onClick={onFullscreen}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-gold/30 flex items-center justify-center hover:border-gold/50 hover:bg-gold/20 transition-all duration-300 transform hover:scale-110 shadow-2xl"
      >
        <span className="text-2xl text-gold">🔲</span>
      </button>

      {/* VR */}
      <button
        onClick={() => alert('وضع VR قيد التطوير')}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/80 to-purple-800/80 backdrop-blur-md border border-purple-300/30 flex items-center justify-center hover:border-purple-400 hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 shadow-2xl group"
      >
        <span className="text-2xl text-white group-hover:animate-pulse">🥽</span>
      </button>
    </div>
  );
}