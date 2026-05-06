"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAudio } from "@/contexts/AudioContext";

const navLinks = [
  { label: "SHRAVANI'S_WORLD.EXE", href: "/", className: "left-6 top-6 md:left-16 md:top-8" },
  { label: "ABOUT_", href: "/about", className: "right-[calc(29%+30px)] top-6 md:top-8" },
  { label: "DOC_", href: "/doc", className: "right-[calc(18%+30px)] top-6 md:top-8" },
];

const CONTACT_LINKS = [
  {
    prefix: ">> INITIATE_COMMS",
    tag: "[Email]",
    href: "mailto:sonderallura@gmail.com",
    full: ">> INITIATE_COMMS // [Email]",
  },
  {
    prefix: ">> ESTABLISH_LINK",
    tag: "[LinkedIn]",
    href: "https://www.linkedin.com/in/wati-ozzy-838b73384/",
    full: ">> ESTABLISH_LINK // [LinkedIn]",
  },
  {
    prefix: ">> ACCESS_SOURCE",
    tag: "[GITHUB]",
    href: "https://github.com/allurawind",
    full: ">> ACCESS_SOURCE // [GITHUB]",
  },
];

// Keyframe arrays for the portal flicker — defined outside the component for stability.
const FLICKER_OPACITY_IN:  number[] = [0, 1, 0, 0.8, 0, 1, 0.3, 1];
const FLICKER_SCALE_IN:    number[] = [0.7, 1.15, 1.0, 1.05, 0.95, 1.0];
const FLICKER_OPACITY_OUT: number[] = [1, 0, 0.6, 0];
const FLICKER_SCALE_OUT:   number[] = [1, 1.1, 0.8];

// ── Mini Player (30 × 30 px) ────────────────────────────────────────────────
function MiniPlayer({
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: FLICKER_OPACITY_IN, scale: FLICKER_SCALE_IN, transition: { duration: 0.38, ease: "linear" } }}
      exit={{ opacity: FLICKER_OPACITY_OUT, scale: FLICKER_SCALE_OUT, transition: { duration: 0.2, ease: "linear" } }}
      // Intercept clicks so we don't navigate via the parent <Link>
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className="group relative mr-2 size-[30px] flex-shrink-0 cursor-pointer border border-zinc-800"
      aria-label={isPlaying ? "Pause" : "Play"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }
      }}
    >
      {/* Decorative album-cover video */}
      <video
        src="/wiv album cover (trimmed).mp4"
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover grayscale contrast-125 opacity-60 mix-blend-luminosity"
      />

      {/* Play / Pause icon overlay on hover */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0a0a0f]/70 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {isPlaying ? (
          <svg width="8" height="8" viewBox="0 0 12 12" fill="white" aria-hidden="true">
            <rect x="2" y="2" width="3" height="8" />
            <rect x="7" y="2" width="3" height="8" />
          </svg>
        ) : (
          <svg width="8" height="8" viewBox="0 0 12 12" fill="white" aria-hidden="true">
            <polygon points="3,2 10,6 3,10" />
          </svg>
        )}
      </div>
    </motion.div>
  );
}

// ── Typewriter contact link ─────────────────────────────────────────────────
function TypewriterLine({ text, href, compact }: { text: string; href: string; compact?: boolean }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: compact ? 0.032 : 0.038 },
        },
      }}
      className={
        compact
          ? "block cursor-pointer font-[var(--font-space-grotesk)] text-[11px] leading-[17px] tracking-[0.06em] text-[#B6B6D9] transition-colors hover:text-white"
          : "block cursor-pointer font-[var(--font-space-grotesk)] text-[13px] leading-[24px] tracking-wider text-[#B6B6D9] transition-colors hover:text-white"
      }
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0 } },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.a>
  );
}

