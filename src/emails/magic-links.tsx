import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import * as React from "react";

interface MagicLinkEmailProps {
    magicLink?: string;
}

const extractToken = (magicLink: string) => {
    const url = new URL(magicLink);
    return url.searchParams.get("token");
}

export const MagicLinkEmail = ({
    magicLink,
}: MagicLinkEmailProps) => (
    <Tailwind>
        <Head />
        <Preview>Ihr Anmeldelink für FixMyTown ist hier</Preview>
        <Body className="bg-white font-sans">
            <Container className="mx-auto px-6 py-4 w-[600px]">
                <Heading className="text-2xl font-bold mt-8 mb-4">
                    🪄 Ihr Anmeldelink für <span className="text-[#FF6363] text-2xl italic">FixMyTown</span> 🪄
                </Heading>
                <Section className="my-4">
                    <Text className="text-base mb-2">
                        <Link className="text-[#FF6363] underline" href={magicLink}>
                            👉 Hier klicken zum Anmelden 👈
                        </Link>
                    </Text>
                    <Text className="text-base mb-2">
                        Oder geben Sie diesen Code in die Anmeldeseite ein:
                    </Text>
                    <Text className="text-base mb-2">
                        {extractToken(magicLink ?? "")}
                    </Text>
                    <Text className="text-base mb-2">
                        Falls Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.
                    </Text>
                </Section>
                <Text className="text-base mb-4">
                    Mit freundlichen Grüßen,
                    <br />- Ihr FixMyTown Team
                </Text>
                <Hr className="border-gray-200 my-3" />
                <Text className="text-gray-500 text-xs leading-none mb-0">
                    FixMyTown
                </Text>
            </Container>
        </Body>
    </Tailwind>
);

MagicLinkEmail.PreviewProps = {
    magicLink: "https://fixmy.town",
} as MagicLinkEmailProps;

export default MagicLinkEmail;

