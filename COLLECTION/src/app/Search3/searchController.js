const jwtMiddleware = require("../../../config/jwtMiddleware");
const searchProvider = require("./searchProvider");
//const searchService = require("./searchService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
var blankPattern = /^\s+|\s+$/g;

/**
 * API No. 15
 * API Name : [PWWC] 검색 초기화면 보여주기 API
 * [GET] /app/search/mainpage/:PWWC
 * Path variable : PWWC
 */
exports.searchMain = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;
    const PWWC = req.params.PWWC;

    // PWWC Path variable이 입력되지 않았을 때
    if(PWWC === '' || PWWC === null || PWWC === undefined || PWWC === NaN){
        return res.send(errResponse(baseResponse.PWWC_EMPTY));
    }

    // PWWC Path variable이 숫자가 아닌 경우(약한 검사)
    if(isNaN(PWWC)){
        return res.send(errResponse(baseResponse.PWWC_ERROR_TYPE));
    }

    // PWWC Path variable이 0,1,2,3 값이 아닌 경우
    if(PWWC < 0 || PWWC > 3){
        return res.send(errResponse(baseResponse.PWWC_INVALID_VALUE));
    }

    const searchHistoryResult = await searchProvider.retrieveSearchHistory(userIdx, PWWC);
    return res.send(response(baseResponse.SUCCESS_SEARCH_MAIN, searchHistoryResult));

};


/**
 * API No. 19
 * API Name : [PWWC] 매칭 페이지 검색 키워드 제안 API
 * [GET] /app/search/suggestion/:PWWC
 * Path variable : PWWC
 * Query string : keyword1
 */
exports.suggestSearchKeyword = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;
    const PWWC = req.params.PWWC;
    const keyword1 = req.query.keyword1;

    // PWWC Path variable이 입력되지 않았을 때
    if(PWWC === '' || PWWC === null || PWWC === undefined || PWWC === NaN){
        return res.send(errResponse(baseResponse.PWWC_EMPTY));
    }

    // PWWC Path variable이 숫자가 아닌 경우(약한 검사)
    if(isNaN(PWWC)){
        return res.send(errResponse(baseResponse.PWWC_ERROR_TYPE));
    }

    // PWWC Path variable이 0,1,2,3 값이 아닌 경우
    if(PWWC < 0 || PWWC > 3){
        return res.send(errResponse(baseResponse.PWWC_INVALID_VALUE));
    }

    // Keyword1 Query string이 없는 경우 (key / value)
    if(!keyword1){
        return res.send(errResponse(baseResponse.KEYWORD1_EMPTY));
    }
    
    // Keyword1 Query String에 공백만 입력된 경우
    keyword1 = keyword1.toString();
    if(keyword1.replace(blankPattern, '') == ""){
        return res.send(errResponse(baseResponse.REGISTER_BLANK_ALL));
    }

    // Keyword1의 길이가 6글자를 넘을 경우
    if(keyword1.length > 6){
        return res.send(errResponse(baseResponse.SEARCH_KEYWORD_LENGTH));
    }

    const suggestKeywordResult = await searchProvider.retrieveSuggestKeyword(userIdx, PWWC, keyword1);
    return res.send(response(baseResponse.SUCCESS_SEARCH_SUGGEST, suggestKeywordResult));
};

/************************************************ */
/************************************************ */
/************************************************ */


/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
/*
exports.getUsers = async function (req, res) {

    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        // SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" }, 메세지와 함께 userListResult 호출
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 아메일을 통한 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};
*/

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
/*
exports.getUserById = async function (req, res) {

    const userId = req.params.userId;
    // errResponse 전달
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    // userId를 통한 유저 검색 함수 호출 및 결과 저장
    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};
*/

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
/*
exports.login = async function (req, res) {

    const {email, password} = req.body;

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};
*/

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
/*
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    // JWT는 이 후 주차에 다룰 내용
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};
*/