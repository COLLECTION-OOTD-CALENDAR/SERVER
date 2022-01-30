//Response로 보내줄 상태코드와 메세지 등을 이 파일에서 관리함

module.exports = {

    // Success
    SUCCESS_REGISTER : { "isSuccess": true, "code": 1000, "message":"회원가입 성공" },
    SUCCESS_DUPLICATE_ID : { "isSuccess": true, "code": 1021, "message":"새로운 ID 확인 성공" },
    SUCCESS_DUPLICATE_NICKNAME : { "isSuccess": true, "code": 1022, "message":"새로운 NICKNAME 확인 성공" },
    SUCCESS_LOGIN : { "isSuccess": true, "code": 1001, "message":"로그인 성공" },
    SUCCESS_USERS_MODI : { "isSuccess": true, "code": 1002, "message":"회원정보 수정 성공" },
    SUCCESS_UNREGISTER : { "isSuccess": true, "code": 1003, "message":"회원탈퇴 성공" },
    SUCCESS_MONTHLY_CALENDAR : { "isSuccess": true, "code": 1004, "message":"Monthly OOTD 불러오기 성공" },
    SUCCESS_WEEKLY_CALENDAR : { "isSuccess": true, "code": 1005, "message":"Weekly OOTD 불러오기 성공" },
    SUCCESS_LAST_REGISTER : { "isSuccess": true, "code": 1008, "message":"사용자 블럭 추가 성공" },
    SUCCESS_OOTD_MODI : { "isSuccess": true, "code": 1012, "message":"지난 작성 화면 보여주기 성공" },
    SUCCESS_OOTD_DELETION : { "isSuccess": true, "code": 1013, "message":"OOTD 삭제 성공" },
    SUCCESS_OOTD_COMPLETE : { "isSuccess": true, "code": 1014, "message":"OOTD 완료 페이지 불러오기 성공" },
    SUCCESS_MYLOOK_MAIN : { "isSuccess": true, "code": 1015, "message":"MY LOOK 메인 페이지 불러오기 성공" },
    SUCCESS_MYLOOK_DETAIL : { "isSuccess": true, "code": 1016, "message":"MY LOOK 상세페이지 불러오기 성공" },
    SUCCESS_SEARCH_MAIN : { "isSuccess": true, "code": 1017, "message":"PWWC 검색 초기 화면 불러오기 성공 " },
    SUCCESS_SEARCH_DELETION : { "isSuccess": true, "code": 1018, "message":"PWWC 검색 History 삭제 성공" },
    SUCCESS_SEARCH_ADDITION : { "isSuccess": true, "code": 1019, "message":"History 추가 성공" },
    SUCCESS_MATCH : { "isSuccess": true, "code": 1020, "message":"매칭 페이지 검색 결과 불러오기 성공" },
    SUCCESS_MATCH_DATE : { "isSuccess": true, "code": 1023, "message":"날짜 기반 매칭 페이지 검색 결과 불러오기 성공" },



    // Common
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 2001, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 2000, "message":"JWT 토큰 검증 성공" },     
    TOKEN_EMPTY : { "isSuccess": false, "code": 2002, "message":"JWT 토큰을 입력해주세요." },



    //Request error
    REGISTER_ID_EMPTY : { "isSuccess": false, "code": 3000, "message":"ID 입력해주세요" },
    REGISTER_ID_LENGTH : { "isSuccess": false, "code": 3001, "message":"ID는 6~15자리를 입력해주세요" },
    REGISTER_ID_REDUNDANT : { "isSuccess": false, "code": 3002, "message":"이미 존재하는 ID입니다." },

    REGISTER_PW_EMPTY : { "isSuccess": false, "code": 3003, "message":"비밀번호를 입력해주세요" },
    REGISTER_PW_LENGTH : { "isSuccess": false, "code": 3004, "message":"비밀번호는 6~15자리를 입력해주세요" },
    
    REGISTER_NICKNAME_EMPTY : { "isSuccess": false, "code": 3005, "message":"닉네임을 입력해주세요" },
    REGISTER_NICKNAME_LENGTH : { "isSuccess": false, "code": 3006, "message":"닉네임은 2~6자리를 입력해주세요" },
    REGISTER_NICKNAME_REDUNDANT : { "isSuccess": false, "code": 3007, "message":"이미 존재하는 닉네임입니다." },
    
    REGISTER_PHONE_EMPTY : { "isSuccess": false, "code": 3008, "message":"전화번호를 입력해주세요(-제외)" },
    REGISTER_PHONE_ERROR_TYPE_HYPHEN : { "isSuccess": false, "code": 3009, "message":"-를 제외하고 입력해주세요" },
    REGISTER_PHONE_ERROR_TYPE : { "isSuccess": false, "code": 3010, "message":"올바르지 않은 전화번호 형식입니다." },
    
    LOGIN_ID_WRONG : { "isSuccess": false, "code": 3011, "message": "존재하지 않는 ID입니다." },
    LOGIN_PW_WRONG : { "isSuccess": false, "code": 3012, "message": "비밀번호가 잘못되었습니다." },


    MODI_OLD_PW_EMPTY : { "isSuccess": false, "code": 3014, "message": "기존 비밀번호를 입력해주세요." },
    MODI_NEW_PW_EMPTY : { "isSuccess": false, "code": 3015, "message": "새 비밀번호를 입력해주세요." },
    MODI_CHECK_PW_EMPTY : { "isSuccess": false, "code": 3016, "message": "새 비밀번호 확인을 입력해주세요." },
    MODI_NEW_NICKNAME_EMPTY : { "isSuccess": false, "code": 3017, "message": "새로운 닉네임을 입력해주세요." },
    MODI_NEW_PHONE_EMPTY : { "isSuccess": false, "code": 3018, "message": "새로운 전화번호를 입력해주세요.(-제외)" },

    UNREGISTER_PW_EMPTY : { "isSuccess": false, "code": 3019, "message": "탈퇴확인을 위해 비밀번호를 입력해주세요." },
    UNREGISTER_PW_WRONG : { "isSuccess": false, "code": 3020, "message": "일치하지 않는 비밀번호입니다." },

    DATE_ERROR_TYPE : { "isSuccess": false, "code": 3021, "message": "유효하지 않는 날짜입니다." },
    USERID_NOT_MATCH : { "isSuccess": false, "code": 3022, "message": "유효하지 않은 userIdx가 입력되었습니다." },
    USERID_EMPTY : { "isSuccess": false, "code": 3023, "message": "userIdx가 입력되어야 합니다." },
    WEEKLY_OOTD_EMPTY : { "isSuccess": false, "code": 3024, "message": "근 일주일간 OOTD가 존재하지 않습니다." },
    DATE_OOTD_EMPTY : { "isSuccess": false, "code": 3025, "message": "입력된 Date의 OOTD가 존재하지 않습니다." },


    DATE_EMPTY : { "isSuccess": false, "code": 3026, "message": "date값을 입력해야 합니다." },
    PWW_ERROR_TYPE : { "isSuccess": false, "code": 3027, "message": "유효하지 않은 PWW flag(0,1,2)값이 입력되었습니다." },
    
    QUERY_STRING_EMPTY : { "isSuccess": false, "code": 3028, "message": "Query String을 입력해야 합니다." },
    PWWC_BLANK_TEXT : { "isSuccess": false, "code": 3029, "message": "공백문자만으로는 새로운 태그를 추가할 수 없습니다." },        
    BIGCLASS_ERROR_TYPE : { "isSuccess": false, "code": 3030, "message": "유효하지 않은 bigClass가 입력되었습니다." },

    LOOKPOINT_ERROR_TYPE : { "isSuccess": false, "code": 3031, "message": "lookpoint 범위 내의 값이 아닙니다." },
    LOOKPOTNT_EMPTY : { "isSuccess": false, "code": 3032, "message": "lookpoint값을 입력해야 합니다." },
    PWWC_ERROR_TYPE: { "isSuccess": false, "code": 3033, "message": "Place, Weather, Who, Color에 해당하지 않는 검색입니다." },

    HISTORY_INACTIVE : { "isSuccess": false, "code": 3034, "message": "삭제된 History입니다." },
    HISTORY_INDEX_ERROR : { "isSuccess": false, "code": 3035, "message": "회원 상태값을 입력해주세요" },


    PWWC_ERROR_TYPE : { "isSuccess": false, "code": 3036, "message": "유효하지 않은 PWWC flag(0,1,2,3) 값이 입력되었습니다." },
    FLAG_EMPTY : { "isSuccess": false, "code": 3037, "message": "Query String에 flag를 입력해야 합니다." },
    KEYWORD1_EMPTY : { "isSuccess": false, "code": 3038, "message": "keyword1 Query String을 입력해야 합니다." },
    STARTAT_EMPTY : { "isSuccess": false, "code": 3039, "message": "startAt Query String을 입력해야 합니다." },
    ENDAT_EMPTY : { "isSuccess": false, "code": 3040, "message": "endAt Query String을 입력해야 합니다." },



    
    //Response Error
    LOOKPOINT_RESPONSE_ERROR : { "isSuccess": false, "code": 4000, "message": "LOOKPOINT 값 추출에 실패했습니다."},
    SEARCH_DATE_OOTD_EMPTY : { "isSuccess": false, "code": 4001, "message": "선택하신 날짜에 해당하는 OOTD가 존재하지 않습니다." },
    LOGIN_UNREGISTER_USER : { "isSuccess": false, "code": 4002, "message": "탈퇴된 계정입니다. 문의해주세요." },

}