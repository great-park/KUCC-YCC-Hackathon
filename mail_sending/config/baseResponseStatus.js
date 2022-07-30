module.exports = {
  // Success
  SUCCESS: { isSuccess: true, code: 1000, message: "성공" },

  // Common
  TOKEN_EMPTY: {
    isSuccess: false,
    code: 2000,
    message: "JWT 토큰을 입력해주세요.",
  },
  TOKEN_VERIFICATION_FAILURE: {
    isSuccess: false,
    code: 3000,
    message: "JWT 토큰 검증 실패",
  },
  TOKEN_VERIFICATION_SUCCESS: {
    isSuccess: true,
    code: 1001,
    message: "JWT 토큰 검증 성공",
  },

  //Request error
  EMAIL_DO_NOT_EXIST: {
    isSuccess: false,
    code: 2001,
    message: "없는 email 입니다.",
  },

  KEYWORD_DO_NOT_EXIST: {
    isSuccess: false,
    code: 2002,
    message: "없는 keyword 입니다.",
  },
};
