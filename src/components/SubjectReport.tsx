"use client";

import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import { useRef, useLayoutEffect, useState } from "react";
import { memories, type Memory, type DescriptionSegment } from "@/data/memories";

const W = 380;
const H = 520;

// ─── SVG element descriptor ────────────────────────────────────────────────
type ElKind = "fill" | "stroke" | "accent" | "fill-accent";
interface SvgEl {
  kind: ElKind;
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  /** Delay override (seconds) */
  delay?: number;
  /** Duration override (seconds) */
  duration?: number;
}

// ─── Per-style config ───────────────────────────────────────────────────────
interface PopupConfig {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
  transition: Transition;
  svgEls: SvgEl[];
}

// All shapes are sized to W=380, H=520
const POPUP_CONFIGS: Record<string, PopupConfig> = {
  // ── Style 1 · Pop Up 1 aesthetic · top-left + bottom-right diagonal cuts ──
  "house-cpu": {
    initial: { x: 60, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 40, opacity: 0 },
    transition: { duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] },
    svgEls: [
      { kind: "fill", d: "M0.5 38L38 0.5H379.5V482L342 519.5H0.5V38Z" },
      { kind: "stroke", d: "M0.5 38L38 0.5H379.5V482L342 519.5H0.5V38Z" },
      { kind: "accent", d: "M5.5 482V519.5H24" },
      { kind: "accent", d: "M374.5 38V0.5H356" },
    ],
  },

  // ── Style 2 · Pop Up 2 aesthetic · two vertical bracket strokes ───────────
  "school-gemini": {
    initial: { scale: 0.86, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.92, opacity: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
    svgEls: [
      // full rect background
      { kind: "fill", d: "M0.5 0.5H379.5V519.5H0.5V0.5Z" },
      // left bracket strokes independently
      { kind: "stroke", d: "M28 0.5H0.5V519.5H28", delay: 0.5 },
      { kind: "stroke", d: "M352 0.5H379.5V519.5H352", delay: 0.65 },
    ],
  },

  // ── Style 3 · Pop Up 3 aesthetic · thick bold border + inner panel lines ──
  "stray-dogs": {
    initial: { y: -40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -24, opacity: 0 },
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
    svgEls: [
      { kind: "fill", d: "M0.5 0.5H379.5V519.5H0.5V0.5Z" },
      { kind: "stroke", d: "M2 2H378V518H2Z", strokeWidth: 4 },
    ],
  },

  // ── Style 4 · Pop Up 4 aesthetic · angled cuts + filled-triangle corners ──
  "grocery-store": {
    initial: { x: 50, scale: 0.95, opacity: 0 },
    animate: { x: 0, scale: 1, opacity: 1 },
    exit: { x: 30, opacity: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
    svgEls: [
      { kind: "fill", d: "M0.5 38L38 0.5H379.5V482L342 519.5H0.5V38Z" },
      // white filled triangles at cut corners (appear after border)
      { kind: "fill-accent", d: "M38 0.5H0.5V38Z", fill: "white", delay: 1.05 },
      { kind: "fill-accent", d: "M342 519.5H379.5V482Z", fill: "white", delay: 1.05 },
      { kind: "stroke", d: "M0.5 38L38 0.5H379.5V482L342 519.5H0.5V38Z" },
      // corner brackets at the UNCUT corners
      { kind: "accent", d: "M5 502V519.5H22", delay: 1.15 },
      { kind: "accent", d: "M375 17V0.5H358", delay: 1.15 },
    ],
  },

  // ── Style 5 · Pop Up 5 aesthetic · double L-bracket corners ──────────────
  "dyslexia-struggle": {
    initial: { scale: 0.9, y: 22, opacity: 0 },
    animate: { scale: 1, y: 0, opacity: 1 },
    exit: { scale: 0.92, y: 14, opacity: 0 },
    transition: { duration: 0.44, ease: [0.34, 1.4, 0.64, 1] },
    svgEls: [
      { kind: "fill", d: "M0.5 0.5H379.5V519.5H0.5V0.5Z" },
      // main L-strokes (thick) — one from top-right across top, one from bottom-left across bottom
      { kind: "stroke", d: "M379.5 420V0.5H30", strokeWidth: 3, delay: 0.5 },
      { kind: "stroke", d: "M0.5 100V519.5H350", strokeWidth: 3, delay: 0.65 },
      // corner accent brackets
      { kind: "accent", d: "M22 0.5H0.5V22", strokeWidth: 3, delay: 1.1 },
      { kind: "accent", d: "M358 519.5H379.5V498", strokeWidth: 3, delay: 1.1 },
    ],
  },

  // ── Style 6 · Pop Up 6 aesthetic · minimal flat panel + header bar ────────
  "maths-teacher": {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.55 },
    svgEls: [
      { kind: "fill", d: "M0.5 0.5H379.5V519.5H0.5V0.5Z" },
      { kind: "stroke", d: "M0.5 0.5H379.5V519.5H0.5V0.5Z" },
      // header accent fill (half-width, like Pop Up 6's small dark strip)
      { kind: "fill-accent", d: "M0.5 0.5H180V44H0.5Z", fill: "#1a1a2e", delay: 0.9 },
      // header divider line
      { kind: "accent", d: "M0.5 44H379.5", delay: 1.0 },
    ],
  },

  // ── Style 7 · Reverse-cut · top-right + bottom-left diagonal cuts ─────────
  "supportive-friend": {
    initial: { y: -28, x: 18, opacity: 0 },
    animate: { y: 0, x: 0, opacity: 1 },
    exit: { y: -18, opacity: 0 },
    transition: { duration: 0.44, ease: "easeOut" },
    svgEls: [
      { kind: "fill", d: "M379.5 38L342 0.5H0.5V482L38 519.5H379.5V38Z" },
      { kind: "stroke", d: "M379.5 38L342 0.5H0.5V482L38 519.5H379.5V38Z" },
      // corner accents at the UNCUT corners (top-left + bottom-right)
      { kind: "accent", d: "M18 0.5H0.5V18", delay: 1.1 },
      { kind: "accent", d: "M362 519.5H379.5V502", delay: 1.1 },
    ],
  },

  // ── Style 8 · Data terminal · scan-line targeting frame ──────────────────
  "ecole-building": {
    initial: { scale: 1.06, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.04, opacity: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    svgEls: [
      { kind: "fill", d: "M0.5 0.5H379.5V519.5H0.5V0.5Z" },
      { kind: "stroke", d: "M0.5 0.5H379.5V519.5H0.5V0.5Z" },
      // horizontal scan dividers
      { kind: "accent", d: "M0.5 44H379.5", delay: 1.0 },
      { kind: "accent", d: "M0.5 476H379.5", delay: 1.05 },
      // four corner tick marks
      { kind: "accent", d: "M0.5 16V0.5H16", delay: 1.15 },
      { kind: "accent", d: "M379.5 16V0.5H364", delay: 1.15 },
      { kind: "accent", d: "M0.5 504V519.5H16", delay: 1.2 },
      { kind: "accent", d: "M379.5 504V519.5H364", delay: 1.2 },
    ],
  },
};

// ─── SVG element renderer ──────────────────────────────────────────────────
function renderSvgElements(els: SvgEl[]) {
  return els.map((el, i) => {
    if (el.kind === "fill") {
      return (
        <motion.path
          key={i}
          d={el.d}
          fill={el.fill ?? "#0d0d18"}
          fillOpacity={0.97}
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.44 }}
        />
      );
    }
    if (el.kind === "stroke") {
      return (
        <motion.path
          key={i}
          d={el.d}
          stroke={el.stroke ?? "white"}
          strokeWidth={el.strokeWidth ?? 1}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: el.duration ?? 0.75, delay: el.delay ?? 0.5, ease: "easeOut" }}
        />
      );
    }
    if (el.kind === "accent") {
      return (
        <motion.path
          key={i}
          d={el.d}
          stroke={el.stroke ?? "white"}
          strokeWidth={el.strokeWidth ?? 1}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: el.duration ?? 0.22, delay: el.delay ?? 1.1 }}
        />
      );
    }
    if (el.kind === "fill-accent") {
      return (
        <motion.path
          key={i}
          d={el.d}
          fill={el.fill ?? "white"}
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: el.delay ?? 1.0 }}
        />
      );
    }
    return null;
  });
}

