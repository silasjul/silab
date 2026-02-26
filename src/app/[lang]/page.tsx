import { VantaBackground } from "@/components/VantaFog";
import { getDictionary } from "@/lib/dictionaries";

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'da' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen">
      <VantaBackground />
    </main>
  );
}
