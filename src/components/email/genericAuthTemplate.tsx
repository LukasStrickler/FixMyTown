import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Button,
    Img,
  } from "@react-email/components";

  import * as styles from "./styles";

  
interface genericTemplateProps {
  firstName: string;
  authCode: number;
}

  const genericTemplate: React.FC<Readonly<genericTemplateProps>> = ({
    firstName,
    authCode,
  }) => {
    return (
      <Html>
        <Head />
        <Preview>Sign in to fixmy.town</Preview>
        <Body style={styles.main}>
          <Container style={styles.container}>
            <Img style={styles.logo} src="https://projects.jstaehle.de/assets/images/hwg_only_temporary_FIXMYTOWN_logo.png" alt="logo" />
            <Text style={styles.company}>FixMy.Town</Text>
            <Heading style={styles.codeTitle}>Hello {firstName}, here is your authentication code</Heading>
            <Text style={styles.codeDescription}>
              Enter it in your open browser window or press the sign in button.
              This code will expire in 15 minutes.
            </Text>
            <Section style={styles.codeContainer}>
              <Heading style={styles.codeStyle}>{authCode}</Heading>
            </Section>
            <Section style={styles.buttonContainer}>
              <Button href="{authLink}" style={styles.button}>
                Sign in
              </Button>
            </Section>
            <Text style={styles.paragraph}>Not expecting this email?</Text>
            <Text style={styles.paragraph}>
              Contact{" "}
              <Link href="mailto:support@fixmy.town" style={styles.link}>
              support@fixmy.town
              </Link>{" "}
              if you did not request this code.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default genericTemplate;
  