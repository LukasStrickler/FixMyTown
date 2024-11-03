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

  
interface genericTemplateProps {
  firstName: string;
}

  const genericTemplate: React.FC<Readonly<genericTemplateProps>> = ({
    firstName,
  }) => {
    return (
      <Html>
        <Head />
        <Preview>Sign in to fixmy.town</Preview>
        <Body style={main}>
          <Container style={container}>
            <Img style={logo} src="https://projects.jstaehle.de/assets/images/hwg_only_temporary_FIXMYTOWN_logo.png" alt="logo" />
            <Text style={company}>FixMy.Town</Text>
            <Heading style={codeTitle}>Hello {firstName}, thank you for submitting your claim to the portal.</Heading>
            <Text style={codeDescription}>
              Enter it in your open browser window or press the sign in button.
              This code will expire in 15 minutes.
            </Text>
            <Section style={codeContainer}>
              <Heading style={codeStyle}>564873</Heading>
            </Section>
            <Section style={buttonContainer}>
              <Button href="https://www.fixmy.town/" style={button}>
                Sign in
              </Button>
            </Section>
            <Text style={paragraph}>Not expecting this email?</Text>
            <Text style={paragraph}>
              Contact{" "}
              <Link href="mailto:support@fixmy.town" style={link}>
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
  
  const main = {
    backgroundColor: "#ffffff",
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
    textAlign: "center" as const,
  };
  
  const container = {
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginTop: "20px",
    width: "480px",
    maxWidth: "100%",
    margin: "0 auto",
    padding: "12% 6%",
  };

  const logo = {
    width: "350px",
    margin: "auto",
    padding: 50,
  }
  
  const company = {
    fontWeight: "bold",
    fontSize: "18px",
    textAlign: "center" as const,
  };
  
  const codeTitle = {
    textAlign: "center" as const,
  };
  
  const codeDescription = {
    textAlign: "center" as const,
  };
  
  const codeContainer = {
    background: "rgba(0,0,0,.05)",
    borderRadius: "4px",
    margin: "16px auto 14px",
    verticalAlign: "middle",
    width: "280px",
    maxWidth: "100%",
  };
  
  const codeStyle = {
    color: "#000",
    display: "inline-block",
    paddingBottom: "8px",
    paddingTop: "8px",
    margin: "0 auto",
    width: "100%",
    textAlign: "center" as const,
    letterSpacing: "8px",
  };
  
  const buttonContainer = {
    margin: "27px auto",
    width: "auto",
  };
  
  const button = {
    backgroundColor: "#5e6ad2",
    borderRadius: "3px",
    fontWeight: "600",
    color: "#fff",
    textAlign: "center" as const,
    padding: "12px 24px",
    margin: "0 auto",
  };
  
  const paragraph = {
    color: "#444",
    letterSpacing: "0",
    padding: "0 40px",
    margin: "0",
    textAlign: "center" as const,
  };
  
  const link = {
    color: "#444",
    textDecoration: "underline",
  };
  