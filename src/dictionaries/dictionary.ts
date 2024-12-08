export interface Dictionary {
    index: {
        helloWorld: string;
    },
    workspaces: {
        adminWorkspace: {
            adminWorkspaceTitle: string;
            projects:{
                userAdministration: string;
            }
        },
        workerWorkspace: {            
            workerWorkspaceTitle: string;
            projects:{
                reportCardView: string;
                reportEdit: string;
            }
        },
        userWorkspace: {            
            userWorkspaceTitle: string;
            navItems: {
                myReports: {
                    folderTitle: string,
                    reportState: string,
                    closedReports: string,
                    myReports: string,
                }
                reportSomething: {
                    folderTitle: string
                    defectsDamages: string;
                    contaminations: string;
                    parkingViolations: string;
                }
            };
        },

    }
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
    },
    components: {
        locationPicker: {
            title: string;
            description: string;
            help: string;
            status: {
                locked: string;
                unlocked: string;
            };
            actions: {
                lock: string;
                unlock: string;
                clear: string;
            };
            info: {
                latitude: string;
                longitude: string;
                address: string;
                status: string;
            };
            loading: string;
        }
    }
}