// ─── Typewriter text ────────────────────────────────────────────────────────
interface FlatChar {
  char: string;
  href?: string;
}

function buildFlatChars(segments: DescriptionSegment[]): FlatChar[] {
  return segments.flatMap((seg) =>
    seg.text.split("").map((char) => ({ char, href: seg.href })),
  );
}

function TypewriterText({
  memory,
  delayStart,
}: {
  memory: Memory;
  delayStart: number;
}) {
  const segments: DescriptionSegment[] = memory.richDescription ?? [
    { text: memory.description },
  ];
  const flatChars = buildFlatChars(segments);

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.018, delayChildren: delayStart },
        },
      }}
      className="font-[var(--font-space-grotesk)] text-[13px] leading-[22px] text-white/80"
      style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", display: "block" }}
    >
      {flatChars.map((fc, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0 } },
          }}
          className={
            fc.href
              ? "cursor-pointer text-sky-300 underline underline-offset-2 hover:text-sky-200"
              : undefined
          }
          onClick={
            fc.href
              ? () => {
                  window.open(fc.href!, "_blank", "noopener,noreferrer");
                }
              : undefined
          }
          role={fc.href ? "link" : undefined}
        >
          {fc.char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
interface Props {
  memory: Memory;
  buildingRect: DOMRect;
  onClose: () => void;
}

export default function SubjectReport({ memory, buildingRect, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [lineTarget, setLineTarget] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    if (modalRef.current) {
      const r = modalRef.current.getBoundingClientRect();
      setLineTarget({ x: r.left + 2, y: r.top + r.height / 2 });
    }
  }, []);

  const cfg = POPUP_CONFIGS[memory.id] ?? POPUP_CONFIGS["house-cpu"];

  const bx = buildingRect.left + buildingRect.width / 2;
  const by = buildingRect.top + buildingRect.height / 2;

  const recordIndex = memories.findIndex((m) => m.id === memory.id);

  return (
    <>
      {/* ── Backdrop ───────────────────────────────────────────────────── */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        onClick={onClose}
      />

      {/* ── Connecting line ─────────────────────────────────────────────── */}
      {lineTarget && (
        <motion.svg
          className="pointer-events-none fixed inset-0 z-50"
          style={{ width: "100vw", height: "100vh" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
        >
          <motion.path
            d={`M ${bx} ${by} L ${lineTarget.x} ${lineTarget.y}`}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            strokeDasharray="5 4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.52, ease: "easeOut" }}
          />
          <motion.circle
            cx={bx}
            cy={by}
            r={3}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.48, duration: 0.18 }}
          />
        </motion.svg>
      )}

      {/* ── Modal panel ─────────────────────────────────────────────────── */}
      <motion.div
        ref={modalRef}
        className="pointer-events-auto fixed right-8 top-1/2 z-50 -translate-y-1/2"
        style={{ width: W, height: H }}
        initial={cfg.initial}
        animate={cfg.animate}
        exit={{ ...cfg.exit, transition: { duration: 0.22 } }}
        transition={cfg.transition}
      >
        {/* SVG border layer */}
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {renderSvgElements(cfg.svgEls)}
          {/* Decorative tick marks (consistent across all styles) */}
          <motion.line
            x1="12" y1="10" x2="12" y2="26"
            stroke="rgba(255,255,255,0.15)" strokeWidth="1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.2 }}
          />
          <motion.line
            x1="18" y1="6" x2="18" y2="22"
            stroke="rgba(255,255,255,0.15)" strokeWidth="1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.2 }}
          />
        </svg>

        {/* ── Content ───────────────────────────────────────────────────── */}
        {/*
          No vertical padding on the outer wrapper — header and footer use
          fixed-height zones with flex items-center so their contents are
          always perfectly centered between the surrounding border lines.
        */}
        <div className="relative z-10 flex h-full flex-col px-7">

          {/* ── Header zone: h-14 (56px) centers label + close button ─── */}
          <motion.div
            className="flex h-14 shrink-0 items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.3 }}
          >
            <span className="font-[var(--font-silkscreen)] text-[9px] tracking-[0.18em] text-[#5a5a7a]">
              // SUBJECT REPORT
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close report"
              className="border border-zinc-700 px-2 py-0.5 font-[var(--font-space-grotesk)] text-[10px] tracking-widest text-zinc-500 transition-colors hover:border-zinc-400 hover:text-white"
            >
              ✕ CLOSE
            </button>
          </motion.div>

          {/* Divider — flush under the header zone, no extra margin */}
          <motion.div
            className="h-px shrink-0 bg-zinc-800"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ transformOrigin: "left" }}
            transition={{ delay: 1.15, duration: 0.4 }}
          />

          {/* Title */}
          <motion.h2
            className="mb-3 mt-5 shrink-0 font-[var(--font-silkscreen)] text-[11px] leading-[18px] tracking-wider text-white"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          >
            {memory.title.toUpperCase()}
          </motion.h2>

          {/* Typewriter text — scrollable, fills remaining space */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:#3f3f46_transparent] [scrollbar-width:thin]">
            <TypewriterText memory={memory} delayStart={1.35} />
          </div>

          {/* ── Footer zone: h-[58px] centers record text between the   ─── */}
          {/*    border-t line above and the modal's bottom border below.    */}
          <motion.div
            className="mt-4 flex h-[58px] shrink-0 items-center border-t border-zinc-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.3 }}
          >
            <span className="font-[var(--font-silkscreen)] text-[8px] tracking-[0.2em] text-[#3a3a5a]">
              [RECORD #{String(recordIndex + 1).padStart(3, "0")} /{" "}
              {String(memories.length).padStart(3, "0")}]
            </span>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
