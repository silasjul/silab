import { VantaBackground } from "@/components/VantaFog";
import { getDictionary } from "@/lib/dictionaries";
import Hero from "@/components/hero/Hero";

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'da' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-black">
      <VantaBackground />
      <main>
        <Hero dict={dict.hero} />
      </main>
    </div>
  );
}
