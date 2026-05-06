"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const navLinks = [
  { label: "SHRAVANI'S_WORLD.EXE", href: "/", className: "left-6 top-6 md:left-16 md:top-8" },
  { label: "ABOUT_", href: "/about", className: "right-[29%] top-6 md:top-8" },
  { label: "DOC_", href: "/doc", className: "right-[18%] top-6 md:top-8" },
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

function TypewriterLine({ text, href }: { text: string; href: string }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.038 },
        },
      }}
      className="block cursor-pointer font-[var(--font-space-grotesk)] text-[13px] leading-[24px] tracking-wider text-[#B6B6D9] transition-colors hover:text-white"
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

export default function SiteNav() {
  const pathname = usePathname();
  const hoverResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const contactWrapperRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [indicatorLeft, setIndicatorLeft] = useState(24);

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

  useEffect(() => {
    const updateIndicatorPosition = () => {
      if (activeIndex < 0) return;
      const activeLink = linkRefs.current[activeIndex];
      const container = activeLink?.parentElement;
      if (!activeLink || !container) return;
      const linkRect = activeLink.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicatorLeft(linkRect.left - containerRect.left);
    };
    updateIndicatorPosition();
    window.addEventListener("resize", updateIndicatorPosition);
    return () => window.removeEventListener("resize", updateIndicatorPosition);
  }, [activeIndex]);

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
        className="pointer-events-none absolute -inset-x-2 -inset-y-1 z-[-1]"
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
        className="pointer-events-none absolute -inset-x-2 -inset-y-1 z-[-1]"
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
        {navLinks.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            ref={(element) => {
              linkRefs.current[index] = element;
            }}
            onMouseEnter={() => handleNavHoverStart(index)}
            onMouseLeave={handleNavHoverEnd}
            className={`pointer-events-auto absolute ${item.className} isolate inline-flex items-center font-silkscreen text-[20px] font-normal leading-[26px] tracking-[0em] text-[#FFFFFF]`}
          >
            <span className="relative z-10">{item.label}</span>
            <AnimatePresence>{renderHoverBackground(index)}</AnimatePresence>
          </Link>
        ))}

        {/* Contact Me_ toggle */}
        <div
          ref={contactWrapperRef}
          className="pointer-events-auto absolute right-6 top-6 md:right-16 md:top-8"
        >
          <button
            type="button"
            onClick={() => setIsContactOpen((prev) => !prev)}
            onMouseEnter={() => { setHoveredIndex(null); setIsContactHovered(true); }}
            onMouseLeave={() => setIsContactHovered(false)}
            className="isolate inline-flex items-center font-silkscreen text-[20px] font-normal leading-[26px] tracking-[0em] text-[#FFFFFF]"
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
                className="absolute -left-2 top-[calc(100%+4px)] z-[100] w-[calc(100%+1rem)] border border-white/40 bg-[#0a0a0f]"
              >
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-white/20 px-4 py-2">
                  <span className="font-[var(--font-silkscreen)] text-[8px] tracking-[0.14em] text-[#5a5a7a]">
                    // COMMS_TERMINAL v1.0
                  </span>
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#3a3a5a]" />
                    <span className="h-2 w-2 rounded-full bg-[#3a3a5a]" />
                    <span className="h-2 w-2 rounded-full bg-[#3a3a5a]" />
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
                  className="space-y-3 px-4 py-4"
                >
                  {CONTACT_LINKS.map((link) => (
                    <TypewriterLine key={link.tag} text={link.full} href={link.href} />
                  ))}

                  {/* Blinking cursor */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { delay: 0.1, duration: 0 } },
                    }}
                    className="pt-1"
                  >
                    <BlinkingCursor />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {activeIndex >= 0 ? (
          <motion.div
            className="absolute top-[52px] flex items-center gap-[6px] font-[var(--font-space-grotesk)] text-[12px] font-normal leading-[15px] tracking-[0em] text-[#FFFFFF] md:top-[64px]"
            animate={{ left: indicatorLeft }}
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

function BlinkingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      className="inline-block h-[14px] w-[9px] bg-[#B6B6D9] align-middle"
    />
  );
}
