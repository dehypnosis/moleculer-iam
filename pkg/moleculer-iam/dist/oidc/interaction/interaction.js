"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koa_bodyparser_1 = tslib_1.__importDefault(require("koa-bodyparser"));
const koajs_nocache_1 = tslib_1.__importDefault(require("koajs-nocache"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const provider_1 = require("../provider");
const util_1 = require("./util");
const error_1 = require("../../identity/error");
const federation_1 = require("./federation");
const interaction_render_1 = require("./interaction.render");
const interaction_internal_1 = require("./interaction.internal");
class InteractionFactory {
    constructor(props, opts = {}) {
        this.props = props;
        this.opts = opts;
        // renderer
        this.render = opts.render || interaction_render_1.defaultInteractionRenderer;
        // internal interaction factory
        this.internal = new interaction_internal_1.InternalInteractionConfigurationFactory(Object.assign(Object.assign({}, props), { render: this.render }));
        // create router
        this.router = new koa_router_1.default({
            prefix: "/interaction",
            sensitive: true,
            strict: false,
        });
        // apply router middleware
        this.router.use(koajs_nocache_1.default(), koa_bodyparser_1.default());
    }
    configuration() {
        const { Prompt, Check, base } = provider_1.interactionPolicy;
        const defaultPrompts = base();
        return Object.assign({ interactions: {
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
            } }, this.internal.configuration());
    }
    /* create interaction routes */
    routes(provider) {
        function url(path) {
            return `${provider.issuer}/interaction${path}`;
        }
        const { idp, logger } = this.props;
        const router = this.router;
        const parseContext = (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // fetch interaction details
            const interaction = yield provider.interactionDetails(ctx.req, ctx.res);
            // fetch identity and client
            const user = interaction.session && typeof interaction.session.accountId === "string" ? (yield idp.findOrFail({ id: interaction.session.accountId })) : undefined;
            const client = interaction.params.client_id ? (yield provider.Client.find(interaction.params.client_id)) : undefined;
            const locals = { interaction, user, client };
            ctx.locals = locals;
            return next();
        });
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
            catch (err) {
                // delegate error handling
                logger.error(err);
                ctx.type = "json";
                if (err.expose) {
                    const { error, status, statusCode, error_description, name, expose } = err, otherProps = tslib_1.__rest(err, ["error", "status", "statusCode", "error_description", "name", "expose"]);
                    ctx.status = status || statusCode || 500;
                    if (isNaN(ctx.status))
                        ctx.status = 500;
                    ctx.body = Object.assign({ error,
                        error_description }, otherProps);
                }
                else {
                    const { status, statusCode, code, status_code } = err;
                    ctx.status = status || statusCode || code || status_code || 500;
                    if (isNaN(ctx.status))
                        ctx.status = 500;
                    ctx.body = err;
                }
            }
        }));
        router.get("/", ctx => {
            ctx.type = "json";
            ctx.body = {
                interaction: {
                    abort: {
                        url: url(`/abort`),
                        method: "POST",
                    },
                    check_login_email: {
                        url: url(`/check_login_email`),
                        method: "POST",
                        data: {
                            email: "",
                        },
                    },
                    login: {
                        url: url(`/login`),
                        method: "GET",
                        data: {
                            change_account: true,
                        },
                    },
                    login_end: {
                        url: url(`/login_end`),
                        method: "POST",
                        data: {
                            email: "",
                            password: "",
                        },
                    },
                    consent: {
                        url: url(`/consent`),
                        method: "GET",
                    },
                    consent_end: {
                        url: url(`/consent_end`),
                        method: "POST",
                        data: {
                            rejected_scopes: [],
                            rejected_claims: [],
                        },
                    },
                    federate: {
                        url: url(`/federate`),
                        method: "POST",
                        urlencoded: true,
                        data: {
                            provider: "",
                        },
                    },
                    verify_email: {
                        url: url(`/verify_email`),
                        method: "POST",
                        data: {
                            email: "",
                            callback: "none",
                        },
                    },
                    verify_email_end: {
                        url: url(`/verify_email_end`),
                        method: "POST",
                        data: {
                            email: "",
                            code: "",
                        },
                    },
                    reset_password: {
                        url: url(`/verify_email`),
                        method: "POST",
                        data: {
                            email: "",
                            callback: "reset_password",
                        },
                    },
                    verify_phone_number: {
                        url: url(`/verify_phone_number`),
                        method: "POST",
                        data: {
                            phone_number: "",
                            callback: "none",
                        },
                    },
                    verify_phone_number_send_code: {
                        url: url(`/verify_phone_number_send_code`),
                        method: "POST",
                        data: {
                            phone_number: "",
                        },
                    },
                    verify_phone_number_end: {
                        url: url(`/verify_phone_number_end`),
                        method: "POST",
                        data: {
                            phone_number: "",
                            code: "",
                        },
                    },
                    find_email: {
                        url: url(`/verify_phone_number`),
                        method: "POST",
                        data: {
                            phone_number: "",
                            callback: "find_email",
                        },
                    },
                    validate: {
                        url: url(`/validate`),
                        method: "POST",
                        data: {
                            scope: "profile email phone birthdate gender",
                            claims: {
                                name: "",
                                email: "",
                                password: "",
                                password_confirmation: "",
                                phone_number: "",
                                birthdate: "",
                                gender: "",
                            },
                        },
                    },
                    register: {
                        url: url(`/register`),
                        method: "POST",
                        data: {
                            scope: "profile email phone birthdate gender",
                            claims: {
                                name: "",
                                email: "",
                                password: "",
                                password_confirmation: "",
                                phone_number: "",
                                birthdate: "",
                                gender: "",
                            },
                        },
                    },
                },
            };
        });
        // abort any interaction
        router.post("/abort", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                error: "access_denied",
                error_description: "end-user aborted interaction",
            }, {
                mergeWithLastSubmission: false,
            });
            ctx.body = { redirect };
        }));
        // prepare login
        router.get("/login", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            // already signed in
            const changeAccount = ctx.request.query.change_account || (interaction.params.change_account === true || interaction.params.change_account === "true" || interaction.params.change_account === 1);
            const autoLogin = !changeAccount && user && interaction.prompt.name !== "login";
            if (autoLogin) {
                const login = {
                    account: user.id,
                    remember: true,
                };
                const redirect = yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { login }), {
                    mergeWithLastSubmission: true,
                });
                // overwrite session
                yield provider.setProviderSession(ctx.req, ctx.res, login);
                ctx.type = "json";
                ctx.body = { redirect };
                return;
            }
            ctx.body = {
                interaction: "login",
                data: {
                    user: user && !changeAccount ? yield util_1.getPublicUserProps(user) : null,
                    client: client ? yield util_1.getPublicClientProps(client) : null,
                    federationProviders: federation.availableProviders,
                },
            };
        }));
        // check login email exists
        router.post("/check_login_email", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { email } = ctx.request.body;
            const user = yield idp.findOrFail({ claims: { email: email || "" } });
            return ctx.body = {
                interaction: "check_login_email",
                data: {
                    user: yield util_1.getPublicUserProps(user),
                },
            };
        }));
        // handle login
        router.post("/login_end", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            const { email, password } = ctx.request.body;
            // check account and password
            const user = yield idp.findOrFail({ claims: { email: email || "" } });
            if (!(yield user.assertCredentials({ password: password || "" }))) {
                throw new error_1.Errors.InvalidCredentialsError();
            }
            // finish interaction and give redirection uri
            const login = {
                account: user.id,
                remember: true,
            };
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { login }), {
                mergeWithLastSubmission: true,
            });
            // overwrite session
            yield provider.setProviderSession(ctx.req, ctx.res, login);
            return ctx.body = {
                interaction: "login_end",
                redirect,
            };
        }));
        // handle federation
        const federation = new federation_1.IdentityFederationManager({
            logger,
            idp,
            callbackURL: providerName => url(`/federate/${providerName}`),
        }, this.opts.federation);
        router.post("/federate", parseContext, (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");
            yield federation.request(ctx.request.body.provider, ctx, next);
        }));
        // handle ferderation callback
        router.get("/federate/:provider", parseContext, (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");
            const federatedUser = yield federation.callback(ctx.params.provider, ctx, next);
            if (!federatedUser) {
                throw new error_1.Errors.IdentityNotExistsError();
            }
            const login = {
                account: federatedUser.id,
                remember: true,
            };
            // make user signed in
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { login }));
            // overwrite session
            yield provider.setProviderSession(ctx.req, ctx.res, login);
            return ctx.body = { redirect };
        }));
        // prepare consent
        router.get("/consent", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "consent", "Invalid Request.");
            // skip consent if client has such property
            if (client && client.skip_consent) {
                const redirect = yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { consent: {
                        rejectedScopes: [],
                        rejectedClaims: [],
                        replace: true,
                    } }), {
                    mergeWithLastSubmission: true,
                });
                return ctx.body = {
                    interaction: "consent_end",
                    redirect,
                };
            }
            // or render consent form
            return ctx.body = {
                interaction: "consent",
                data: {
                    user: user ? yield util_1.getPublicUserProps(user) : undefined,
                    client: client ? yield util_1.getPublicClientProps(client) : undefined,
                    // consent data (scopes, claims)
                    consent: interaction.prompt.details,
                },
            };
        }));
        // handle consent
        router.post("/consent_end", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "consent", "Invalid request.");
            const { rejected_scopes = [], rejected_claims = [] } = ctx.request.body;
            // finish consent interaction and give redirection uri
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { consent: {
                    rejectedScopes: rejected_scopes,
                    rejectedClaims: rejected_claims,
                    replace: true,
                } }), {
                mergeWithLastSubmission: true,
            });
            return ctx.body = {
                name: "consent_end",
                redirect,
            };
        }));
        // 2.3. handle verify phone number submit
        const phoneNumberVerificationTimeoutSeconds = 180;
        router.post("/verify_phone_number", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            // 'registered' means verifying already registered phone number
            const _a = ctx.request.body, { registered = false, callback } = _a, claims = tslib_1.__rest(_a, ["registered", "callback"]);
            idp.validateEmailOrPhoneNumber(claims); // normalize phone number
            // 1. assert user with the phone number
            const user = yield idp.find({ claims: { phone_number: claims.phone_number || "" } });
            if (registered && !user) {
                ctx.throw(400, "Not a registered phone number.");
            }
            else if (!registered && user) {
                ctx.throw(400, "Already registered phone number.");
            }
            // 3. check too much resend
            if (interaction && interaction.result && interaction.result.verifyPhoneNumber) {
                const old = interaction.result.verifyPhoneNumber;
                if (old.phoneNumber === claims.phone_number && old.expiresAt && moment_1.default().isBefore(old.expiresAt)) {
                    ctx.throw(400, "Cannot resend a message before previous one expires.");
                }
            }
            // 4. create and send code
            const expiresAt = moment_1.default().add(phoneNumberVerificationTimeoutSeconds, "s").toISOString();
            const code = Math.floor(Math.random() * 1000000).toString();
            // TODO: send sms via adaptor props
            // 5. extend TTL and store the code
            yield interaction.save(moment_1.default().isAfter((interaction.exp / 1000) + 60 * 10, "s") ? interaction.exp + 60 * 10 : undefined);
            yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { verifyPhoneNumber: {
                    phoneNumber: claims.phone_number,
                    callback,
                    code,
                    expiresAt,
                } }), {
                mergeWithLastSubmission: true,
            });
            // 5. render with submit, resend endpoint
            return ctx.body = {
                interaction: {
                    name: "verify_phone_number",
                    action: {
                        submit: {
                            url: url(`/verify_phone_number_callback`),
                            method: "POST",
                            data: {
                                code: "",
                            },
                        },
                        send: {
                            url: url(`/verify_phone_number`),
                            method: "POST",
                            data: Object.assign({}, ctx.request.body),
                        },
                    },
                    data: Object.assign({ phoneNumber: claims.phone_number, timeoutSeconds: phoneNumberVerificationTimeoutSeconds }, (this.opts.devModeEnabled ? { debug: { code } } : {})),
                },
            };
        }));
        // 2.4. handle verify_phone_number code submit
        router.post("/verify_phone_number_callback", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            ctx.assert(interaction && interaction.result.verifyPhoneNumber && interaction.result.verifyPhoneNumber.code, "Phone number verification session has been expired.");
            const { callback, phoneNumber, code, expiresAt } = interaction.result.verifyPhoneNumber;
            // 1. check expiration
            if (!callback || !code || !expiresAt || moment_1.default().isAfter(expiresAt)) {
                ctx.throw(400, "Verification code has expired.");
            }
            // 2. check code
            yield new Promise(resolve => setTimeout(resolve, 1000)); // prevent brute force attack
            if (ctx.request.body.code !== code) {
                throw new error_1.Errors.ValidationError([{
                        type: "incorrectVerificationCode",
                        field: "code",
                        message: `Incorrect verification code.`,
                    }]);
            }
            // 3. process callback interaction
            switch (callback) {
                case "login":
                    // find user and update identity phone_number_verified
                    const user = yield idp.findOrFail({ claims: { phone_number: phoneNumber || "" } });
                    yield user.updateClaims({ phone_number_verified: true }, "phone");
                    const login = {
                        account: user.id,
                        remember: true,
                    };
                    // make it user signed in
                    const redirect = yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { login, verifyPhoneNumber: null }), {
                        mergeWithLastSubmission: true,
                    });
                    // overwrite session
                    yield provider.setProviderSession(ctx.req, ctx.res, login);
                    return ctx.body = { redirect };
                case "register":
                    ctx.assert(interaction.result.register && interaction.result.register.claims && interaction.result.register.claims.phone_number);
                    const { claims } = interaction.result.register;
                    // store verified state
                    yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { register: Object.assign(Object.assign({}, interaction.result.register), { claims: Object.assign(Object.assign({}, claims), { phone_number_verified: true }) }), verifyPhoneNumber: null }), {
                        mergeWithLastSubmission: true,
                    });
                    // to complete register
                    return ctx.body = {
                        interaction: {
                            name: "register",
                            action: {
                                submit: {
                                    url: url(`/register`),
                                    method: "POST",
                                    data: {
                                        save: true,
                                    },
                                },
                            },
                            data: {
                                email: claims.email,
                                name: claims.name,
                            },
                        },
                    };
                default:
                    ctx.throw(`Unimplemented verify_phone_number_callback: ${callback}`);
            }
        }));
        // 2.5. handle verify_email submit
        const emailVerificationTimeoutSeconds = 60 * 30;
        router.post("/verify_email", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");
            // 2. assert user with the email
            const { callback, email } = ctx.request.body;
            const user = yield idp.find({ claims: { email: email || "" } });
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
            yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { verifyEmail: {
                    callback,
                    email,
                    expiresAt,
                } }), {
                mergeWithLastSubmission: true,
            });
            // 5. render with submit, resend endpoint
            return ctx.body = {
                interaction: {
                    name: "verify_email",
                    action: {
                        send: {
                            url: url(`/verify_email`),
                            method: "POST",
                            data: ctx.request.body,
                        },
                    },
                    data: Object.assign({ email, timeoutSeconds: emailVerificationTimeoutSeconds }, (this.opts.devModeEnabled ? { debug: { payload } } : {})),
                },
            };
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
            const user = yield idp.findOrFail({ claims: { email: email || "" } });
            // 3. update identity email_verified as true
            yield user.updateClaims({ email_verified: true }, "email");
            // 4. process callback interaction
            switch (callback) {
                case "reset_password":
                    // mark reset password is ready
                    interaction.result.resetPassword = {
                        email,
                    };
                    yield interaction.save();
                    return ctx.body = {
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
                    };
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
            const user = yield idp.findOrFail({ claims: { email: interaction.result.resetPassword.email || "" } });
            ctx.assert(user);
            // 3. validate and update credentials
            const updated = yield user.updateCredentials({ password: ctx.request.body.password || "" });
            if (!updated) {
                throw new error_1.Errors.UnexpectedError("credentials has not been updated.");
            }
            // 4. forget verifyEmail state
            interaction.result.verifyEmail = null;
            yield interaction.save();
            // 5. return to initial redirection
            return ctx.body = {
                interaction: {
                    name: "reset_password_end",
                    action: {},
                    data: {
                        user: yield util_1.getPublicUserProps(user),
                    },
                },
            };
        }));
        // 2.7. handle register submit
        router.post("/register", parseContext, (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");
            // 1. extend TTL
            yield interaction.save(moment_1.default().isAfter((interaction.exp / 1000) + 60 * 30, "s") ? interaction.exp + 60 * 30 : undefined);
            // 2. enter email, name, password, password_confirmation
            if (!interaction.result || !interaction.result.register || interaction.result.register.email || typeof ctx.request.body.email !== "undefined") {
                // 2.1. assert user not exists
                const user = yield idp.find({ claims: { email: ctx.request.body.email || "" } });
                if (user) {
                    throw new error_1.Errors.IdentityAlreadyExistsError();
                }
                // 2.2. validate claims
                const { email, name, password, password_confirmation } = ctx.request.body;
                // tslint:disable-next-line:no-shadowed-variable
                const claims = { email, name };
                // tslint:disable-next-line:no-shadowed-variable
                const credentials = { password, password_confirmation };
                yield idp.validate({ scope: ["email", "profile"], claims, credentials });
                // 2.3. store claims temporarily
                yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { 
                    // consent was given by the user to the client for this session
                    register: {
                        claims,
                        credentials,
                    } }), {
                    mergeWithLastSubmission: true,
                });
                return ctx.body = {
                    interaction: {
                        name: "register",
                        action: {
                            submit: {
                                url: url(`/register`),
                                method: "POST",
                                data: {
                                    phone_number: "",
                                    birthdate: "",
                                    gender: "",
                                },
                            },
                        },
                        data: Object.assign({}, claims),
                    },
                };
            }
            ctx.assert(interaction.result.register);
            // 3. enter phone_number, birthdate, gender
            // tslint:disable-next-line:prefer-const
            let { claims, credentials } = interaction.result.register;
            if (!claims.birthdate || !claims.gender || typeof ctx.request.body.birthdate !== "undefined") {
                // 3.1. validate claims
                const { phone_number, birthdate, gender } = ctx.request.body;
                claims = Object.assign(Object.assign({}, claims), { birthdate, gender });
                if (phone_number) {
                    const user = yield idp.find({ claims: { phone_number } });
                    if (user) {
                        throw new error_1.Errors.ValidationError([{
                                type: "duplicatePhoneNumber",
                                field: "phone_number",
                                message: `Already registered phone number.`,
                            }]);
                    }
                    claims.phone_number = phone_number;
                }
                yield idp.validate({ scope: ["email", "profile", "birthdate", "gender"].concat(phone_number ? ["phone"] : []), claims, credentials });
                // 3.2. store claims temporarily
                yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { 
                    // consent was given by the user to the client for this session
                    register: {
                        claims,
                        credentials,
                    } }), {
                    mergeWithLastSubmission: true,
                });
            }
            // 3.3. let verify phone number or submit
            const shouldVerifyPhoneNumber = claims.phone_number && claims.phone_number_verified !== true;
            if (shouldVerifyPhoneNumber) {
                return ctx.body = {
                    interaction: {
                        name: "verify_phone_number",
                        action: {
                            send: {
                                url: url(`/verify_phone_number`),
                                method: "POST",
                                data: {
                                    phone_number: claims.phone_number,
                                    callback: "register",
                                    registered: false,
                                },
                            },
                        },
                        data: {
                            phoneNumber: claims.phone_number,
                        },
                    },
                };
            }
            // 4. finish registration
            let redirect;
            if (ctx.request.body.save) {
                // 4.1. create user
                const identity = yield idp.create({
                    scope: ["email", "profile", "birthdate", "gender"].concat(claims.phone_number ? ["phone"] : []),
                    claims,
                    credentials,
                    metadata: {},
                });
                // 4.2. let signed in
                const login = {
                    account: identity.id,
                    remember: true,
                };
                redirect = yield provider.interactionResult(ctx.req, ctx.res, Object.assign(Object.assign({}, interaction.result), { login, register: null }), {
                    mergeWithLastSubmission: true,
                });
                // overwrite session
                yield provider.setProviderSession(ctx.req, ctx.res, login);
                // TODO: 5. send email which includes (email verification link) with adaptor props
            }
            return ctx.body = {
                redirect,
                interaction: {
                    name: "register",
                    action: {
                        submit: {
                            url: url(`/register`),
                            method: "POST",
                            data: {
                                save: true,
                            },
                        },
                    },
                    data: {
                        email: claims.email,
                        name: claims.name,
                    },
                },
            };
        }));
        return router.routes();
    }
}
exports.InteractionFactory = InteractionFactory;
//# sourceMappingURL=interaction.js.map