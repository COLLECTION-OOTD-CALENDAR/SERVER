const jwtMiddleware = require("../../../config/jwtMiddleware");
const mylookProvider = require("./mylookProvider");
const mylookService = require("./mylookService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");



/**
 * API No. 1
 * API Name : myLook 메인페이지 API
 * [GET] /app/mylook/mainpage/:userIdx/:lookpoint
 * path variable : userIdx , lookpoint
 */
exports.getMyLookMain = async function (req, res) {

    const IDFromJWT = req.verifiedToken.userIdx;

    const userIdx = req.params.userIdx;
    const lookpoint = req.params.lookpoint;

    if (IDFromJWT != userIdx) {
        return res.send(errResponse(baseResponse.USERID_NOT_MATCH));
    } 
    else {
        if(!userIdx){
            return res.send(errResponse(baseResponse.USERID_EMPTY));
        }
        if(!lookpoint){
            return res.send(errResponse(baseResponse.LOOKPOTNT_EMPTY));
        }
        if(lookpoint < 0 || lookpoint > 5){
            return res.send(errResponse(baseResponse.LOOKPOINT_INVALID_VALUE));
        }

        const getMyLook = await mylookProvider.getMyLookMain(lookpoint, userIdx);
        return res.send(getMyLook);
    }

};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
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

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;
    // errResponse 전달
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    // userId를 통한 유저 검색 함수 호출 및 결과 저장
    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
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






// JWT 이 후 주차에 다룰 내용
/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
