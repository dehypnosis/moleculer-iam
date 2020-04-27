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
  "placeholder.phoneNumber": "Enter your mobile phone number ({country})",

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
  "placeholder.birthYear": `Enter your birth year (YYYY)`,
  "placeholder.birthMonth": `Enter your birth month`,
  "placeholder.birthDay": `Enter your birth day`,
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
};

export default message;