// ── SiteNav ─────────────────────────────────────────────────────────────────
export default function SiteNav() {
  const pathname = usePathname();
  const { isPlaying, togglePlayback } = useAudio();

  const hoverResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // linkRefs now points to the inner <a> elements (the Link components)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const contactWrapperRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [indicatorRight, setIndicatorRight] = useState(24);

  const isHome = pathname === "/";

  const activeIndex = useMemo(
    () =>
      navLinks.findIndex((link) =>
        link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`),
      ),
    [pathname],
  );

  const handleNavHoverStart = (index: number) => {
    if (hoverResetTimeoutRef.current) {
      clearTimeout(hoverResetTimeoutRef.current);
      hoverResetTimeoutRef.current = null;
    }
    setIsContactHovered(false);
    setHoveredIndex(index);
  };

  const handleNavHoverEnd = () => {
    if (hoverResetTimeoutRef.current) {
      clearTimeout(hoverResetTimeoutRef.current);
    }
    hoverResetTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      hoverResetTimeoutRef.current = null;
    }, 80);
  };

  // Align the indicator row's *right* edge with the active nav label's right edge
  // (same horizontal finish line for tab title + "you're here" line).
  useEffect(() => {
    const updateIndicatorPosition = () => {
      if (activeIndex < 0) return;
      const activeLink = linkRefs.current[activeIndex];
      const container = activeLink?.closest("nav");
      if (!activeLink || !container) return;
      const linkRect = activeLink.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicatorRight(containerRect.right - linkRect.right);
    };
    updateIndicatorPosition();
    window.addEventListener("resize", updateIndicatorPosition);
    return () => window.removeEventListener("resize", updateIndicatorPosition);
  }, [activeIndex, pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contactWrapperRef.current && !contactWrapperRef.current.contains(e.target as Node)) {
        setIsContactOpen(false);
      }
    };
    if (isContactOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isContactOpen]);

  useEffect(() => {
    return () => {
      if (hoverResetTimeoutRef.current) {
        clearTimeout(hoverResetTimeoutRef.current);
      }
    };
  }, []);

  const renderHoverBackground = (index: number) =>
    hoveredIndex === index ? (
      <motion.div
        layoutId="nav-hover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="pointer-events-none absolute inset-y-[-4px] left-0 right-0 z-[-1] px-2"
      >
        <motion.svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.rect
            x="0.5"
            y="0.5"
            width="99"
            height="99"
            fill="none"
            stroke="#B6B6D9"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </motion.svg>
        <motion.div
          className="absolute inset-0 bg-[#2A2A4B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.15, ease: "easeOut" }}
        />
      </motion.div>
    ) : null;

  const renderContactHoverBackground = () =>
    isContactHovered ? (
      <motion.div
        layoutId="nav-hover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="pointer-events-none absolute inset-y-[-4px] left-0 right-0 z-[-1] px-2"
      >
        <motion.svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.rect
            x="0.5"
            y="0.5"
            width="99"
            height="99"
            fill="none"
            stroke="#B6B6D9"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </motion.svg>
        <motion.div
          className="absolute inset-0 bg-[#2A2A4B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.15, ease: "easeOut" }}
        />
      </motion.div>
    ) : null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] bg-[#0a0a0f]/80 backdrop-blur-md">
      <nav className="relative mx-auto h-[96px] w-full max-w-[1440px]">
        {navLinks.map((item, index) => {
          const isActive = index === activeIndex;
          // Show the mini player only on non-home pages next to the active link
          const showMini = isActive && !isHome && index !== 0;

          return (
            /*
             * Wrapper div takes the absolute position so the Link element's
             * own getBoundingClientRect() stays unaffected by the mini player
             * being a flex sibling.
             */
            <div
              key={item.label}
              className={`pointer-events-auto absolute ${item.className} inline-flex items-center`}
            >
              {/* Portal-flicker mini player — mounts/unmounts with route changes */}
              <AnimatePresence>
                {showMini && (
                  <MiniPlayer
                    key={`mini-player-${index}`}
                    isPlaying={isPlaying}
                    onToggle={togglePlayback}
                  />
                )}
              </AnimatePresence>

              <Link
                href={item.href}
                ref={(element) => { linkRefs.current[index] = element; }}
                onMouseEnter={() => handleNavHoverStart(index)}
                onMouseLeave={handleNavHoverEnd}
                className="relative isolate inline-flex items-center font-silkscreen text-[20px] font-normal leading-[26px] tracking-[0em] text-[#FFFFFF]"
              >
                <span className="relative z-10">{item.label}</span>
                <AnimatePresence>{renderHoverBackground(index)}</AnimatePresence>
              </Link>
            </div>
          );
        })}

        {/* Contact Me_ toggle */}
        <div
          ref={contactWrapperRef}
          className="pointer-events-auto absolute right-6 top-6 w-max md:right-16 md:top-8"
        >
          <button
            type="button"
            onClick={() => setIsContactOpen((prev) => !prev)}
            onMouseEnter={() => { setHoveredIndex(null); setIsContactHovered(true); }}
            onMouseLeave={() => setIsContactHovered(false)}
            className="relative isolate inline-flex items-center font-silkscreen text-[20px] font-normal leading-[26px] tracking-[0em] text-[#FFFFFF]"
          >
            <span className="relative z-10">CONTACT ME_</span>
            <AnimatePresence>{renderContactHoverBackground()}</AnimatePresence>
          </button>

          {/* Terminal dropdown */}
          <AnimatePresence>
            {isContactOpen && (
              <motion.div
                key="contact-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="absolute left-0 right-0 top-[calc(100%+4px)] z-[100] w-full min-w-0 border border-white/40 bg-[#0a0a0f]"
              >
                {/* Header bar */}
                <div className="flex items-center justify-between gap-2 border-b border-white/20 px-2 py-1">
                  <span className="font-[var(--font-silkscreen)] text-[7px] tracking-[0.12em] text-[#5a5a7a]">
                    // COMMS_TERMINAL v1.0
                  </span>
                  <div className="flex shrink-0 gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3a3a5a]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3a3a5a]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3a3a5a]" />
                  </div>
                </div>

                {/* Links with typewriter */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 1.25,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                  className="space-y-2 px-2.5 py-2.5"
                >
                  {CONTACT_LINKS.map((link) => (
                    <TypewriterLine key={link.tag} text={link.full} href={link.href} compact />
                  ))}

                  {/* Blinking cursor */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { delay: 0.1, duration: 0 } },
                    }}
                    className="pt-0.5"
                  >
                    <BlinkingCursor compact />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {activeIndex >= 0 ? (
          <motion.div
            className="absolute left-auto top-[52px] flex items-center gap-[6px] font-[var(--font-space-grotesk)] text-[12px] font-normal leading-[15px] tracking-[0em] text-[#FFFFFF] md:top-[64px]"
            animate={{ right: indicatorRight }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className="font-[var(--font-space-grotesk)]">you&apos;re here</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="12" height="12" stroke="currentColor" />
              <rect x="4" y="5" width="1" height="1" fill="currentColor" />
              <rect x="9" y="5" width="1" height="1" fill="currentColor" />
              <rect x="4" y="9" width="6" height="1" fill="currentColor" />
            </svg>
          </motion.div>
        ) : null}
      </nav>
    </div>
  );
}

function BlinkingCursor({ compact }: { compact?: boolean }) {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: compact ? 0.85 : 0.9, repeat: Infinity, ease: "linear" }}
      className={
        compact
          ? "inline-block h-[11px] w-[7px] bg-[#B6B6D9] align-middle"
          : "inline-block h-[14px] w-[9px] bg-[#B6B6D9] align-middle"
      }
    />
  );
}
