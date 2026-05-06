import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 md:px-16">
        <h1 className="font-[var(--font-silkscreen)] text-4xl">CONTACT ME_</h1>
        <p className="mt-4 max-w-xl font-[var(--font-space-grotesk)] text-base text-zinc-300">
          Placeholder route for contact details.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex w-fit border border-zinc-700 px-4 py-2 font-[var(--font-silkscreen)] text-sm tracking-wide text-white transition-colors hover:bg-zinc-900"
        >
          BACK TO HUB
        </Link>
      </div>
    </main>
  );
}
