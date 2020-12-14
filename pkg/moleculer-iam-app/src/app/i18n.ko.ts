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
  "placeholder.phoneNumber": "핸드폰 번호를 입력하세요. ({region})",

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
  "login.federate.apple": "애플 계정으로 로그인",
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
  "placeholder.birthYear": `태어난 연도을 입력하세요. (1991)`,
  "placeholder.birthMonth": `태어난 월을 입력하세요. (01)`,
  "placeholder.birthDay": `태어난 일자을 입력하세요. (03)`,
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

  // Errors
  error: {
    ServerError: {
      name: "서버 오류",
      description: "예기치 못한 서버 오류가 발생했습니다.",
    },
    InternalServerError: {
      name: "서버 오류",
      description: "예기치 못한 서버 오류가 발생했습니다.",
    },
    InvalidToken: {
      name: "유효하지 않은 토큰",
    },
    InvalidClient: {
      name: "유효하지 않은 클라이언트",
      description: "등록된 클라이언트가 아닙니다.",
    },
    InvalidClientMetadata: {
      name: "유효하지 않은 클라이언트 정보",
    },
    InvalidScope: {
      name: "유효하지 않은 스코프",
    },
    InvalidRequest: {
      name: "처리 할 수 없는 요청",
    },
    SessionNotFound: {
      name: "세션 오류",
      description: "유효한 세션을 찾을 수 없습니다.",
    },
    InvalidClientAuth: {
      name: "유효하지 않은 클라이언트 인증",
    },
    InvalidGrant: {
      name: "유효하지 않은 인가",
    },

    InvalidPromptSession: {
      name: "세션 오류",
      description: "로그인 세션이 만료되었거나 유효하지 않습니다.",
    },
    InvalidFederationProvider: {
      name: "계정 연동 오류",
      description: "지원되지 않는 계정 연동 제공자입니다.",
    },
    FederationRequestWithoutEmailPayload: {
      name: "계정 연동 오류",
      description: "이메일 주소가 없는 계정으로 연동 할 수 없습니다.",
    },
    FederationRequestForDeletedAccount: {
      name: "계정 연동 오류",
      description: "삭제된 계정과 연동 할 수 없습니다.",
    },

    ResetPasswordSessionExpired: {
      name: "세션 오류",
      description: "패스워드 재설정 세션이 만료되었거나 유효하지 않습니다.",
    },
    TooMuchVerificationCodeRequest: {
      name: "검증 오류",
      description: "이전 인증 코드가 아직 만료되지 않았습니다.",
    },
    InvalidVerificationCode: {
      name: "검증 오류",
      description: "인증 코드가 만료되었거나 유효하지 않습니다.",
    },
    UnauthenticatedSession: {
      name: "세션 오류",
      description: "인증된 세션이 아닙니다.",
    },

    IdentityNotExists: {
      name: "검증 오류",
      description: "계정이 존재하지 않습니다.",
    },
    IdentityAlreadyExists: {
      name: "검증 오류",
      description: "이미 등록된 계정입니다.",
    },
    InvalidCredentials: {
      name: "검증 오류",
      description: "계정 혹은 자격 증명이 올바르지 않습니다.",
    },
    UnsupportedCredentials: {
      name: "검증 오류",
      description: "계정이 제공된 자격 증명을 사용 할 수 없습니다.",
    },
    ValidationFailed: {
      name: "검증 오류",
      description: "데이터 검증에 실패하였습니다.",
      data: {
        required: "{field}이/가 필요합니다.",

        string: "{field}이/가 문자열이 아닙니다.",
        stringEmpty: "{field}이/가 필요합니다.",
        stringMin: "{field}은/는 {expected} 글자 이상이여야 합니다.",
        stringMax: "{field}은/는 {expected} 글자 이하여야 합니다.",
        stringLength: "{field}은/는 {expected} 글자여야 합니다.",
        stringPattern: "{field}이/가 올바른 양식이 아닙니다.",
        stringContains: "{field}은/는 {expected}을/를 포함해야합니다.",
        stringEnum: "{field}이/가 허용된 값이 아닙니다.",
        stringNumeric: "{field}이/가 올바른 숫자 표기가 아닙니다.",
        stringAlpha: "{field}은/는 알파벳만 포함 할 수 있습니다.",
        stringAlphanum: "{field}은/는 알파벳과 숫자만 포함 할 수 있습니다.",
        stringAlphadash: "{field}은/는 알파벳과 숫자, 대시(-)만 포함 할 수 있습니다.",

        number: "{field}이/가 숫자가 아닙니다.",
        numberMin: "{field}이/가 {expected} 보다 작습니다.",
        numberMax: "{field}이/가 {expected} 보다 큽니다.",
        numberEqual: "{field}이/가 {expected} 값과 다릅니다.",
        numberNotEqual: "{field}이/가 {expected} 값과 같습니다.",
        numberInteger: "{field}이/가 정수가 아닙니다.",
        numberPositive: "{field}이/가 양수가 아닙니다.",
        numberNegative: "{field}이/가 음수가 아닙니다.",

        array: "{field}은/는 배열이여야 합니다.",
        arrayEmpty: "{field}에 한개 이상의 항목이 필요합니다.",
        arrayMin: "{field}에 최소 {expected}개 이상의 항목이 필요합니다.",
        arrayMax: "{field}에 최대 {expected}개 이하의 항목이 필요합니다.",
        arrayLength: "{field}에 {expected}개의 항목이 필요합니다.",
        arrayContains: "{field}에 {expected} 항목이 필요합니다.",
        arrayUnique: "{field}의 {actual} 값은 {expected}에서 유일해야합니다.",
        arrayEnum: "{field}의 {actual} 값은 {expected}에 속해야합니다.",

        boolean: "{field}이/가 부울 값이 아닙니다.",

        date: "{field}이/가 날짜가 아닙니다.",
        dateMin: "{field}이/가 {expected} 보다 이전입니다.",
        dateMax: "{field}이/가 {expected} 보다 이후입니다.",

        enumValue: "{field}을/를 {expected} 중에 입력해주세요.",

        equalValue: "{field}이/가 {expected} 값과 일치하지 않습니다.",
        equalField: "{field}이/가 입력된 {expected}와/과 일치하지 않습니다.",

        forbidden: "{field}은/는 허용되지 않습니다.",

        function: "{field}이/가 올바른 함수가 아닙니다.",

        email: "입력한 {field}이/가 올바른 양식이 아닙니다.",

        luhn: "{field}이/가 올바른 luhn 체크섬이 아닙니다.",

        mac: "{field}이/가 올바른 MAC 주소가 아닙니다.",

        object: "{field}이/가 객체가 아닙니다.",
        objectStrict: "{field}이/가 {actual} 값들을 포함 할 수 없습니다.",

        url: "입력한 {field}이/가 올바른 양식이 아닙니다.",

        uuid: "{field}이/가 올바른 UUID가 아닙니다.",
        uuidVersion: "{field}이/가 올바른 UUID 버전이 아닙니다.",

        phone: `입력한 {field}이/가 올바른 양식이 아닙니다.`,

        duplicate: `이미 사용중인 {field}입니다.`,
      },
    },
  },
};

export default message;
