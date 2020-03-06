"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationRoutesFactory = (builder, opts) => {
    // internal routes for logout, device_flow, ... are not described here
    const { getURL } = builder.app;
    const commonRoutes = {
        // find email
        "find_email": {
            url: getURL("/find_email"),
            method: "GET",
            synchronous: true,
        },
        "find_email.check_phone": {
            url: getURL("/find_email/check_phone"),
            method: "POST",
            payload: {
                phone_number: "",
            },
        },
        // verify phone
        "verify_phone": {
            url: getURL("/verify_phone/send"),
            method: "GET",
            synchronous: true,
        },
        "verify_phone.send": {
            url: getURL("/verify_phone/send"),
            method: "POST",
            payload: {
                phone_number: "",
                register: false,
                login: false,
            },
        },
        "verify_phone.verify": {
            url: getURL("/verify_phone/verify"),
            method: "POST",
            payload: {
                phone_number: "",
                secret: "",
            },
        },
        // register
        "register": {
            url: getURL("/register"),
            method: "GET",
            synchronous: true,
        },
        "register.validate": {
            url: getURL("/register/validate"),
            method: "POST",
            payload: {
                claims: {
                    email: "",
                    name: "",
                    phone_number: "",
                    birthdate: "",
                    gender: "",
                },
                credentials: {
                    password: "",
                    password_confirmation: "",
                },
                scope: ["email", "profile", "phone", "birthdate", "gender"],
            },
        },
    };
    // available for login/consent prompt only
    const loginOrConsentPromptRoutes = {
        "login": {
            url: getURL("/login"),
            method: "GET",
            synchronous: true,
            payload: {
                email: "",
            },
        },
        "login.check_email": {
            url: getURL("/login/check_email"),
            method: "POST",
            payload: {
                email: "",
            },
        },
        "login.check_password": {
            url: getURL("/login/check_password"),
            method: "POST",
            payload: {
                email: "",
                password: "",
            },
        },
        "login.abort": {
            url: getURL(`/abort`),
            method: "POST",
        },
        "login.federate": {
            url: getURL(`/federate`),
            method: "POST",
            payload: {
                provider: "",
            },
            synchronous: true,
        },
    };
    // available for consent prompt only
    const consentPromptRoutes = {
        "consent": {
            url: getURL("/consent"),
            method: "GET",
            synchronous: true,
        },
        "consent.accept": {
            url: getURL("/consent/accept"),
            method: "POST",
            payload: {
                rejected_scopes: [],
                rejected_claims: [],
            },
        },
        "consent.reject": {
            url: getURL(`/abort`),
            method: "POST",
        },
        "consent.change_account": {
            url: getURL("/login"),
            method: "GET",
            payload: {
                change_account: "true",
            },
            synchronous: true,
        },
    };
    return (promptName) => {
        return {
            ...commonRoutes,
            ...(promptName === "consent" ? consentPromptRoutes : {}),
            ...(promptName === "login" || promptName === "consent" ? loginOrConsentPromptRoutes : {}),
        };
    };
};
//# sourceMappingURL=routes.js.map