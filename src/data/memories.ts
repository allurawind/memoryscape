export interface DescriptionSegment {
  text: string;
  href?: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  /** Optional rich text segments. When present, used instead of `description`. */
  richDescription?: DescriptionSegment[];
}

export const memories: Memory[] = [
  {
    id: "house-cpu",
    title: "Early Morning Rhythms",
    description:
      "The records show a young girl who found the transition from sleep to the world difficult. Being the youngest, she lived under a protective but firm routine where a maid's assistance was required just to get her through the morning shower and onto the school bus. It was a time of high dependency, where the walls of her home provided a safety that the outside world had not yet defined.",
  },
  {
    id: "school-gemini",
    title: "Weight of the Institution",
    description:
      "Being placed in the Catholic school system proved to be a source of significant friction for her. The environment was rigid, and the young student felt the weight of expectations she wasn't yet equipped to meet. Her mother advocated fiercely for her, attempting to convince the principal that she simply needed time to find her footing, but the institution remained a place of early struggle.",
  },
  {
    id: "stray-dogs",
    title: "Fear on the Perimeter",
    description:
      "While the neighborhood was familiar, it held specific terrors for a child. The local stray dogs represented an unpredictable threat that could freeze her in her tracks. These encounters were more than just small moments; they were early lessons in navigating a world that felt much larger and more dangerous than her own backyard.",
  },
  {
    id: "grocery-store",
    title: "Solo Mission",
    description:
      "At age ten, she was granted a rare moment of independence: a walk to the local shop for milk. The mission was a mix of bravery and childhood impulse, as she secretly treated herself to chocolates along the way. However, the return trip became a trial of navigation when she took a different route and lost her bearings. Without a phone, she relied on the kindness of strangers to find her way home, choosing to keep the incident a secret to preserve her newfound freedom.",
  },
  {
    id: "dyslexia-struggle",
    title: "The Scribbled Language",
    description:
      'The school years were defined by a "glitch" in her processing — a slight dyslexia that made the alphabet feel like an enemy. Her teachers, unable to see the potential beneath the surface, often treated her with a coldness that bordered on cruelty. To this day, her mother keeps a copy of a final paper filled with the scribbles of a girl trying desperately to communicate in a language that wouldn\'t sit still.',
  },
  {
    id: "maths-teacher",
    title: "The Turning Point",
    description:
      "The intervention came from an unexpected source: her mathematics teacher. When she noticed the marks of a harsh lesson burned into the girl's hand, she didn't look away. Instead, she became a foundational pillar of support, encouraging the student to channel her confusion and pain into painting. It was this specific human connection that transformed a failing student into an artist, eventually leading her toward her current path in design.",
  },
  {
    id: "supportive-friend",
    title: "Anchor in the Opposite Direction",
    description:
      "Even in the most isolating school days, there was a quiet alliance. A close friend lived in the exact opposite direction of the school, yet provided a sense of comfort that made the daily journey bearable. This friendship acted as a stabilizer, proving that even when life feels like it's pulling you toward a place you don't belong, there are people who keep you grounded.",
  },
  {
    id: "ecole-building",
    title: "The Current Evolution",
    description:
      "The journey through those early glitches eventually led to the student finding her place at Ecole Intuit Lab. Now in her second year in Bengaluru, she is no longer the girl struggling to read subtitles — she is the one designing them.",
    richDescription: [
      {
        text: "The journey through those early glitches eventually led to the student finding her place at ",
      },
      {
        text: "Ecole Intuit Lab",
        href: "https://ecole-intuit-lab.co.in/",
      },
      {
        text: ". Now in her second year in Bengaluru, she is no longer the girl struggling to read subtitles — she is the one designing them.",
      },
    ],
  },
];

export const memoriesMap: Record<string, Memory> = Object.fromEntries(
  memories.map((m) => [m.id, m]),
);
