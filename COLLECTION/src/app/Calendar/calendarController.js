const jwtMiddleware = require("../../../config/jwtMiddleware");
const calendarProvider = require("./calendarProvider");
//const calendarService = require("./calendarService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

var datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/; 
var lookpointPattern = /^[1-5]$/;
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

        const editUserInfo = await calendarService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};
*/
/**
 * API No. 6
 * API Name : Monthly 달력 OOTD 부르기 API + JWT
 * [GET] /app/calendar/monthly/:userIdx
 * path variable : userIdx
 * jwt : userIdx
 */
exports.getMonth = async function (req, res) {

    console.log('calendarController : 처음 오류발생');
    const userIdxFromJWT = req.verifiedToken.userIdx;

    const userIdx = req.params.userIdx;
    console.log('calendarController : 변수 받기 성공');

    // 비어있는 userIdx 입력
    if(!userIdx){
        return res.send(errResponse(baseResponse.USERID_EMPTY));
    }

    // 유효하지 않은 userIdx 입력
    if(userIdxFromJWT != userIdx) { 
        return res.send(errResponse(baseResponse.USERID_NOT_MATCH));
    }
    console.log('calendarController : request error check complete');

    // userIdx를 통한 Monthly 달력 OOTD 검색 함수 및 결과 저장
    const callMonthCalOotd = await calendarProvider.retrieveMonthlyList(userIdx);
    
    for(i in callMonthCalOotd){
        //lookpoint 값 추출 확인
        if(!lookpointPattern.test(callMonthCalOotd[i].lookpoint)){
            return res.send(errResponse(baseResponse.LOOKPOINT_RESPONSE_ERROR));
        }
        //date 값 추출 확인
        if(!datePattern.test(callMonthCalOotd[i].date)){
            return res.send(rrResponse(baseResponse.DATE_RESPONSE_ERROR));
        }
    }
    return res.send(response(baseResponse.SUCCESS_MONTHLY_CALENDAR, callMonthCalOotd));

}

/**
 * API No. 7
 * API Name : Weekly 달력 OOTD 부르기 API + JWT
 * [GET] /app/calendar/weekly/:userIdx
 * path variable : userIdx
 * jwt : userIdx
 */
exports.getWeek = async function (req, res) {

    console.log('calendarController : 처음 오류발생');
    const userIdxFromJWT = req.verifiedToken.userIdx;
    
    const userIdx = req.params.userIdx;
    console.log('calendarController : 변수 받기 성공');
     // 비어있는 userIdx 입력
    if(!userIdx){
        return res.send(errResponse(baseResponse.USERID_EMPTY));
    }

    // 유효하지 않은 userIdx 입력
    if(userIdxFromJWT != userIdx) { 
        return res.send(errResponse(baseResponse.USERID_NOT_MATCH));
    }
    console.log('calendarController : request error check complete');

    // userId를 통한 Weekly 달력 OOTD 검색 함수 및 결과 저장
    const callWeekCalOotd = await calendarProvider.retrieveWeeklyList(userIdx);

    for(i in callWeekCalOotd){
        // lookpoint 값 추출 확인
        if(!lookpointPattern.test(callWeekCalOotd[i].lookpoint)){
            return res.send(errResponse(baseResponse.LOOKPOINT_RESPONSE_ERROR));
        }
        //date 값 추출 확인
        if(!datePattern.test(callWeekCalOotd[i].date)){
            return res.send(errResponse(baseResponse.DATE_RESPONSE_ERROR));
        }
    }

    return res.send(response(baseResponse.SUCCESS_WEEKLY_CALENDAR, callWeekCalOotd));

};


/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
/*
exports.getWeek = async function (req, res) {


    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await calendarProvider.retrieveUserList();
        // SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" }, 메세지와 함께 userListResult 호출
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 아메일을 통한 유저 검색 조회
        const userListByEmail = await calendarProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
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

    const signInResponse = await calendarService.postSignIn(email, password);

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

        const editUserInfo = await calendarService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};
*/


// JWT 이 후 주차에 다룰 내용
/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
/*
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
*/