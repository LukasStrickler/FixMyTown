import Link from "next/link";
import { getDictionary } from '@/get-dictionary';
import { type Locale } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Brush, Car } from "lucide-react";
import { Footer } from "@/components/footer";
import Image from "next/image";

export default async function IndexPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
      <div>
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
                      </div>
                  </div>
                  <div className="flex-1">
                      <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-lg blur-3xl" />
                          <Image
                              src="/hero-image.webp"
                              height={420}
                              width={730}
                              alt="City maintenance"
                              className="relative rounded-lg shadow-2xl" />
                      </div>
                  </div>
              </div>
          </div>
      </section>
      <section className="relative py-32">
              <div className="absolute inset-0 mt-44 bg-muted/50 hidden md:block" style={{
                  clipPath: "ellipse(100% 100% at 50% 100%)",
                  transform: "translateY(-30%)",
                  height: "100%"
              }} />

              <div className="absolute inset-0 mt-[385px] bg-muted/50 block md:hidden" style={{
                  clipPath: "ellipse(100% 100% at 50% 100%)",
                  transform: "translateY(-30%)",
                  height: "95%"
              }} />

              </section>
              <Footer dictionary={dictionary} />
              </div>
              );
            }