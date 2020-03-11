"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ko = {
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
            description: "이미 존재하는 계정입니다.",
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
                required: "[field]이/가 필요합니다.",
                string: "[field]이/가 문자열이 아닙니다.",
                stringEmpty: "[field]이/가 필요합니다.",
                stringMin: "[field]은/는 [expected] 글자 이상이여야 합니다.",
                stringMax: "[field]은/는 [expected] 글자 이하여야 합니다.",
                stringLength: "[field]은/는 [expected] 글자여야 합니다.",
                stringPattern: "[field]이/가 올바른 양식이 아닙니다.",
                stringContains: "[field]은/는 [expected]을/를 포함해야합니다.",
                stringEnum: "[field]이/가 허용된 값이 아닙니다.",
                stringNumeric: "[field]이/가 올바른 숫자 표기가 아닙니다.",
                stringAlpha: "[field]은/는 알파벳만 포함 할 수 있습니다.",
                stringAlphanum: "[field]은/는 알파벳과 숫자만 포함 할 수 있습니다.",
                stringAlphadash: "[field]은/는 알파벳과 숫자, 대시(-)만 포함 할 수 있습니다.",
                number: "[field]이/가 숫자가 아닙니다.",
                numberMin: "[field]이/가 [expected] 보다 작습니다.",
                numberMax: "[field]이/가 [expected] 보다 큽니다.",
                numberEqual: "[field]이/가 [expected] 값과 다릅니다.",
                numberNotEqual: "[field]이/가 [expected] 값과 같습니다.",
                numberInteger: "[field]이/가 정수가 아닙니다.",
                numberPositive: "[field]이/가 양수가 아닙니다.",
                numberNegative: "[field]이/가 음수가 아닙니다.",
                array: "[field]은/는 배열이여야 합니다.",
                arrayEmpty: "[field]에 한개 이상의 항목이 필요합니다.",
                arrayMin: "[field]에 최소 [expected]개 이상의 항목이 필요합니다.",
                arrayMax: "[field]에 최대 [expected]개 이하의 항목이 필요합니다.",
                arrayLength: "[field]에 [expected]개의 항목이 필요합니다.",
                arrayContains: "[field]에 [expected] 항목이 필요합니다.",
                arrayUnique: "[field]의 [actual] 값은 [expected]에서 유일해야합니다.",
                arrayEnum: "[field]의 [actual] 값이 [expected] 중에 해당되지 않습니다.",
                boolean: "[field]이/가 부울 값이 아닙니다.",
                date: "[field]이/가 날짜가 아닙니다.",
                dateMin: "[field]이/가 [expected] 보다 이전입니다.",
                dateMax: "[field]이/가 [expected] 보다 이후입니다.",
                enumValue: "[field]이/가 [expected] 중에 해당되어지 않습니다.",
                equalValue: "[field]이/가 [expected] 값과 일치하지 않습니다.",
                equalField: "[field]이/가 입력된 [expected]와/과 일치하지 않습니다.",
                forbidden: "[field]은/는 허용되지 않습니다.",
                function: "[field]이/가 올바른 함수가 아닙니다.",
                email: "입력한 [field]이/가 올바른 양식이 아닙니다.",
                luhn: "[field]이/가 올바른 luhn 체크섬이 아닙니다.",
                mac: "[field]이/가 올바른 MAC 주소가 아닙니다.",
                object: "[field]이/가 객체가 아닙니다.",
                objectStrict: "[field]이/가 [actual] 값들을 포함 할 수 없습니다.",
                url: "입력한 [field]이/가 올바른 양식이 아닙니다.",
                uuid: "[field]이/가 올바른 UUID가 아닙니다.",
                uuidVersion: "[field]이/가 올바른 UUID 버전이 아닙니다.",
                phone: `입력한 [field]이/가 올바른 양식이 아닙니다.`,
                duplicate: `[field]이/가 이미 사용중입니다.`,
            },
        },
    },
};
// 종성이 있으면 첫째 조사 없으면 둘째 조사
const patterns = {
    "을/를": ["을", "를"],
    "이/가": ["이", "가"],
    "와/과": ["과", "와"],
};
exports.processKoreanJosa = (value, keys, options) => {
    if (options.lng !== "ko") {
        return value;
    }
    for (const [pattern, josas] of Object.entries(patterns)) {
        const tokens = value.split(pattern).filter(t => !!t);
        const lastToken = tokens.pop();
        if (tokens.length === 0) {
            continue;
        }
        let tmp = "";
        for (const token of tokens) {
            const charCode = token.charCodeAt(token.length - 1);
            tmp += token;
            tmp += (charCode - 0xac00) % 28 > 0 ? josas[0] : josas[1];
        }
        value = tmp + lastToken;
    }
    return value;
};
exports.default = ko;
//# sourceMappingURL=i18n.ko.js.map