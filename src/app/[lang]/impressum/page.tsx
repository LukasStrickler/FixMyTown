import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import { Footer } from "@/components/footer";

export default async function IndexPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="py-12 bg-background flex-grow">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">{dictionary.pages.imprint.heroText}</h2>
          <p>fixmy.town GbR</p>
          <p>Ernst-Boehe-Str. 4</p>
          <p>c/o HWG Ludwigshafen, Studiengang IBAIT</p>
          <p>67059 Ludwigshafen am Rhein</p>
          <p className="mt-4">
            <strong>{dictionary.pages.imprint.reportButton}:</strong>
          </p>
          <p>
            Lukas Strickler<br />
            Tim Strohmenger<br />
            Paul Klarer<br />
            Lisa Sterner<br />
            Joscha Stähle
          </p>
          <h3 className="text-lg font-semibold mt-6">{dictionary.pages.imprint.featuresTitle}</h3>
          <p>E-Mail: info@fixmy.town</p>
          <h3 className="text-lg font-semibold mt-6">{dictionary.pages.imprint.feature1Title}</h3>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-link"
            >
              https://ec.europa.eu/consumers/odr/
            </a>.
            {dictionary.pages.imprint.feature2Text}
          </p>
        </div>
      </section>
      <Footer dictionary={dictionary} />
    </div>
  );
}
