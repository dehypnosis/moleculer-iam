"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koa_bodyparser_1 = tslib_1.__importDefault(require("koa-bodyparser"));
const koajs_nocache_1 = tslib_1.__importDefault(require("koajs-nocache"));
const fastest_validator_1 = tslib_1.__importDefault(require("fastest-validator"));
const awesome_phonenumber_1 = tslib_1.__importDefault(require("awesome-phonenumber"));
const provider_1 = require("../provider");
const util_1 = require("./util");
const moment_1 = tslib_1.__importDefault(require("moment"));
class InteractionFactory {
    constructor(props) {
        this.props = props;
        // create router
        this.router = new koa_router_1.default({
            prefix: "/interaction",
            sensitive: true,
            strict: false,
        });
        // apply router middleware
        this.router.use(koajs_nocache_1.default(), koa_bodyparser_1.default());
        // create validator
        this.validator = new fastest_validator_1.default();
    }
    // validate body with given schema then throw error on error
    validate(ctx, schema) {
        const errors = this.validator.validate(ctx.request.body, schema);
        if (errors !== true && errors.length > 0) {
            const error = {
                name: "validation_failed",
                message: "Failed to validate request params.",
                status: 422,
                detail: errors.reduce((fields, err) => {
                    if (!fields[err.field])
                        fields[err.field] = [];
                    const { field, message } = err;
                    fields[field].push(message);
                    return fields;
                }, {}),
            };
            throw error;
        }
    }
    interactions() {
        const { Prompt, Check, base } = provider_1.interactionPolicy;
        const defaultPrompts = base();
        return {
            url(ctx, interaction) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return `/interaction/${interaction.prompt.name}`;
                });
            },
            policy: [
                // can modify policy and add prompt like: MFA, captcha, ...
                defaultPrompts.get("login"),
                defaultPrompts.get("consent"),
            ],
        };
    }
    /* create interaction routes */
    routes(provider) {
        function url(path) {
            return `${provider.issuer}/interaction${path}`;
        }
        const { idp, app, logger } = this.props;
        const router = this.router;
        const validate = this.validate.bind(this);
        const render = app.render.bind(app);
        // common action endpoints
        const actions = {
            abort: {
                url: url(`/abort`),
                method: "POST",
                data: {},
            },
        };
        // handle error
        router.use((ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield next();
            }
            catch (error) {
                if (typeof error.status === "undefined" || error.status >= 500) {
                    logger.error(error);
                }
                // delegate error handling
                return render(ctx, { error });
            }
        }));
        const parseContext = (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // fetch interaction details
            const interaction = yield provider.interactionDetails(ctx.req, ctx.res);
            // fetch identity and client
            const user = interaction.session ? (yield idp.find(interaction.session.accountId)) : undefined;
            const client = interaction.params.client_id ? (yield provider.Client.find(interaction.params.client_id)) : undefined;
            const locals = { interaction, user, client };
            ctx.locals = locals;
            return next();
        });
        // 1. abort interactions
        router.post("/abort", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                error: "access_denied",
                error_description: "end-user aborted interaction",
            }, {
                mergeWithLastSubmission: false,
            });
            return render(ctx, {
                redirect,
            });
        }));
        // 2. handle login
        router.get("/login", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            // already signed in
            const autoLogin = user && interaction.prompt.name !== "login" && !ctx.request.query.change;
            if (autoLogin) {
                const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                    // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
                    // cancelled
                    login: {
                        account: user.id,
                        remember: true,
                    },
                }, {
                    mergeWithLastSubmission: true,
                });
                return render(ctx, { redirect });
            }
            return render(ctx, {
                interaction: {
                    name: "login",
                    action: Object.assign({ submit: {
                            url: url(`/login`),
                            method: "POST",
                            data: {
                                email: interaction.params.login_hint || "",
                            },
                        }, resetPassword: {
                            url: url(`/verify_email`),
                            method: "POST",
                            data: {
                                email: interaction.params.login_hint || "",
                                callback: "reset_password",
                            },
                        }, federate: {
                            url: url(`/federate`),
                            method: "POST",
                            data: {
                                provider: "",
                            },
                            urlencoded: true,
                        }, findEmail: {
                            url: url(`/verify_phone`),
                            method: "POST",
                            data: {
                                phone: "",
                                callback: "login",
                                test: true,
                            },
                        }, register: {
                            url: url(`/register`),
                            method: "POST",
                        } }, actions),
                    data: {
                        user: user ? yield util_1.getPublicUserProps(user) : undefined,
                        client: client ? yield util_1.getPublicClientProps(client) : undefined,
                    },
                },
            });
        }));
        // 2.1. handle login submit
        router.post("/login", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            const { email, password } = ctx.request.body;
            // 1. user enter email only
            if (typeof password === "undefined") {
                // 2. server validate email
                validate(ctx, { email: "email" });
                // 3. fetch identity
                // tslint:disable-next-line:no-shadowed-variable
                const user = yield idp.findByEmail(email);
                return render(ctx, {
                    interaction: {
                        name: "login",
                        action: Object.assign({ submit: {
                                url: url(`/login`),
                                method: "POST",
                                data: {
                                    email,
                                    password: "",
                                },
                            }, resetPassword: {
                                url: url(`/verify_email`),
                                method: "POST",
                                data: {
                                    email,
                                    callback: "reset_password",
                                },
                            } }, actions),
                        data: {
                            user: user ? yield util_1.getPublicUserProps(user) : undefined,
                            client: client ? yield util_1.getPublicClientProps(client) : undefined,
                        },
                    },
                });
            }
            // 4. user get the next page and enter password and server validate it
            validate(ctx, {
                email: "email",
                password: "string|empty:false",
            });
            // 5. check account password
            const user = yield idp.findByEmail(email);
            yield idp.assertCredentials(user, { password });
            // 6. finish interaction and give redirection uri
            const login = {
                account: user.id,
                remember: true,
            };
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
                // cancelled
                login,
            }, {
                mergeWithLastSubmission: true,
            });
            // overwrite session for consent -> change account -> login
            yield provider.setProviderSession(ctx.req, ctx.res, login);
            return render(ctx, { redirect });
        }));
        // 2.3. handle verify phone submit
        const phoneVerificationTimeoutSeconds = 180;
        router.post("/verify_phone", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            // will not send message when 'test'
            const { test = false } = ctx.request.body;
            // 1. validate body
            ctx.request.body.phone = ctx.request.body.phone ? ctx.request.body.phone.replace(/[^0-9+]/g, " ").split(" ").filter((s) => !!s).join("") : "";
            let phoneNumber;
            validate(ctx, {
                phone: {
                    type: "custom",
                    types: ["mobile", "fixed-line-or-mobile"],
                    check(value, schema) {
                        phoneNumber = new awesome_phonenumber_1.default(value, "KR"); // TODO: country code from context
                        return phoneNumber.isPossible() && schema.types.includes(phoneNumber.getType()) || [{
                                type: "phoneInvalid",
                                field: "phone",
                                message: `Invalid mobile phone number format.`,
                                actual: value,
                            }];
                    },
                },
            });
            // now number is formatted like: +82 10-1234-1234
            ctx.request.body.phone = phoneNumber.getNumber("international");
            // 2. assert user with the phone number
            const { callback, phone } = ctx.request.body;
            const user = yield idp.findByPhone(phone);
            if (!user) {
                ctx.throw(400, "Not a registered phone number.");
            }
            // 3. check too much resend
            if (!test && interaction && interaction.result && interaction.result.verifyPhone) {
                const old = interaction.result.verifyPhone;
                if (old.phone === phone && old.expiresAt && moment_1.default().isBefore(old.expiresAt)) {
                    ctx.throw(400, "Cannot resend a message before previous one expires.");
                }
            }
            // 4. create code
            const expiresAt = moment_1.default().add(phoneVerificationTimeoutSeconds, "s").toISOString();
            const code = Math.floor(Math.random() * 1000000).toString();
            if (!test) {
                // TODO: 4. send sms via adaptor props
                // 5. extend TTL and store the code
                yield interaction.save(moment_1.default().isAfter((interaction.exp / 1000) + 60 * 10, "s") ? interaction.exp + 60 * 10 : undefined);
                yield provider.interactionResult(ctx.req, ctx.res, {
                    verifyPhone: {
                        phone,
                        callback,
                        code,
                        expiresAt,
                    },
                }, {
                    mergeWithLastSubmission: true,
                });
            }
            // 5. render with submit, resend endpoint
            return render(ctx, {
                interaction: {
                    name: "verify_phone",
                    action: {
                        submit: {
                            url: url(`/verify_phone_callback`),
                            method: "POST",
                            data: {
                                code: "",
                            },
                        },
                        send: {
                            url: url(`/verify_phone`),
                            method: "POST",
                            data: Object.assign(Object.assign({}, ctx.request.body), { test: false }),
                        },
                    },
                    data: {
                        phone,
                        timeoutSeconds: phoneVerificationTimeoutSeconds,
                        // TODO: remove this
                        debug: {
                            code,
                        },
                    },
                },
            });
        }));
        // 2.4. handle verify_phone code submit
        router.post("/verify_phone_callback", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            ctx.assert(interaction && interaction.result.verifyPhone && interaction.result.verifyPhone.code, "Phone number verification session has been expired.");
            const { callback, phone, code, expiresAt } = interaction.result.verifyPhone;
            // 1. check expiration
            if (!callback || !code || !expiresAt || moment_1.default().isAfter(expiresAt)) {
                ctx.throw(400, "Verification code has expired.");
            }
            // 2. check code
            yield new Promise(resolve => setTimeout(resolve, 1000)); // prevent brute force attack
            validate(ctx, {
                code: {
                    type: "custom",
                    check(value) {
                        return value === code || [{
                                type: "codeIncorrect",
                                field: "code",
                                message: `Incorrect verification code.`,
                                actual: value,
                            }];
                    },
                },
            });
            // TODO: 3. find user and update identity phone_verified
            const user = yield idp.findByPhone(phone);
            ctx.assert(user);
            // 4. process callback interaction
            switch (callback) {
                case "login":
                    // make it user signed in
                    const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                        login: {
                            account: user.id,
                            remember: true,
                        },
                        verifyPhone: null,
                    }, {
                        mergeWithLastSubmission: true,
                    });
                    return render(ctx, { redirect });
                default:
                    ctx.throw(`Unimplemented verify_phone_callback: ${callback}`);
            }
        }));
        // 2.5. handle verify_email submit
        const emailVerificationTimeoutSeconds = 60 * 30;
        router.post("/verify_email", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");
            // 1. validate body
            validate(ctx, {
                email: "email",
            });
            // 2. assert user with the email
            const { callback, email } = ctx.request.body;
            const user = yield idp.findByEmail(email);
            if (!user) {
                ctx.throw(400, "Not a registered email address.");
            }
            // 3. check too much resend
            if (interaction && interaction.result && interaction.result.verifyEmail) {
                const old = interaction.result.verifyEmail;
                if (old.email === email && old.expiresAt && moment_1.default().isBefore(old.expiresAt)) {
                    ctx.throw(400, "Cannot resend an email before previous one expires.");
                }
            }
            // 4. create code and link
            const expiresAt = moment_1.default().add(emailVerificationTimeoutSeconds, "s").toISOString();
            const payload = {
                email,
                callback,
                user: yield util_1.getPublicUserProps(user),
                url: `${url("/verify_email_callback")}/${interaction.uid}`,
                expiresAt,
            };
            // TODO: 5. send email which includes (callbackURL) with adaptor props
            console.log(payload);
            // 6. extend TTL and store the state
            yield interaction.save(moment_1.default().isAfter((interaction.exp / 1000) + 60 * 10, "s") ? interaction.exp + 60 * 10 : undefined);
            yield provider.interactionResult(ctx.req, ctx.res, {
                verifyEmail: {
                    callback,
                    email,
                    expiresAt,
                },
            }, {
                mergeWithLastSubmission: true,
            });
            // 5. render with submit, resend endpoint
            return render(ctx, {
                interaction: {
                    name: "verify_email",
                    action: {
                        resend: {
                            url: url(`/verify_email`),
                            method: "POST",
                            data: ctx.request.body,
                        },
                    },
                    data: {
                        email,
                        timeoutSeconds: emailVerificationTimeoutSeconds,
                        // TODO: remove this
                        debug: {
                            payload,
                        },
                    },
                },
            });
        }));
        // 2.5. handle verify_email_callback link
        router.get("/verify_email_callback/:interaction_uid", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // 1. find interaction and check expiration
            const interaction = (yield provider.Interaction.find(ctx.params.interaction_uid));
            if (!interaction || !interaction.result || !interaction.result.verifyEmail || !interaction.result.verifyEmail.expiresAt || moment_1.default().isAfter(interaction.result.verifyEmail.expiresAt)) {
                ctx.throw(400, "This email verification link has expired.");
            }
            // 2. assert user with the email
            const { email, callback } = interaction.result.verifyEmail;
            const user = yield idp.findByEmail(email);
            ctx.assert(user);
            // TODO: update identity email_verified as true
            // 3. process callback interaction
            switch (callback) {
                case "reset_password":
                    // mark reset password is ready
                    interaction.result.resetPassword = {
                        email,
                    };
                    yield interaction.save();
                    return render(ctx, {
                        interaction: {
                            name: "reset_password",
                            action: {
                                submit: {
                                    url: url(`/reset_password/${interaction.uid}`),
                                    method: "POST",
                                    data: {
                                        email,
                                    },
                                },
                            },
                            data: {
                                user: yield util_1.getPublicUserProps(user),
                            },
                        },
                    });
                default:
                    ctx.throw(`Unimplemented verify_email_callback: ${callback}`);
            }
        }));
        // 2.6. handle reset_password submit
        router.post("/reset_password/:interaction_uid", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // 1. find interaction and check is ready to reset password
            const interaction = (yield provider.Interaction.find(ctx.params.interaction_uid));
            ctx.assert(interaction && interaction.result && interaction.result.resetPassword);
            // 2. assert user with the email
            const user = yield idp.findByEmail(interaction.result.resetPassword.email);
            ctx.assert(user);
            // 3. validate and update credentials
            validate(ctx, {
                password: {
                    type: "string",
                    empty: false,
                },
            });
            yield idp.updateCredentials(user, { password: ctx.request.body.password });
            // 4. forget verifyEmail state
            interaction.result.verifyEmail = null;
            yield interaction.save();
            // 5. return to initial redirection
            return render(ctx, {
                interaction: {
                    name: "reset_password_end",
                    action: {},
                    data: {
                        user: yield util_1.getPublicUserProps(user),
                    },
                },
            });
        }));
        // 2.6. handle register submit
        router.post("/register", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");
            // extend TTL
            yield interaction.save(moment_1.default().isAfter((interaction.exp / 1000) + 60 * 30, "s") ? interaction.exp + 60 * 30 : undefined);
            return render(ctx, {
                interaction: {
                    name: "register",
                    action: {
                        submit: {
                            url: url(`/register`),
                            method: "POST",
                            data: {
                                email: "",
                                password: "",
                                confirmPassword: "",
                            },
                        },
                    },
                },
            });
        }));
        // 3. handle consent
        router.get("/consent", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "consent", "Invalid Request.");
            // 1. skip consent if client has such property
            if (client && client.skip_consent) {
                const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                    // consent was given by the user to the client for this session
                    consent: {
                        rejectedScopes: [],
                        rejectedClaims: [],
                        replace: true,
                    },
                }, {
                    mergeWithLastSubmission: true,
                });
                return render(ctx, { redirect });
            }
            // 2. or render consent form
            const data = {
                user: user ? yield util_1.getPublicUserProps(user) : undefined,
                client: client ? yield util_1.getPublicClientProps(client) : undefined,
            };
            return render(ctx, {
                interaction: {
                    name: "consent",
                    action: Object.assign({ submit: {
                            url: url(`/consent`),
                            method: "POST",
                            data: {
                                rejectedScopes: [],
                                rejectedClaims: [],
                                replace: true,
                            },
                        }, changeAccount: {
                            url: url(`/login`),
                            method: "GET",
                            data: {
                                change: true,
                            },
                            urlencoded: true,
                        } }, actions),
                    data: Object.assign(Object.assign({}, data), { 
                        // consent data (scopes, claims)
                        consent: interaction.prompt.details }),
                },
            });
        }));
        router.post("/consent", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "consent", "Invalid request.");
            // 1. validate body
            validate(ctx, {
                rejectedScopes: {
                    type: "array",
                    items: "string",
                },
                rejectedClaims: {
                    type: "array",
                    items: "string",
                },
            });
            // 2. finish interaction and give redirection uri
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                // consent was given by the user to the client for this session
                consent: ctx.request.body,
            }, {
                mergeWithLastSubmission: true,
            });
            return render(ctx, { redirect });
        }));
        return router.routes();
    }
}
exports.InteractionFactory = InteractionFactory;
//# sourceMappingURL=interaction.js.map