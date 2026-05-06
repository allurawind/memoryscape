"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const tracks = [
  { src: "/wiv - fly... - (320 Kbps).mp3", title: "fly..." },
  { src: "/dont leave me.mp3", title: "dont leave me" },
  { src: "/identity disturbance.mp3", title: "identity disturbance" },
];

interface AudioContextValue {
  isPlaying: boolean;
  currentTrackIndex: number;
  togglePlayback: () => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Start false — will be set true only if autoplay succeeds
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(1);
  // Prevent the track-change effect from firing on the very first render
  const isFirstMount = useRef(true);

  // Attempt autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  // When track index changes (after first mount), swap the source and play
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = tracks[currentTrackIndex].src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // isPlaying intentionally omitted — only react to track change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const handleTrackEnd = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const previousTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <AudioContext.Provider
      value={{ isPlaying, currentTrackIndex, togglePlayback, nextTrack, previousTrack, audioRef }}
    >
      {/* Single persistent audio element — never unmounts */}
      <audio
        ref={audioRef}
        src={tracks[currentTrackIndex].src}
        onEnded={handleTrackEnd}
        preload="auto"
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}
