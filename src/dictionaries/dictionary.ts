export interface Dictionary {
    index: {
        helloWorld: string;
    },
    auth: {
        login: {
            title: string;
            description: string;
            emailLabel: string;
            emailPlaceholder: string;
            submit: string;
            backToHome: string;
        },
        verifyRequest: {
            title: string;
            description: string;
            backToHome: string;
            checkEmail: string;
            enterCode: string;
            enterCodeInput: string;
            verifyButton: string;
            resendIn: string;
            resend: string;
        },
        error: {
            title: string;
            description: string;
            Configuration: string;
            Verification: string;
            LogoutError: string;
            Default: string;
            backToHome: string;
        },
        account: {
            title: string;
            description: string;
            profile: {
                title: string;
                email: string;
                role: string;
                signOut: string;
                backToWorkspace: string;
            };
            settings: {
                title: string;
                theme: string;
            };
        }
    }
}