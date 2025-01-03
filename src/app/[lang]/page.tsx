import Link from "next/link";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { getDictionary } from "../../get-dictionary";
import { type Locale } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Brush, Car } from "lucide-react";
import { WobbleCard } from "@/components/ui/wobble-card";
import { Footer } from "@/components/footer";
import Image from "next/image";

export default async function IndexPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const session = await auth();

  return (
    <HydrateClient>
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden bg-background">
        <div className="pattern-dots absolute inset-0 opacity-5" />
        <div className="container px-4 mx-auto relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                {dictionary.pages.landing.heroText}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                {dictionary.pages.landing.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" asChild>
                  <Link href={`/${lang}/report`}>
                    {dictionary.pages.landing.reportButton}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!session && (
                  <Button variant="outline" size="lg" asChild>
                    <Link href={`/${lang}/login`}>
                      {dictionary.pages.auth.login.title}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-lg blur-3xl" />
                <Image
                  src="/hero-image.webp"
                  height={420}
                  width={730}
                  alt={dictionary.pages.landing.heroImageAlt}
                  className="relative rounded-lg shadow-2xl w-full"
                  placeholder="blur"
                  blurDataURL="/hero-image-blur.webp"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 560px"
                  priority
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with curved top */}
      <section className="relative py-32">
        <div className="absolute inset-0 mt-[168px] bg-muted/50 hidden md:block" style={{
          clipPath: "ellipse(100% 100% at 50% 100%)",
          transform: "translateY(-30%)",
          height: "100%"
        }} />

        <div className="absolute inset-0 mt-[353px] bg-muted/50 block md:hidden" style={{
          clipPath: "ellipse(100% 100% at 50% 100%)",
          transform: "translateY(-30%)",
          height: "95%"
        }} />

        <div className="container px-4 mx-auto relative">
          <h2 className="text-3xl font-bold text-center mb-12">
            {dictionary.pages.landing.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <WobbleCard containerClassName="col-span-1 min-h-[200px]">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                {dictionary.pages.landing.feature1Title}
              </h3>
              <p className="text-gray-500 dark:text-neutral-300">
                {dictionary.pages.landing.feature1Text}
              </p>
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 min-h-[200px]">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Brush className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                {dictionary.pages.landing.feature2Title}
              </h3>
              <p className="text-gray-500 dark:text-neutral-300">
                {dictionary.pages.landing.feature2Text}
              </p>
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 min-h-[200px]">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                {dictionary.pages.landing.feature3Title}
              </h3>
              <p className="text-gray-500 dark:text-neutral-300">
                {dictionary.pages.landing.feature3Text}
              </p>
            </WobbleCard>
          </div>
        </div>
      </section>

      {/* CTA Section - updated background and added wave overlay */}
      <section className="relative py-44">

        {/* Mesh background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(at 40% 40%, rgb(0, 0, 0) 0, transparent 50%),
              radial-gradient(at 90% 90%, rgb(0, 0, 0) 0, transparent 50%)`,
          }}
          data-theme="light"
        />
        <div
          className="absolute inset-0 opacity-10 hidden dark:block"
          style={{
            backgroundImage: `radial-gradient(at 40% 40%, rgb(255, 255, 255) 0, transparent 50%),
              radial-gradient(at 90% 90%, rgb(255, 255, 255) 0, transparent 50%)`,
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 block dark:hidden"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`
          }}
        />

        {/* Wave pattern remains the same */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225-2.51c-.383-.358-.79-.713-1.225-1.072L82.205 20l2.51-.14L86 20h5.892c.326-.078.632-.165.917-.25 1.544-.457 2.786-.973 3.793-1.57.7-.398 1.254-.837 1.657-1.315C92.88 10.405 87.863 5.65 80 5.65c-7.857 0-12.874 4.75-18.266 11.215-.403.478-.958.917-1.657 1.315-1.007.597-2.25 1.113-3.793 1.57-.285.085-.59.172-.917.25H50z' fill='%23ffffff' fill-rule='evenodd' fill-opacity='1' opacity='.05'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'bottom',
          }}
        />

        <div className="container px-4 mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
            {dictionary.pages.landing.heroText}
          </h2>
          <Button
            size="lg"
            variant="ghost"
            className="backdrop-blur-xs bg-white/10 hover:bg-white/30 hover:backdrop-blur-sm transition-colors"
            asChild
          >
            <Link href={`/${lang}/report`}>
              {dictionary.pages.landing.reportButton}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      <Footer dictionary={dictionary} />
    </HydrateClient>
  );
}
