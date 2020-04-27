import { I18NResource } from "./i18n.en";

export const message: I18NResource = {
  // ConsentScreen
  "consent.consentRequired": "권한 허가 요청",
  "button.continue": "계속",
  "consent.privacyPolicy": "개인정보보호정책",
  "consent.termsOfService": "이용약관",
  "separator.or": "또는",
  "consent.changeAccount": "다른 계정으로 로그인",
  "consent.visitClientHomepage": "서비스 홈페이지 방문",
  "consent.givenScopesRequired": "이 서비스에 {scopes} 권한을 허가합니다.",

  // ErrorScreen
  "error.cannotClose": "창을 직접 닫아주세요.",
  "button.close": "닫기",

  // FindEmailEndScreen
  "findEmail.findYourAccount": "계정 찾기",
  "findEmail.byPhone": "핸드폰 인증 필요",
  "button.signIn": "로그인",
  "findEmail.foundYourAccount": "계정을 찾았습니다.",

  // FindEmailIndexScreen
  "payload.phoneNumber": "핸드폰 번호",
  "button.cancel": "취소",
  "findEmail.haveRegisteredPhoneNumber": "계정에 핸드폰 번호가 등록되어 있나요?",
  "placeholder.phoneNumber": "핸드폰 번호를 입력하세요. ({country})",

  // LoginCheckPasswordScreen
  "payload.email": "이메일",
  "payload.password": "패스워드",
  "login.signIn": "로그인",
  "login.hiName": "{name}님, 안녕하세요.",
  "login.resetPassword": "패스워드를 분실하셨나요?",
  "placeholder.password": "패스워드를 입력하세요.",

  // LoginIndexScreen
  "button.signUp": "가입하기",
  "login.showMoreLoginOptions": "다른 방법으로 로그인",
  "login.findEmail": "계정을 분실하셨나요?",
  "login.federate.default": "{provider} 계정으로 로그인",
  "login.federate.google": "구글 계정으로 로그인",
  "login.federate.facebook": "페이스북 계정으로 로그인",
  "login.federate.kakao": "카카오톡 계정으로 로그인",
  "placeholder.email": "이메일 주소를 입력하세요.",

  // LogoutEndScreen
  "logout.signOut": "로그아웃",
  "logout.signedOut": "로그아웃 완료",
  "logout.sessionNotExists": "계정 세션이 존재하지 않습니다.",
  "logout.belowSessionsAreActive": "이하의 세션이 활성화되어 있습니다.",
  "logout.noActiveSessions": "활성화된 세션이 없습니다.",

  // LogoutIndexScreen
  "button.done": "완료",
  "logout.signOutAllSessions": "모든 세션 로그아웃",

  // RegisterDetailScreen
  "payload.birthdate": "생년월일",
  "payload.gender": "성별",
  "payload.gender.male": "남성",
  "payload.gender.female": "여성",
  "payload.gender.other": "기타",
  "register.signUp": "가입하기",
  "register.pleaseEnterPhoneNumber": "계정 분실시 복구하려면 핸드폰 번호가 필요합니다.",
  "payload.optional": "선택",
  "placeholder.birthYear": `태어난 연도을 입력하세요. (YYYY)`,
  "placeholder.birthMonth": `태어난 월을 입력하세요.`,
  "placeholder.birthDay": `태어난 일자을 입력하세요.`,
  "placeholder.gender": "성별을 입력하세요.",

  // RegisterEndScreen
  "register.signedUp": "가입 완료",
  "register.congrats": "축하합니다. 계정이 성공적으로 등록되었습니다.",

  // RegisterIndexScreen
  "payload.name": "이름",
  "payload.passwordConfirmation": "확인",
  "register.createAccount": "새 계정 생성",
  "register.privacyPolicy": "개인정보보호정책",
  "register.termsOfService": "이용약관",
  "placeholder.name": "이름을 입력하세요.",
  "placeholder.passwordConfirmation": "패스워드를 다시 입력하세요.",
  "register.continueThenAgreed": "가입 절차를 계속하면 이용약관과 개인정보보호정책에 동의하는 것으로 간주됩니다.",

  // ResetPasswordEndScreen
  "resetPassword.passwordUpdated": "패스워드 재설정 완료",
  "resetPassword.passwordUpdatedSuccessfully": "계정 패스워드가 성공적으로 재설정되었습니다.",

  // ResetPasswordIndexScreen
  "resetPassword.resetPassword": "패스워드 재설정",
  "resetPassword.byEmail": "이메일 인증 필요",
  "resetPassword.verifyRegisteredEmail": "등록된 계정의 이메일 주소를 인증합니다.",

  // ResetPasswordSetScreen
  "payload.newPassword": "새 패스워드",
  "payload.newPasswordConfirmation": "확인",
  "resetPassword.setNewPassword": "계정의 새 패스워드를 설정합니다.",
  "placeholder.newPassword": "새 패스워드를 입력하세요.",
  "placeholder.newPasswordConfirmation": "새 패스워드를 다시 입력하세요.",

  // VerifyEmailEndScreen
  "verifyEmail.emailVerified": "이메일 인증 완료",
  "verifyEmail.emailVerifiedSuccessfully": "계정 이메일이 성공적으로 인증되었습니다.",

  // VerifyEmailIndexScreen
  "verifyEmail.verifyEmail": "이메일 인증",

  // VerifyEmailVerifyScreen
  "button.verify": "인증",
  "button.resend": "다시 보내기",
  "button.send": "보내기",
  "payload.verificationCode": "인증 코드",
  "placeholder.verificationCode": "인증 코드를 입력하세요.",
  "verifyEmail.enterTheCode": "인증코드 6자리 숫자를 입력하세요.",
  "verifyEmail.codeGonnaBeSent": "이메일 주소로 인증 코드가 포함된 메일을 보냅니다.",

  // VerifyPhoneEndScreen
  "verifyPhone.phoneVerified": "핸드폰 인증 완료",
  "verifyPhone.phoneVerifiedSuccessfully": "계정 핸드폰 번호가 성공적으로 인증되었습니다.",
  "verifyPhone.verifyPhone": "핸드폰 인증",
  "verifyPhone.verifyRegisteredPhone": "등록된 계정의 핸드폰 번호를 인증합니다.",
  "verifyPhone.enterTheCode": "인증코드 6자리 숫자를 입력하세요.",
  "verifyPhone.codeGonnaBeSent": "핸드폰 번호로 인증 코드가 포함된 문자 메세지을 보냅니다.",
};

export default message;
