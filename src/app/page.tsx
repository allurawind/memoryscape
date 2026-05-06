"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SubjectReport from "@/components/SubjectReport";
import { memoriesMap } from "@/data/memories";
import { useAudio, tracks } from "@/contexts/AudioContext";

const buildings = [
  { id: "maths-teacher",     src: "/maths teacher-Photoroom.png",     alt: "Maths Teacher",     className: "left-[0%] top-[38.17%] w-[16.48%] z-20" },
  { id: "dyslexia-struggle", src: "/dyslexia struggle-Photoroom.png", alt: "Dyslexia Struggle", className: "left-[22.25%] top-[50.76%] w-[16.48%] z-30" },
  { id: "stray-dogs",        src: "/stray dogs-Photoroom.png",        alt: "Stray Dogs",        className: "left-[30.42%] top-[22.52%] w-[16.48%] z-40" },
  { id: "house-cpu",         src: "/house cpu-Photoroom.png",         alt: "House CPU",         className: "left-[43.1%] top-[43.7%] w-[16.48%] z-40" },
  { id: "school-gemini",     src: "/school gemini-Photoroom.png",     alt: "School Gemini",     className: "left-[57.46%] top-[21.37%] w-[21.97%] z-30" },
  { id: "grocery-store",     src: "/grocery store-Photoroom.png",     alt: "Grocery Store",     className: "left-[34.08%] top-[0%] w-[16.62%] z-20" },
  { id: "ecole-building",    src: "/ecole building-Photoroom.png",    alt: "Ecole Building",    className: "left-[55.35%] top-[69.47%] w-[16.48%] z-10" },
  { id: "supportive-friend", src: "/supportive friend-Photoroom.png", alt: "Supportive Friend", className: "left-[83.52%] top-[52.29%] w-[16.48%] z-20" },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const buildingRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { isPlaying, currentTrackIndex, togglePlayback: audioToggle, nextTrack, previousTrack, audioRef } = useAudio();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [buildingRect, setBuildingRect] = useState<DOMRect | null>(null);
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");

  // Sync decorative video with global audio state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!isPlaying) {
      video.pause();
    }
  // Only run once on mount to handle the blocked-autoplay case
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restart video on track change; pause when audio is paused
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.currentTime = 0;
      void video.play();
    } else {
      video.pause();
    }
  }, [currentTrackIndex, isPlaying]);

  // Page-level toggle: syncs the decorative video AND delegates audio to context
  const togglePlayback = async () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.currentTime = audio.currentTime;
      void video.play();
    }
    await audioToggle();
  };

  const handleBuildingClick = (id: string, index: number) => {
    const el = buildingRefs.current[index];
    const section = sectionRef.current;
    if (!el || !section) return;

    const bRect = el.getBoundingClientRect();
    const sRect = section.getBoundingClientRect();
    const originX = ((bRect.left + bRect.width / 2 - sRect.left) / sRect.width) * 100;
    const originY = ((bRect.top + bRect.height / 2 - sRect.top) / sRect.height) * 100;

    setTransformOrigin(`${originX}% ${originY}%`);
    setBuildingRect(bRect);
    setSelectedId(id);
  };

  const handleClose = () => {
    setSelectedId(null);
    setBuildingRect(null);
  };

  const selectedMemory = selectedId ? memoriesMap[selectedId] : null;

  return (
    <main className="relative h-screen overflow-hidden bg-[#0a0a0f] text-white">
      <div className="relative mx-auto h-full w-full max-w-[1440px]">

        {/* ── Map section ────────────────────────────────────────────── */}
        <motion.section
          ref={sectionRef}
          className="absolute left-1/2 top-[52%] h-[52vh] max-h-[524px] min-h-[340px] w-[70vw] max-w-[710px] min-w-[320px] -translate-x-1/2 -translate-y-1/2"
          animate={
            selectedId
              ? { scale: 1.05, transformOrigin }
              : { scale: 1, transformOrigin: "50% 50%" }
          }
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {buildings.map((building, index) => {
            const isSelected = selectedId === building.id;
            const isDimmed = selectedId !== null && !isSelected;

            const floatDuration = 5 + (index % 3);
            const floatDelay = index * 0.18;

            return (
              <motion.div
                key={building.src}
                ref={(el) => { buildingRefs.current[index] = el; }}
                className={`absolute ${building.className} cursor-pointer`}
                style={isSelected ? { zIndex: 45 } : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isDimmed ? 0.4 : 1,
                  y: 0,
                  scale: isSelected ? 1.18 : 1,
                  filter: isDimmed ? "blur(2.5px)" : "none",
                }}
                transition={{
                  opacity: { duration: 0.5, delay: selectedId ? 0 : index * 0.08 },
                  y: { duration: 0.5, delay: index * 0.08 },
                  scale: { duration: 0.35, type: "spring", stiffness: 180, damping: 22 },
                  filter: { duration: 0.4 },
                }}
                whileHover={!selectedId ? { scale: 1.08 } : undefined}
                onClick={() => handleBuildingClick(building.id, index)}
                aria-label={`View report: ${building.alt}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleBuildingClick(building.id, index);
                  }
                }}
              >
                <div
                  style={{
                    animation: `floatBuilding ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
                  }}
                >
                  <Image
                    src={building.src}
                    alt={building.alt}
                    width={200}
                    height={200}
                    className="h-auto w-full select-none object-cover drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                    priority={index < 4}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* ── Music player (home only) ────────────────────────────────── */}
        <aside className="absolute bottom-5 left-6 z-50 h-[100px] w-[221px] md:bottom-8 md:left-16">
          <div className="h-[100px] w-[100px] border border-zinc-800 bg-transparent p-0">
            <video
              ref={videoRef}
              src="/wiv album cover (trimmed).mp4"
              autoPlay
              loop
              muted
              playsInline
              className="grayscale contrast-125 opacity-60 mix-blend-luminosity h-full w-full object-cover"
            />
          </div>
          <div className="absolute left-[121px] top-[15px] max-w-[100px] whitespace-nowrap font-[var(--font-space-grotesk)] text-[16px] font-normal leading-[20px] text-[#FFFFFF]">
            {tracks[currentTrackIndex].title}
          </div>
          <div className="absolute left-[121px] top-[35px] z-10 font-[var(--font-space-grotesk)] text-[12px] font-normal leading-[15px] text-[#757575]">
            wiv
          </div>
          <div className="absolute left-[121px] top-[68px] flex items-center gap-2">
            <button
              type="button"
              onClick={previousTrack}
              aria-label="Previous track"
              className="flex h-6 w-6 items-center justify-center border border-zinc-800 text-zinc-300 hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <rect x="1" y="2" width="2" height="8" />
                <polygon points="10,2 3,6 10,10" />
              </svg>
            </button>
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause media" : "Play media"}
              className="flex h-6 w-6 items-center justify-center border border-zinc-800 text-zinc-300 hover:text-white"
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
            <button
              type="button"
              onClick={nextTrack}
              aria-label="Next track"
              className="flex h-6 w-6 items-center justify-center border border-zinc-800 text-zinc-300 hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <polygon points="2,2 9,6 2,10" />
                <rect x="9" y="2" width="2" height="8" />
              </svg>
            </button>
          </div>
        </aside>
      </div>

      {/* ── Subject Report overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedMemory && buildingRect && (
          <SubjectReport
            key={selectedId}
            memory={selectedMemory}
            buildingRect={buildingRect}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
