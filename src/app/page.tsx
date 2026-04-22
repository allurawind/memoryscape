"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const buildings = [
  { src: "/house cpu-Photoroom.png", alt: "House CPU", className: "left-[7%] top-[18%] w-48 z-40" },
  { src: "/ecole building-Photoroom.png", alt: "Ecole Building", className: "left-[29%] top-[10%] w-44 z-30" },
  { src: "/school gemini-Photoroom.png", alt: "School Gemini", className: "left-[49%] top-[21%] w-44 z-30" },
  { src: "/maths teacher-Photoroom.png", alt: "Maths Teacher", className: "left-[70%] top-[12%] w-44 z-20" },
  { src: "/grocery store-Photoroom.png", alt: "Grocery Store", className: "left-[19%] top-[51%] w-44 z-20" },
  { src: "/stray dogs-Photoroom.png", alt: "Stray Dogs", className: "left-[43%] top-[45%] w-48 z-40" },
  { src: "/supportive friend-Photoroom.png", alt: "Supportive Friend", className: "left-[64%] top-[50%] w-44 z-20" },
  { src: "/dyslexia struggle-Photoroom.png", alt: "Dyslexia Struggle", className: "left-[35%] top-[68%] w-48 z-10" },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayback = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }
    await videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0f] text-white">
      <nav className="absolute inset-x-0 top-0 z-50 flex items-start justify-between p-8">
        <div className="space-y-2">
          <p className="text-sm tracking-[0.24em] text-zinc-100">SHRAVANI&apos;S_WORLD.EXE</p>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
            <span>you&apos;re here</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="12" height="12" stroke="currentColor" />
              <rect x="4" y="5" width="1" height="1" fill="currentColor" />
              <rect x="9" y="5" width="1" height="1" fill="currentColor" />
              <rect x="4" y="9" width="6" height="1" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-7 text-xs tracking-[0.22em] text-zinc-300">
          <a href="#" className="transition-colors hover:text-white">ABOUT_</a>
          <a href="#" className="transition-colors hover:text-white">DOC_</a>
          <a href="#" className="transition-colors hover:text-white">CONTACT ME_</a>
        </div>
      </nav>

      <section className="mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center px-8 py-24">
        <div className="relative h-[70vh] w-full">
          {buildings.map((building, index) => (
            <motion.div
              key={building.src}
              className={`absolute ${building.className}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -7, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: index * 0.08 },
                y: { duration: 5 + (index % 3), repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: index * 0.18 },
              }}
              whileHover={{ scale: 1.08 }}
            >
              <Image
                src={building.src}
                alt={building.alt}
                width={400}
                height={400}
                className="h-auto w-full select-none object-contain drop-shadow-[0_0_28px_rgba(120,120,255,0.16)]"
                priority={index < 4}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <aside className="absolute bottom-6 left-6 z-50">
        <div className="border border-zinc-800 p-2 w-24 h-24 bg-transparent">
          <video
            ref={videoRef}
            src="/wiv album cover (trimmed).mp4"
            autoPlay
            loop
            muted
            playsInline
            className="grayscale contrast-125 opacity-60 mix-blend-luminosity w-full h-full object-cover"
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="border border-zinc-800 p-1 text-zinc-300 hover:text-white"
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <rect x="2" y="2" width="3" height="8" />
                <rect x="7" y="2" width="3" height="8" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <polygon points="3,2 10,6 3,10" />
              </svg>
            )}
          </button>
          <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-400">
            <span>fly...</span>
            <span className="ml-2 text-zinc-200">wiv</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
