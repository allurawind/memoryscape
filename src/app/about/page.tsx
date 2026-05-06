"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as Record<string, unknown>,
  viewport: { once: true },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as any },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-28 md:px-10 md:pb-20 md:pt-36">
        <div className="relative mx-auto min-h-[1980px] w-full">
          <h1 className="absolute left-[102px] top-[361px] [transform-origin:top_left] -rotate-90 font-silkscreen text-[64px] font-normal leading-[1.28]">
            Origin
          </h1>
          <h2 className="absolute left-[122px] top-[420px] font-silkscreen text-[64px] font-normal leading-[1.28]">
            stack
          </h2>

          <motion.p
            {...fadeUp}
            className="absolute left-[208px] top-[113px] max-w-[840px] text-[24px] leading-[1.3] font-sans"
          >
            The project started as an assignment brief for our Human Science class.
            Our job was to interview a classmate about their childhood memories, note
            down the response, and create a map from the information at hand. We were
            given the liberty to choose any medium to create the map and I decided to
            go ahead with a website build. My reasoning was simple, a website offers
            a more dynamic and interactive experience for the viewer (user) which a
            static infographic or illustration can simply not offer.
          </motion.p>

          {/* Stack — Gemini */}
          <img
            src="/Gemini%20Logo.svg"
            alt="Gemini Logo"
            className="absolute left-[147px] top-[551px] h-[50px] w-[50px]"
          />
          <p className="absolute left-[218px] top-[545px] w-[137px] whitespace-pre-line text-[24px] leading-[1.3] font-sans">
            {"Illustrations\nPlanning"}
          </p>

          {/* Stack — Figma */}
          <img
            src="/Figma%20Logo.svg"
            alt="Figma Logo"
            className="absolute left-[520px] top-[551px] h-[50px] w-[33px]"
          />
          <p className="absolute left-[566px] top-[544px] w-[240px] whitespace-pre-line text-[24px] leading-[1.3] font-sans">
            {"Static screens\nCreating UI Elements"}
          </p>

          {/* Stack — Cursor */}
          <img
            src="/Cursor%20Logo.svg"
            alt="Cursor Logo"
            className="absolute left-[865px] top-[541px] h-[70px] w-[70px]"
          />
          <p className="absolute left-[948px] top-[541px] w-[392px] whitespace-pre-line text-[24px] leading-[1.3] font-sans">
            {"Animation\nTurning Design into editable Code"}
          </p>

          <h2 className="absolute left-[122px] top-[790px] font-silkscreen text-[64px] font-normal leading-[1.28]">
            philosophy
          </h2>

          <motion.p
            {...fadeUp}
            className="absolute left-[117px] top-[902px] max-w-[1206px] text-[24px] leading-[1.3] font-sans"
          >
            The next part was in figuring out what style I wanted to implement for
            the map design. My first thought was to try and do a PCB-inspired
            (Printed Circuit Board) layout and connect circuit board elements to my
            friend&apos;s childhood memories and locations.
          </motion.p>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            className="absolute left-[117px] top-[1025px] max-w-[1205px] text-[24px] leading-[1.3] font-sans"
          >
            The home is representative of a CPU (core of all operations) in that
            it&apos;s the point from where all other components radiate from. Her
            personal struggle with dyslexia and encounter with the stray dogs can be
            represented by resistors on a circuit board as they were hurdles she had
            to overcome. On the other hand, memories of her encouraging mathematics
            teacher and childhood friend who comforted her can be represented by
            capacitors, essentially storing positive energy.
          </motion.p>

          <h2 className="absolute left-[122px] top-[1279px] font-silkscreen text-[64px] font-normal leading-[1.28]">
            Aesthetic
          </h2>
          <motion.p
            {...fadeUp}
            className="absolute left-[122px] top-[1391px] max-w-[1206px] text-[24px] leading-[1.3] font-sans"
          >
            Isometric, dark atmosphere, anime, moody/melancholic, and pixelated is
            what I would use to describe the art style. It&apos;s quite hyper specific
            but that was the kind of look I wanted to go for the buildings and such.
            Of course, I have to be upfront about the use of Generative AI (Google&apos;s
            Gemini NanoBanana) in creating the assets. Illustration is not my
            strongest area in design and as such AI has helped me tremendously in
            that regard. Now I act more as a design curator/director, being able to
            focus on the big picture rather than spending a lot of time on minute
            details. This is not to say details don&apos;t matter, of course they do but
            often times it can make us lose focus on the main purpose of creating a
            piece.
          </motion.p>

          <h2 className="absolute left-[122px] top-[1693px] font-silkscreen text-[64px] font-normal leading-[1.28]">
            Audio
          </h2>
          <motion.p
            {...fadeUp}
            className="absolute left-[122px] top-[1805px] max-w-[1208px] whitespace-pre-line text-[24px] leading-[1.3] font-sans"
          >
            {"The idea of having music playing in the background here came from the realization that I usually have music accompany me while I'm working on solo projects. I wanted the site visitor / viewer to experience\nwhat I felt while creating the website through music. It also helps create a mood in regards to the site viewing experience."}
          </motion.p>
        </div>
      </div>
    </main>
  );
}
