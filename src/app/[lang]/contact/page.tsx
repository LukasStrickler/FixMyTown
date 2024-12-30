import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";
import { Footer } from "@/components/footer";

export default async function ContactPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="py-12 bg-background flex-grow">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">{dictionary.pages.contact.heroText}</h2>
          <p className="mb-4">
            {dictionary.pages.contact.description}
          </p>

          <h3 className="text-lg font-semibold mt-6">{dictionary.pages.contact.contactInfoTitle}</h3>
          <p className="mb-4">
            {dictionary.pages.contact.contactInfoText}
          </p>

          <h4 className="text-md font-medium mt-6">{dictionary.pages.contact.supportTitle}</h4>
          <p className="mb-4">
            {dictionary.pages.contact.supportEmailText} 
            <a 
              href="mailto:support@fixmytown.com?subject=Support%20&%20Collaboration%20Inquiry" 
              className="text-accent"
            >
              support@fixmytown.com
            </a>
          </p>

          <h4 className="text-md font-medium mt-6">{dictionary.pages.contact.inquiriesTitle}</h4>
          <p className="mb-4">
            {dictionary.pages.contact.inquiriesEmailText} 
            <a 
              href="mailto:info@fixmytown.com?subject=General%20Inquiry" 
              className="text-accent"
            >
              info@fixmytown.com
            </a>
          </p>

          <h3 className="text-lg font-semibold mt-6">{dictionary.pages.contact.additionalInfoTitle}</h3>
          <p>
            {dictionary.pages.contact.additionalInfoText}
          </p>
        </div>
      </section>
      <Footer dictionary={dictionary} />
    </div>
  );
}
