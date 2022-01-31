const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

var regExp = /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/;
var regExpcheck = /^01([0|1|6|7|8|9])([0-9]{3,4})?([0-9]{4})$/;

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// exports.getTest = async function (req, res) {
//     return res.send(response(baseResponse.SUCCESS))
// }

/**
 * API No. 1
 * API Name : 회원가입 API
 * [POST] /app/users/register
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: name,nickname,ID,password,phoneNumber
     */
    const {name,nickname,ID,password,phoneNumber} = req.body;

    // 빈 값 체크
    if (!name)
        return res.send(response(baseResponse.REGISTER_NAME_EMPTY));

    if (!nickname)
        return res.send(response(baseResponse.REGISTER_NICKNAME_EMPTY));

    if (!ID)
        return res.send(response(baseResponse.REGISTER_ID_EMPTY));

    if (!password)
        return res.send(response(baseResponse.REGISTER_PW_EMPTY));

    if (!phoneNumber)
        return res.send(response(baseResponse.REGISTER_PHONE_EMPTY));

    // 길이 체크
    if (ID.length < 6 || ID.length > 15 )  
        return res.send(response(baseResponse.REGISTER_ID_LENGTH));

    if (password.length < 6 || password.length > 15 )  
        return res.send(response(baseResponse.REGISTER_PW_LENGTH));

    if (nickname.length < 2 || nickname.length > 6 )  
        return res.send(response(baseResponse.REGISTER_NICKNAME_LENGTH));


    // 형식 체크 (by 정규표현식)

    if (regExp.test(phoneNumber)) 
        return res.send(response(baseResponse.REGISTER_PHONE_ERROR_TYPE_HYPHEN))
    if (!regExpcheck.test(phoneNumber))
        return res.send(response(baseResponse.REGISTER_PHONE_INVALID_VALUE))

    // register 함수 실행을 통한 결과 값을 registerResponse에 저장
    const registerResponse = await userService.register(
        name,
        nickname,
        ID,
        password,
        phoneNumber,
    );

    // registerResponse 값을 json으로 전달
    return res.send(registerResponse);
};

/**
 * API No. 2
 * API Name : 중복 ID 확인 
 * [GET] /app/users/duplicate-id
 */

exports.duplicateID = async function (req, res) {

    const ID = req.body;

    //빈 값 체크
    if (!ID)
        return res.send(response(baseResponse.REGISTER_ID_EMPTY));

    //중복 체크
    const IDRows = await userProvider.IDCheck(ID);
    if (IDRows.length > 0)
        return res.send(response(baseResponse.REGISTER_ID_REDUNDANT));
    else
        return res.send(response(baseResponse.SUCCESS_DUPLICATE_ID));
    
};


/**
 * API No. 3
 * API Name : 중복 닉네임 확인
 * [GET] /app/users/duplicate-nickname
 */

exports.duplicateNickname = async function(req, res) {

    const nickname = req.body;

    //빈 값 체크
    if(!nickname)
        return res.send(response(baseResponse.REGISTER_NICKNAME_EMPTY)); 

    //중복 체크
    const nicknameRows = await userProvider.nicknameCheck(nickname);
        if (nicknameRows.length > 0)
            return res.send(response(baseResponse.REGISTER_NICKNAME_REDUNDANT));
        else
            return res.send(response(baseResponse.SUCCESS_DUPLICATE_NICKNAME));
};


/**
 * API NO. 4
 * API Name : 로그인
 * [POST] /app/user/login
 */

exports.login = async function (req, res) {

    const {ID, password} = req.body;

    //빈 값 체크
    if(!ID)
        return res.send(response(baseResponse.REGISTER_ID_EMPTY)); 

    if(!password)
        return res.send(response(baseResponse.REGISTER_PW_EMPTY)); 


    const logInResponse = await userService.postLogIn(ID,password);

    return res.send(logInResponse);
}




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

