export default function About() {
  const cards = [
    ["Our Mission", "Make premium wireless audio easier to discover, understand, and enjoy."],
    ["Our Vision", "Build a trusted modern audio store that puts quality and customer experience first."],
    ["Why NightWave?", "We combine clean design, useful product information, responsive support, and a memorable shopping experience."],
  ];

  return (
    <main>
      <section className="mx-auto max-w-5xl px-5 py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-400">About Us</p>
        <h1 className="mt-4 text-5xl font-black">Sound Should Be Felt.</h1>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-400">
          NightWave is a modern wireless-audio store focused on making premium listening
          experiences accessible through thoughtful design and customer-first service.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 md:grid-cols-3">
        {cards.map(([title, text]) => (
          <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-4 leading-7 text-slate-400">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
