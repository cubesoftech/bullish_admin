// components/SoundPlayer.tsx
import { useRef, useEffect } from "react";

interface SoundPlayerProps {
  playSound: boolean;
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({ playSound }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (playSound && audioRef.current) {
      audioRef.current.play();
    }
  }, [playSound]);

  return <audio ref={audioRef} src="/assets/sound.mp3" />;
};

export default SoundPlayer;
