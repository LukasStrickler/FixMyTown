// External Libraries
import Image from "next/image";

// Components
import { Footer } from "@/components/footer";

// Types
import { type Locale } from "@/i18n-config";

// Providers
import { getDictionary } from "@/server/get-dictionary";

type Props = {
  params: { lang: Locale };
};

export default async function AboutPageClient({ params: { lang } }: Props) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="min-h-screen flex flex-col">
      <section className="py-12 bg-background flex-grow">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">{dictionary.pages.about.heroText}</h2>
          <p className="mb-4">
            {dictionary.pages.about.description}
          </p>

          <h3 className="text-lg font-semibold mt-6">{dictionary.pages.about.missionTitle}</h3>
          <p className="mb-4">
            {dictionary.pages.about.missionText}
          </p>
          <p className="mb-4">
            {dictionary.pages.about.companyDescription}
          </p>

          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-lg blur-3xl" />
              <Image
                src="/hero-image.webp"
                height={420}
                width={730}
                alt="City maintenance"
                className="relative rounded-lg shadow-2xl"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6">{dictionary.pages.about.goalsTitle}</h3>
          <ul className="list-disc list-inside mt-2">
            <li className="mb-2">
              <strong>{dictionary.pages.about.feature1Title}:</strong> {dictionary.pages.about.feature1Description}
            </li>
            <li className="mb-2">
              <strong>{dictionary.pages.about.feature2Title}:</strong> {dictionary.pages.about.feature2Description}
            </li>
            <li className="mb-2">
              <strong>{dictionary.pages.about.feature3Title}:</strong> {dictionary.pages.about.feature3Description}
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">{dictionary.pages.about.additionalInfoTitle}</h3>
          <p>
            {dictionary.pages.about.additionalInfoText}
          </p>
        </div>
      </section>
      <Footer dictionary={dictionary} />
    </div>
  );
}
