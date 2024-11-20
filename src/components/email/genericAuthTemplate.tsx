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
  firstName: string;  /* example: Max */
  authCode: number;  /* example: 12345678 */
  authLink: string;  /* example: https://auth.abc.de/123456 */
  userPrompt: string;  /* example: to complete your setup */
  preview: string;  /* example: Confirm your signup for fixmy.town */
}

  const genericTemplate: React.FC<Readonly<genericTemplateProps>> = ({
    firstName,
    authCode,
    authLink,
    userPrompt,
    preview,
  }) => {
    return (
      <Html>
        <Head />
        <Preview>{preview}</Preview>
        <Body style={styles.main}>
          <Container style={styles.container}>
            <Img style={styles.logo} src="https://projects.jstaehle.de/assets/images/hwg_only_temporary_FIXMYTOWN_logo.png" alt="logo" />
            <Text style={styles.company}>FixMy.Town</Text>
            <Heading style={styles.codeTitle}>Hello {firstName}, here is your authentication code {userPrompt}</Heading>
            <Text style={styles.codeDescription}>
              Enter it in your open browser window or press the sign in button.
              This code will expire in 15 minutes.
            </Text>
            <Section style={styles.codeContainer}>
              <Heading style={styles.codeStyle}>{authCode}</Heading>
            </Section>
            <Section style={styles.buttonContainer}>
              <Button href={authLink} style={styles.button}>
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
  