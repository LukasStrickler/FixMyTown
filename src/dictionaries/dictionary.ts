export interface Dictionary {
    index: {
        helloWorld: string;
    },
    modeToggle: {
        title: string;
        dark: string;
        light: string;
        system: string;
    },
    adminPages: {
        userAdministration: {
            mainTitle: string;
            filterByEmailText: string;
            filterByRoleText: string;
            filterByNameText: string;
            IDColumnTitle: string;
            nameColumnTitle: string;
            emailColumnTitle: string;
            emailVerifiedColumnTitle: string;
            imageColumnTitle: string;
            roleColumnTitle: string;

            toastMessages: {
                successTitle: string;
                successMessage: string;
                errorTitle: string;
                errorMessage: string;
            };
            actions: {
                copyID: string;
                changeRoleToAdmin: string;
                changeRoleToWorker: string;
                changeRoleToUser: string;
            }
        }
    },    
    userToggle: {
        account: string;
        notifications: string;
        logout: string;
    },
    workspaces: {
        workspaceSwitcherTitle: string;
        more: string;
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
                    folderTitle: string;
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
                language: string;
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
    },
    form: {
        type: string;
        priority: string;
        location: string;
        name: string;
        description: string;
        submit: string;
        submitInfo: string;
        submitReadyInfo: string;
        selectType: string;
        selectPriority: string;
        success: string;
        successDescription: string;
        images: string;
        upload: {
            title: string;
            description: string;
            dropHere: string;
            error: string;
            errorDescription: string;
            converting: string;
        },
        uploadingImages: string;
        submitting: string;
        validatingData: string;
        processingImages: string;
        savingReport: string;
        redirecting: string;
        uploadSuccess: string;
        uploadSuccessDescription: string;
        uploadError: string;
        generalError: string;
    },
    popup: {
        title: string;
        message: string;
        inputPlaceholder: string;
        saveButton: string;
        successTitle: string;
        successMessage: string;
        errorTitle: string;
        termsAndConditions: string;
        errorMessageA: string;
        errorMessageB: string;
        errorMessageC: string;
    }    
}