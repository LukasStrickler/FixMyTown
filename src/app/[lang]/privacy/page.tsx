import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import { Footer } from "@/components/footer";

export default async function PrivacyPolicyPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  const sections = [
    {
      title: dictionary.pages.privacy.generalNotesTitle,
      description: dictionary.pages.privacy.generalNotesDescription,
    },
    {
      title: dictionary.pages.privacy.dataCollectionTitle,
      description: dictionary.pages.privacy.dataCollectionDescription,
    },
    {
      title: dictionary.pages.privacy.hostingTitle,
      description: dictionary.pages.privacy.hostingDescription,
    },
    {
      title: dictionary.pages.privacy.rightsTitle,
      description: dictionary.pages.privacy.rightsDescription,
    },
    {
      title: dictionary.pages.privacy.legalBasisTitle,
      description: dictionary.pages.privacy.legalBasisDescription,
    },
    {
      title: dictionary.pages.privacy.cookieTitle,
      description: dictionary.pages.privacy.cookieDescription,
    },
    {
      title: dictionary.pages.privacy.logFilesTitle,
      description: dictionary.pages.privacy.logFilesDescription,
    },
    {
      title: dictionary.pages.privacy.contactFormTitle,
      description: dictionary.pages.privacy.contactFormDescription,
    },
    {
      title: dictionary.pages.privacy.sslTitle,
      description: dictionary.pages.privacy.sslDescription,
    },
    {
      title: dictionary.pages.privacy.creditsTitle,
      description: dictionary.pages.privacy.creditsDescription,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <section className="py-12 bg-background flex-grow">
        <div className="container px-4 mx-auto">
          <h1 className="text-2xl font-bold mb-6">{dictionary.pages.privacy.heroText}</h1>

          {sections.map((section, index) => (
            <div key={index} className="mt-6">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              {section.description.map((text, idx) => (
                <p key={idx} className="mt-2">{text}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
      <Footer dictionary={dictionary} />
    </div>
  );
}
