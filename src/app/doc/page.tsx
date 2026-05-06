"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SubjectReport from "@/components/SubjectReport";
import { memories } from "@/data/memories";

const COLOR_TOKENS = [
  { token: "--background", hex: "#0a0a0f", label: "Background", usage: "Page base" },
  { token: "--surface", hex: "#12121e", label: "Surface", usage: "Card fill" },
  { token: "--border", hex: "#2A2A4B", label: "Border", usage: "UI borders / nav hover" },
  { token: "--border-hi", hex: "#B6B6D9", label: "Border Hi", usage: "Active stroke / cursor" },
  { token: "--foreground", hex: "#ffffff", label: "Foreground", usage: "Primary text" },
  { token: "--text-dim", hex: "#5a5a7a", label: "Text Dim", usage: "Section labels" },
  { token: "--text-muted", hex: "#3a3a5a", label: "Text Muted", usage: "Footer meta" },
  { token: "--accent-white", hex: "rgba(255,255,255,0.4)", label: "Accent White", usage: "Connective lines" },
];

const TYPE_SCALE = [
  {
    name: "Display / H1",
    fontFamily: "Silkscreen",
    size: "64px",
    weight: "400",
    lineHeight: "1.28",
    usage: "Section headers, nav title",
    sample: "Silkscreen",
    className: "font-silkscreen text-[64px] leading-[1.28]",
  },
  {
    name: "Body",
    fontFamily: "Space Grotesk",
    size: "24px",
    weight: "400",
    lineHeight: "1.3",
    usage: "Paragraphs, general copy",
    sample: "Space Grotesk",
    className: "font-sans text-[24px] leading-[1.3]",
  },
  {
    name: "Label / Terminal",
    fontFamily: "Silkscreen",
    size: "11px",
    weight: "400",
    lineHeight: "1.4",
    usage: "Component labels, report headers",
    sample: "LABEL_TEXT",
    className: "font-silkscreen text-[11px] leading-[1.4] tracking-wider",
  },
  {
    name: "Meta",
    fontFamily: "Silkscreen",
    size: "8–9px",
    weight: "400",
    lineHeight: "1.4",
    usage: "Record indices, section tags",
    sample: "// METADATA_TAG",
    className: "font-silkscreen text-[9px] leading-[1.4] tracking-[0.2em]",
  },
  {
    name: "Nav Link",
    fontFamily: "Silkscreen",
    size: "20px",
    weight: "400",
    lineHeight: "26px",
    usage: "Navigation items",
    sample: "NAV_ITEM_",
    className: "font-silkscreen text-[20px] leading-[26px]",
  },
];

const ANIMATION_RULES = [
  {
    name: "Modal Slide-in",
    duration: "0.48s",
    ease: "[0.25, 0.46, 0.45, 0.94]",
    usage: "SubjectReport panel entry",
  },
  {
    name: "Nav Hover",
    duration: "0.18s",
    ease: "easeOut",
    usage: "Nav border draw, hover fill",
  },
  {
    name: "Border Draw",
    duration: "0.20s",
    ease: "easeOut",
    usage: "SVG pathLength stroke reveal",
  },
  {
    name: "Typewriter Char",
    duration: "0s / 0.018s stagger",
    ease: "steps(1)",
    usage: "SubjectReport description reveal",
  },
  {
    name: "Terminal Link Stagger",
    duration: "1.25s between lines",
    ease: "steps(1) / 0.038s per char",
    usage: "Contact dropdown typewriter",
  },
  {
    name: "Scroll Fade-Up",
    duration: "0.28s",
    ease: "[0.22, 1, 0.36, 1]",
    usage: "About page whileInView blocks",
  },
  {
    name: "Connecting Line",
    duration: "0.52s",
    ease: "easeOut",
    usage: "SVG dash from building to modal",
  },
  {
    name: "Float Building",
    duration: "∞ loop",
    ease: "ease-in-out (CSS)",
    usage: "Isometric buildings on home",
  },
];

const MOCK_BUILDING_RECT: DOMRect = {
  left: 320,
  top: 540,
  width: 64,
  height: 64,
  right: 384,
  bottom: 604,
  x: 320,
  y: 540,
  toJSON() { return {}; },
};

function ColorSwatch({ hex, label, token, usage }: { hex: string; label: string; token: string; usage: string }) {
  const isTransparent = hex.startsWith("rgba");
  return (
    <div className="border border-[#2A2A4B] bg-[#0d0d18]">
      <div
        className="h-[80px] w-full"
        style={{ background: isTransparent ? `${hex}` : hex, borderBottom: "1px solid #2A2A4B" }}
      />
      <div className="space-y-1 p-3">
        <p className="font-silkscreen text-[9px] tracking-[0.16em] text-[#5a5a7a]">{token}</p>
        <p className="font-[var(--font-space-grotesk)] text-[14px] font-medium text-white">{label}</p>
        <p className="font-[var(--font-silkscreen)] text-[8px] tracking-[0.12em] text-[#B6B6D9]">
          {isTransparent ? hex : hex.toUpperCase()}
        </p>
        <p className="font-[var(--font-space-grotesk)] text-[11px] text-[#5a5a7a]">{usage}</p>
      </div>
    </div>
  );
}

