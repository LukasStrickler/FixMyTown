import { getDictionary } from "@/server/get-dictionary";
import { type Locale } from "@/i18n-config";
import { Footer } from "@/components/footer";

export default async function TermsAndConditionsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  const sections = [
    {
      title: dictionary.pages.termsAndConditions.introTitle,
      description: dictionary.pages.termsAndConditions.introDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.generalTermsTitle,
      description: dictionary.pages.termsAndConditions.generalTermsDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.accountRegistrationTitle,
      description: dictionary.pages.termsAndConditions.accountRegistrationDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.useOfPlatformTitle,
      description: dictionary.pages.termsAndConditions.useOfPlatformDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.subscriptionAndFeesTitle,
      description: dictionary.pages.termsAndConditions.subscriptionAndFeesDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.paymentMethodsTitle,
      description: dictionary.pages.termsAndConditions.paymentMethodsDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.terminationAndAccountDeletionTitle,
      description: dictionary.pages.termsAndConditions.terminationAndAccountDeletionDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.intellectualPropertyTitle,
      description: dictionary.pages.termsAndConditions.intellectualPropertyDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.liabilityTitle,
      description: dictionary.pages.termsAndConditions.liabilityDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.dataProtectionTitle,
      description: dictionary.pages.termsAndConditions.dataProtectionDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.disputeResolutionTitle,
      description: dictionary.pages.termsAndConditions.disputeResolutionDescription,
    },
    {
      title: dictionary.pages.termsAndConditions.finalProvisionsTitle,
      description: dictionary.pages.termsAndConditions.finalProvisionsDescription,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <section className="py-12 bg-background flex-grow">
        <div className="container px-4 mx-auto">
          <h1 className="text-2xl font-bold mb-6">{dictionary.pages.termsAndConditions.heroText}</h1>

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
