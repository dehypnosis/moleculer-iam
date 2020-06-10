export type I18NResource = typeof message;

const message = {
  // ConsentScreen
  "consent.consentRequired": "Authorization consent required",
  "button.continue": "Continue",
  "consent.privacyPolicy": "Privacy policy",
  "consent.termsOfService": "Terms of service",
  "separator.or": "OR",
  "consent.changeAccount": "Continue with other account",
  "consent.visitClientHomepage": "Visit service homepage",
  "consent.givenScopesRequired": "{scopes} permissions are required.",

  // ErrorScreen
  "error.cannotClose": "Please close the window manually.",
  "button.close": "Close",

  // FindEmailEndScreen
  "findEmail.findYourAccount": "Find account",
  "findEmail.byPhone": "With phone verification",
  "button.signIn": "Sign in",
  "findEmail.foundYourAccount": "Have found your account.",

  // FindEmailIndexScreen
  "payload.phoneNumber": "phone number",
  "button.cancel": "Cancel",
  "findEmail.haveRegisteredPhoneNumber": "Have you registered a phone number?",
  "placeholder.phoneNumber": "Enter your mobile phone number ({region})",

  // LoginCheckPasswordScreen
  "payload.email": "email",
  "payload.password": "password",
  "login.signIn": "Sign in",
  "login.hiName": "Hi, {name}",
  "login.resetPassword": "Forgot password?",
  "placeholder.password": "Enter your password",

  // LoginIndexScreen
  "button.signUp": "Sign up",
  "login.showMoreLoginOptions": "Find more login options?",
  "login.findEmail": "Forgot your email address?",
  "login.federate.default": "Login with {provider}",
  "login.federate.google": "Login with Google",
  "login.federate.facebook": "Login with Facebook",
  "login.federate.kakao": "Login with Kakaotalk",
  "placeholder.email": "Enter your email address",

  // LogoutEndScreen
  "logout.signOut": "Sign out",
  "logout.signedOut": "Signed out",
  "logout.sessionNotExists": "Account session not exists.",
  "logout.belowSessionsAreActive": "Below sessions are active.",
  "logout.noActiveSessions": "There are no active sessions.",

  // LogoutIndexScreen
  "button.done": "Done",
  "logout.signOutAllSessions": "Sign out all sessions",

  // RegisterDetailScreen
  "payload.birthdate": "birthdate",
  "payload.gender": "gender",
  "payload.gender.male": "Male",
  "payload.gender.female": "Female",
  "payload.gender.other": "Other",
  "register.signUp": "Sign up",
  "register.pleaseEnterPhoneNumber": "Please enter the phone number to find the your account for the case of lost.",
  "payload.optional": "optional",
  "placeholder.birthYear": `Enter your birth year (1991)`,
  "placeholder.birthMonth": `Enter your birth month (01)`,
  "placeholder.birthDay": `Enter your birth day (03)`,
  "placeholder.gender": "Enter your gender",

  // RegisterEndScreen
  "register.signedUp": "Signed up",
  "register.congrats": "Congratulations! The account has been registered successfully.",

  // RegisterIndexScreen
  "payload.name": "name",
  "payload.passwordConfirmation": "confirmation",
  "register.createAccount": "Create an account",
  "register.privacyPolicy": "Privacy policy",
  "register.termsOfService": "Terms of service",
  "placeholder.name": "Enter your name",
  "placeholder.passwordConfirmation": "Confirm your password",
  "register.continueThenAgreed": "By continuing, you are agreeing to the terms of service and the privacy policy.",

  // ResetPasswordEndScreen
  "resetPassword.passwordUpdated": "Password updated",
  "resetPassword.passwordUpdatedSuccessfully": "The account credential has been updated successfully.",

  // ResetPasswordIndexScreen
  "resetPassword.resetPassword": "Reset password",
  "resetPassword.byEmail": "With email verification",
  "resetPassword.verifyRegisteredEmail": "Verify your registered email address.",

  // ResetPasswordSetScreen
  "payload.newPassword": "new password",
  "payload.newPasswordConfirmation": "confirmation",
  "resetPassword.setNewPassword": "Set a new password for your account.",
  "placeholder.newPassword": "Enter new password",
  "placeholder.newPasswordConfirmation": "Confirm new password",

  // VerifyEmailEndScreen
  "verifyEmail.emailVerified": "Email address verified",
  "verifyEmail.emailVerifiedSuccessfully": "The account email address has been verified successfully.",

  // VerifyEmailIndexScreen
  "verifyEmail.verifyEmail": "Verify email address",

  // VerifyEmailVerifyScreen
  "button.verify": "Verify",
  "button.resend": "Resend",
  "button.send": "Send",
  "payload.verificationCode": "Verification code",
  "placeholder.verificationCode": "Enter the verification code",
  "verifyEmail.enterTheCode": "Enter the received 6-digit verification code.",
  "verifyEmail.codeGonnaBeSent": "An email with a verification code will be sent to verify the email address.",

  // VerifyPhoneEndScreen
  "verifyPhone.phoneVerified": "Phone number verified",
  "verifyPhone.phoneVerifiedSuccessfully": "The account phone number has been verified successfully.",
  "verifyPhone.verifyPhone": "Verify phone number",
  "verifyPhone.verifyRegisteredPhone": "Verify your registered phone number.",
  "verifyPhone.enterTheCode": "Enter the received 6-digit verification code.",
  "verifyPhone.codeGonnaBeSent": "A text message with a verification code will be sent to verify the phone number.",

  // Errors
  error: {
    // ref: https://github.com/panva/node-oidc-provider/blob/ed81fc64b5d6119489ef1021aebd71f2db44018e/lib/helpers/err_out.js#L13
    ServerError: {
      name: "Internal Server Error",
      description: "An unexpected internal error has occurred.",
    },
    // koa
    InternalServerError: {
      name: "Internal Server Error",
      description: "An unexpected internal error has occurred.",
    },
    // ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/errors.js#L20
    InvalidToken: {
      name: "Invalid Token",
    },
    InvalidClient: {
      name: "Invalid Client",
      description: "Not a registered client.",
    },
    InvalidClientMetadata: {
      name: "Invalid Client Metadata",
    },
    InvalidScope: {
      name: "Invalid Scope",
    },
    InvalidRequest: {
      name: "Invalid Request",
    },
    SessionNotFound: {
      name: "Session Error",
      description: "Cannot find the session.",
    },
    InvalidClientAuth: {
      name: "Invalid Client Auth",
    },
    InvalidGrant: {
      name: "Invalid Grant",
    },

    // OIDCProviderProxyErrors
    InvalidPromptSession: {
      name: "Session Error",
      description: "The login session has expired or invalid.",
    },
    InvalidFederationProvider: {
      name: "Federation Error",
      description: "Cannot federate account with the invalid provider.",
    },
    FederationRequestWithoutEmailPayload: {
      name: "Federation Error",
      description: "Cannot federate without an email address.",
    },
    FederationRequestForDeletedAccount: {
      name: "Federation Error",
      description: "Cannot federate a deleted account.",
    },

    // ApplicationErrors
    ResetPasswordSessionExpired: {
      name: "Session Error",
      description: "Reset password session has expired or incorrect.",
    },
    TooMuchVerificationCodeRequest: {
      name: "Session Error",
      description: "Cannot resend an verification code until previous one expires.",
    },
    InvalidVerificationCode: {
      name: "Validation Error",
      description: "The verification code has expired or incorrect.",
    },
    UnauthenticatedSession: {
      name: "Session Error",
      description: "The session is not authenticated.",
    },

    // IAMErrors
    IdentityNotExists: {
      name: "Validation Error",
      description: "The account not exists.",
    },
    IdentityAlreadyExists: {
      name: "Validation Error",
      description: "The account already exists.",
    },
    InvalidCredentials: {
      name: "Validation Error",
      description: "The account and credentials are incorrect.",
    },
    UnsupportedCredentials: {
      name: "Validation Error",
      description: "The account cannot use the given type of credentials.",
    },
    ValidationFailed: {
      name: "Validation Error",
      description: "Failed to validate given payload.",
      data: {
        required: "The {field} field is required.",
        string: "The {field} field must be a string.",
        stringEmpty: "The {field} field must not be empty.",
        stringMin: "The {field} field length must be greater than or equal to {expected} characters long.",
        stringMax: "The {field} field length must be less than or equal to {expected} characters long.",
        stringLength: "The {field} field length must be {expected} characters long.",
        stringPattern: "The {field} field fails to match the required pattern.",
        stringContains: "The {field} field must contain the {expected} text.",
        stringEnum: "The {field} field does not match any of the allowed values.",
        stringNumeric: "The {field} field must be a numeric string.",
        stringAlpha: "The {field} field must be an alphabetic string.",
        stringAlphanum: "The {field} field must be an alphanumeric string.",
        stringAlphadash: "The {field} field must be an alphadash string.",
        number: "The {field} field must be a number.",
        numberMin: "The {field} field must be greater than or equal to {expected}.",
        numberMax: "The {field} field must be less than or equal to {expected}.",
        numberEqual: "The {field} field must be equal to {expected}.",
        numberNotEqual: "The {field} field can't be equal to {expected}.",
        numberInteger: "The {field} field must be an integer.",
        numberPositive: "The {field} field must be a positive number.",
        numberNegative: "The {field} field must be a negative number.",
        array: "The {field} field must be an array.",
        arrayEmpty: "The {field} field must not be an empty array.",
        arrayMin: "The {field} field must contain at least {expected} items.",
        arrayMax: "The {field} field must contain less than or equal to {expected} items.",
        arrayLength: "The {field} field must contain {expected} items.",
        arrayContains: "The {field} field must contain the {expected} item.",
        arrayUnique: "The {actual} value in {field} field does not unique the {expected}.",
        arrayEnum: "The {actual} value in {field} field does not match any of {expected}.",
        boolean: "The {field} field must be a boolean.",
        date: "The {field} field must be a Date.",
        dateMin: "The {field} field must be greater than or equal to {expected}.",
        dateMax: "The {field} field must be less than or equal to {expected}.",
        enumValue: "The {field} field value does not match any of {expected}.",
        equalValue: "The {field} field value must be equal to {expected}.",
        equalField: "The {field} field value must be equal to {expected} field value.",
        forbidden: "The {field} field is forbidden.",
        function: "The {field} field must be a function.",
        email: "The {field} field must be a valid e-mail.",
        luhn: "The {field} field must be a valid checksum luhn.",
        mac: "The {field} field must be a valid MAC address.",
        object: "The {field} must be an Object.",
        objectStrict: "The object {field} contains forbidden keys: {actual}.",
        url: "The {field} field must be a valid URL.",
        uuid: "The {field} field must be a valid UUID.",
        uuidVersion: "The {field} field must be a valid UUID version provided.",
        phone: `The {field} field must be a valid phone number format.`,
        duplicate: `The {field} value is already used by other account.`,
      },
    },
  },
};

export default message;