export default function DocPage() {
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [showcaseRect, setShowcaseRect] = useState<DOMRect | null>(null);
  const renderButtonRef = useRef<HTMLButtonElement>(null);

  const demoMemory = memories[0];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* SubjectReport showcase */}
      <AnimatePresence>
        {showcaseOpen && showcaseRect && (
          <SubjectReport
            memory={demoMemory}
            buildingRect={showcaseRect}
            onClose={() => { setShowcaseOpen(false); setShowcaseRect(null); }}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-36">

        {/* Page header */}
        <div className="mb-16 border-b border-[#2A2A4B] pb-8">
          <p className="mb-3 font-silkscreen text-[9px] tracking-[0.3em] text-[#5a5a7a]">
            // MEMORYSCAPE · DESIGN SYSTEM · v1.0
          </p>
          <h1 className="font-silkscreen text-[64px] leading-[1.28]">DESIGN TOKENS</h1>
          <p className="mt-4 max-w-[640px] font-[var(--font-space-grotesk)] text-[16px] leading-[1.5] text-[#B6B6D9]">
            Developer specification sheet. Extracted from global CSS, Tailwind configuration, and
            component source. All values are canonical — use these tokens, not hardcoded literals.
          </p>
        </div>

        {/* ── 01 · COLOR PALETTE ────────────────────────────────────── */}
        <section className="mb-20">
          <div className="mb-6 flex items-center gap-4">
            <span className="font-silkscreen text-[9px] tracking-[0.3em] text-[#5a5a7a]">01</span>
            <div className="h-px flex-1 bg-[#2A2A4B]" />
            <h2 className="font-silkscreen text-[20px] leading-[26px]">COLOR_PALETTE</h2>
            <div className="h-px w-8 bg-[#2A2A4B]" />
          </div>
          <div className="grid grid-cols-2 gap-px bg-[#2A2A4B] sm:grid-cols-4 lg:grid-cols-8">
            {COLOR_TOKENS.map((c) => (
              <ColorSwatch key={c.token} {...c} />
            ))}
          </div>
        </section>

        {/* ── 02 · TYPOGRAPHY SCALE ─────────────────────────────────── */}
        <section className="mb-20">
          <div className="mb-6 flex items-center gap-4">
            <span className="font-silkscreen text-[9px] tracking-[0.3em] text-[#5a5a7a]">02</span>
            <div className="h-px flex-1 bg-[#2A2A4B]" />
            <h2 className="font-silkscreen text-[20px] leading-[26px]">TYPOGRAPHY_SCALE</h2>
            <div className="h-px w-8 bg-[#2A2A4B]" />
          </div>

          <div className="space-y-px">
            {TYPE_SCALE.map((t) => (
              <div
                key={t.name}
                className="grid items-center gap-4 border border-[#2A2A4B] bg-[#0d0d18] p-5"
                style={{ gridTemplateColumns: "200px 1fr 200px" }}
              >
                {/* Spec column */}
                <div className="space-y-1">
                  <p className="font-silkscreen text-[9px] tracking-[0.2em] text-[#5a5a7a]">{t.name}</p>
                  <p className="font-[var(--font-space-grotesk)] text-[12px] text-[#B6B6D9]">
                    {t.fontFamily} · {t.size} · {t.weight}w · lh {t.lineHeight}
                  </p>
                </div>
                {/* Sample */}
                <div className={`overflow-hidden text-white ${t.className}`} style={{ lineClamp: 1 }}>
                  {t.sample}
                </div>
                {/* Usage */}
                <p className="text-right font-[var(--font-space-grotesk)] text-[11px] text-[#5a5a7a]">
                  {t.usage}
                </p>
              </div>
            ))}
          </div>

          {/* Font variable reference */}
          <div className="mt-4 border border-[#2A2A4B] bg-[#0d0d18] p-4">
            <p className="font-silkscreen text-[9px] tracking-[0.2em] text-[#5a5a7a]">CSS VARIABLES</p>
            <div className="mt-2 grid grid-cols-2 gap-2 font-[var(--font-space-grotesk)] text-[12px]">
              <code className="text-[#B6B6D9]">
                <span className="text-[#5a5a7a]">--font-display: </span>Silkscreen (var(--font-display))
              </code>
              <code className="text-[#B6B6D9]">
                <span className="text-[#5a5a7a]">--font-sans: </span>Space Grotesk (var(--font-sans))
              </code>
            </div>
          </div>
        </section>

        {/* ── 03 · ANIMATION RULES ──────────────────────────────────── */}
        <section className="mb-20">
          <div className="mb-6 flex items-center gap-4">
            <span className="font-silkscreen text-[9px] tracking-[0.3em] text-[#5a5a7a]">03</span>
            <div className="h-px flex-1 bg-[#2A2A4B]" />
            <h2 className="font-silkscreen text-[20px] leading-[26px]">ANIMATION_RULES</h2>
            <div className="h-px w-8 bg-[#2A2A4B]" />
          </div>

          <div className="border border-[#2A2A4B] bg-[#0d0d18]">
            <div className="grid border-b border-[#2A2A4B] px-5 py-2" style={{ gridTemplateColumns: "220px 100px 1fr 1fr" }}>
              <span className="font-silkscreen text-[8px] tracking-[0.2em] text-[#5a5a7a]">NAME</span>
              <span className="font-silkscreen text-[8px] tracking-[0.2em] text-[#5a5a7a]">DURATION</span>
              <span className="font-silkscreen text-[8px] tracking-[0.2em] text-[#5a5a7a]">EASE</span>
              <span className="font-silkscreen text-[8px] tracking-[0.2em] text-[#5a5a7a]">USAGE</span>
            </div>
            {ANIMATION_RULES.map((rule, i) => (
              <div
                key={rule.name}
                className={`grid items-center px-5 py-3 ${i < ANIMATION_RULES.length - 1 ? "border-b border-[#2A2A4B]/60" : ""}`}
                style={{ gridTemplateColumns: "220px 100px 1fr 1fr" }}
              >
                <span className="font-[var(--font-space-grotesk)] text-[13px] text-white">{rule.name}</span>
                <span className="font-[var(--font-space-grotesk)] text-[13px] text-[#B6B6D9]">{rule.duration}</span>
                <code className="font-[var(--font-space-grotesk)] text-[12px] text-[#5a5a7a]">{rule.ease}</code>
                <span className="font-[var(--font-space-grotesk)] text-[12px] text-[#5a5a7a]">{rule.usage}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 04 · COMPONENT SHOWCASE ───────────────────────────────── */}
        <section className="mb-20">
          <div className="mb-6 flex items-center gap-4">
            <span className="font-silkscreen text-[9px] tracking-[0.3em] text-[#5a5a7a]">04</span>
            <div className="h-px flex-1 bg-[#2A2A4B]" />
            <h2 className="font-silkscreen text-[20px] leading-[26px]">COMPONENT_SHOWCASE</h2>
            <div className="h-px w-8 bg-[#2A2A4B]" />
          </div>

          <div className="border border-[#2A2A4B] bg-[#0d0d18] p-6">
            <p className="mb-2 font-silkscreen text-[9px] tracking-[0.2em] text-[#5a5a7a]">
              // SubjectReport — primary pop-up panel component
            </p>
            <p className="mb-6 max-w-[600px] font-[var(--font-space-grotesk)] text-[14px] leading-[1.5] text-[#B6B6D9]">
              Renders an animated modal with SVG border frame, connecting line to the originating
              building, typewriter description, and style-specific enter/exit transitions.
              Eight border styles exist, keyed to memory IDs.
            </p>

            {/* Spec grid */}
            <div className="mb-8 grid grid-cols-2 gap-px bg-[#2A2A4B] sm:grid-cols-4">
              {[
                { label: "Width", value: "380px" },
                { label: "Height", value: "520px" },
                { label: "Border styles", value: "8 variants" },
                { label: "Entry", value: "Framer Motion" },
              ].map((item) => (
                <div key={item.label} className="bg-[#0a0a0f] px-4 py-3">
                  <p className="font-silkscreen text-[8px] tracking-[0.2em] text-[#5a5a7a]">{item.label}</p>
                  <p className="mt-1 font-[var(--font-space-grotesk)] text-[16px] text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Launch button */}
            <button
              ref={renderButtonRef}
              type="button"
              onClick={() => {
                if (renderButtonRef.current) {
                  setShowcaseRect(renderButtonRef.current.getBoundingClientRect());
                }
                setShowcaseOpen(true);
              }}
              className="border border-[#2A2A4B] bg-[#0a0a0f] px-6 py-3 font-silkscreen text-[11px] tracking-[0.2em] text-[#B6B6D9] transition-colors hover:border-[#B6B6D9] hover:text-white"
            >
              &gt;&gt; RENDER_COMPONENT
            </button>
            <p className="mt-3 font-silkscreen text-[8px] tracking-[0.16em] text-[#3a3a5a]">
              // fires SubjectReport with memory[0] — &quot;Early Morning Rhythms&quot;
            </p>
          </div>
        </section>

        {/* Footer stamp */}
        <div className="border-t border-[#2A2A4B] pt-6">
          <p className="font-silkscreen text-[8px] tracking-[0.24em] text-[#3a3a5a]">
            [END OF SPEC] · MEMORYSCAPE · HUMAN SCIENCE PROJECT · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </main>
  );
}
