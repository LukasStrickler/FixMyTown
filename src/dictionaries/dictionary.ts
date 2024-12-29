export interface Dictionary {
    // Pages
    pages: {
        // Landing page
        landing: {
            heroText: string;
            heroDescription: string;
            reportButton: string;
            featuresTitle: string;
            feature1Title: string;
            feature1Text: string;
            feature2Title: string;
            feature2Text: string;
            feature3Title: string;
            feature3Text: string;
        },
        // Auth pages
        auth: {
            login: {
                title: string;
                description: string;
                emailLabel: string;
                emailPlaceholder: string;
                submit: string;
                submitLoading: string;
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
                DeleteAccountError: string;
            },
            account: {
                title: string;
                description: string;
                profile: {
                    title: string;
                    email: string;
                    role: string;
                    signOut: string;
                    deleteAccount: string;
                    deleteAccountConfirm: string;
                    name: string;
                    editName: string;
                },
                settings: {
                    title: string;
                    theme: string;
                    language: string;
                },
                deleteDialog: {
                    title: string;
                    description: string;
                    cancel: string;
                    confirm: string;
                },
                editNameDialog: {
                    title: string;
                    description: string;
                    nameLabel: string;
                    namePlaceholder: string;
                    cancel: string;
                    confirm: string;
                    nameTooLong: string;
                    nameTooShort: string;
                    nameEmpty: string;
                    success: string;
                    validInput: string;
                }
            }
        },
        // Admin pages
        admin: {
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
                },
                actions: {
                    actionsTitle: string;
                    copyID: string;
                    changeRoleToAdmin: string;
                    changeRoleToWorker: string;
                    changeRoleToUser: string;
                }
            }
        }
    },

    // Layout components
    layout: {
        navigation: {
            workspaces: {
                workspaceSwitcherTitle: string;
                more: string;
                adminWorkspace: {
                    adminWorkspaceTitle: string;
                    projects: {
                        userAdministration: string;
                    }
                },
                workerWorkspace: {
                    workerWorkspaceTitle: string;
                    projects: {
                        reportMapView: string;
                        reportTableView: string;
                    }
                },
                userWorkspace: {
                    userWorkspaceTitle: string;
                    navItems: {
                        myReports: {
                            folderTitle: string;
                            myReports: string;
                        },
                        reportSomething: {
                            folderTitle: string;
                            defectsDamages: string;
                            contaminations: string;
                            parkingViolations: string;
                        }
                    }
                }
            },
            userToggle: {
                account: string;
                logout: string;
            },
            modeToggle: {
                title: string;
                dark: string;
                light: string;
                system: string;
            },
            languageSwitcher: {
                text: string;
                languages: {
                    en: string;
                    de: string;
                }
            }
        },
        footer: {
            contact: string;
            about: string;
            imprint: string;
            privacy: string;
            terms: string;
        }
    },

    // Reusable components
    components: {
        reportDetails: {
            description: string;
            history: string;
            location: string;
            comment: string;
            statuses: {
                title: string;
                placeholderText: string;
                updateButtonText: string;
            },
            prios: {
                title: string;
                placeholderText: string;
                updateButtonText: string;
            }
        },
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
        },
        mapLegend: {
            title: string;
            typeTitle: string;
            statusTitle: string;
            priorityTitle: string;
        },
        reportTable: {
            search: {
                placeholder: string;
            },
            columns: {
                name: string;
                description: string;
                type: string;
                status: string;
                pictures: string;
                location: string;
                createdAt: string;
            },
            actions: {
                label: string;
                copyId: string;
                viewDetails: string;
                viewLocation: string;
                copyAll: string;
            },
            noResults: string;
        },
        reportForm: {
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
        }
    },
    // Emails
    emails: {
        signature: {
            greeting: string;
            team: string;
        },
        magicLink: {
            mailData: {
                subject: string;
                preview: string;
            },
            content: {
                heading: string;
                codeInstructions: string;
                disclaimerText1: string;
                disclaimerText2: string;
                disclaimerLink: string;
                disclaimerText3: string;
            }
        },
        creationNotification: {
            mailData: {
                subject: string;
                preview: string;
            },
            content: {
                greeting: string;
                reportReceived: string;
                thankYou: string;
                promise: string;
            }
        },
        statusUpdate: {
            mailData: {
                subject: string;
                preview: string;
            },
            content: {
                greeting: string;
                reportTitle: string;
                newStatus: string;
                learnMore: string;
            }
        }
    },
    // Common/shared strings
    common: {
        seeDetails: string;
        backToLanding: string;
    },

    // Metadata of the report
    metadata: {
        types: {
            "1": { name: string; description: string };
            "2": { name: string; description: string };
            "3": { name: string; description: string };
        },
        statuses: {
            "1": { name: string; description: string };
            "2": { name: string; description: string };
            "3": { name: string; description: string };
            "4": { name: string; description: string };
        },
        prios: {
            "0": { name: string; description: string };
            "1": { name: string; description: string };
            "2": { name: string; description: string };
            "3": { name: string; description: string };
        }
    },
    reports: {
        details: {
            reportId: string;
            status: string;
            createdAt: string;
            category: string;
            priority: string;
            assignedTo: string;
            lastUpdated: string;
            location: string;
            department: string;
            description: string;
            notes: string;
        }
    }
}