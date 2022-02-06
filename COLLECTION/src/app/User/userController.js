const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

var regExp = /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/;
var regExpcheck = /^01([0|1|6|7|8|9])([0-9]{3,4})?([0-9]{4})$/;
var blank_pattern = /^\s+|\s+$/g;

/**
 * API No. 1
 * API Name : 회원가입 API
 * [POST] /app/user/register
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

    //공백문자 체크
    var Name = name.toString();
    var Nickname = nickname.toString();
    var id = ID.toString();
    var Password = password.toString();
    var PhoneNumber = phoneNumber.toString();

    if(Name.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_TEXT));
    }
    if(Nickname.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_TEXT));
    }
    if(id.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_TEXT));
    }
    if(Password.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_TEXT));
    }
    if(PhoneNumber.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_TEXT));
    }

    // 길이 체크
    var IDTrim = ID.toString().trim();
    var PasswordTrim = password.toString().trim();
    var NicknameTrim = nickname.toString().trim();

    if (IDTrim.length < 6 || IDTrim.length > 15 )  
        return res.send(response(baseResponse.REGISTER_ID_LENGTH));

    if (PasswordTrim.length < 6 || PasswordTrim.length > 15 )  
        return res.send(response(baseResponse.REGISTER_PW_LENGTH));

    if (NicknameTrim.length < 2 || NicknameTrim.length > 6 )  
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
 * [GET] /app/user/duplicate-id
 */

exports.getDuplicateID = async function (req, res) {

    const ID = req.query.ID;

    //빈 값 체크
    if (!ID)
        return res.send(response(baseResponse.REGISTER_ID_EMPTY));

    try{
        const IDRows = await userProvider.IDCheck(ID);
        if (IDRows.length > 0){
            return res.send(response(baseResponse.REGISTER_ID_REDUNDANT));
        }
        else{
            return res.send(response(baseResponse.SUCCESS_DUPLICATE_ID));
        }
    } catch (err) {
        logger.error(`App - getDuplicateID Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return res.send(response(baseResponse.DB_ERROR));
    }

    
};


/**
 * API No. 3
 * API Name : 닉네임 확인
 * [GET] /app/user/check-nickname
 */

exports.getNickname = async function(req, res) {

    const nickname = req.query.nickname;

    //빈 값 체크
    if(!nickname)
        return res.send(response(baseResponse.REGISTER_NICKNAME_EMPTY)); 

    if (nickname.length < 2 || nickname.length > 6 )  
        return res.send(response(baseResponse.REGISTER_NICKNAME_LENGTH));

    try{
        const nicknameRows = await userProvider.nicknameCheck(nickname);
        if (nicknameRows.length > 0){
            return res.send(response(baseResponse.REGISTER_NICKNAME_REDUNDANT));
        }
        else{
            return res.send(response(baseResponse.SUCCESS_DUPLICATE_NICKNAME));
        }
    } catch (err) {
        logger.error(`App - getNickname Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return res.send(response(baseResponse.DB_ERROR));
    }


};


/**
 * API NO. 4
 * API Name : 로그인
 * [POST] /app/user/login
 */

exports.postLogin = async function (req, res) {

    const ID = req.body.ID;
    const password = req.body.password;

    //빈 값 체크
    if(!ID)
        return res.send(response(baseResponse.REGISTER_ID_EMPTY)); 

    if(!password)
        return res.send(response(baseResponse.REGISTER_PW_EMPTY)); 


    const logInResponse = await userService.postLogIn(ID,password);

    return res.send(logInResponse);
}

/**
 * API NO.5
 * API Name : 회원정보 수정 (닉네임)
 * [PATCH] /app/user/modi-nickname/:userIdx
 * path variable : userIdx
 * body : nickname
 */

exports.patchModiNickname = async function (req, res) {

    const IDFromJWT = req.verifiedToken.userIdx;

    const userIdx = req.params.userIdx;
    
    const nickname = req.body.nickname;

    if (IDFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USERID_NOT_MATCH))
    } 
    if(!userIdx){
        res.send(errResponse(baseResponse.USERID_EMPTY))
    }
    else {
        if (!nickname) 
            return res.send(errResponse(baseResponse.MODI_NEW_NICKNAME_EMPTY));

        const nicknameRows = await userProvider.nicknameCheck(nickname);
        if (nicknameRows.length > 0)
            return res.send(response(baseResponse.REGISTER_NICKNAME_REDUNDANT));
        
        else if (nickname.length < 2 || nickname.length > 6 )  
            return res.send(response(baseResponse.REGISTER_NICKNAME_LENGTH));

 

        const editNickname = await userService.editNickname(nickname, userIdx);
        return res.send(editNickname);

    }

}

/**
 * API NO.6
 * API Name : 회원정보 수정(비밀번호)
 * [PATCH] /app/user/modi-password/:userIdx
 * path variable : userIdx
 * body : password
 */

exports.patchModiPW = async function (req, res) {
    const IDFromJWT = req.verifiedToken.userIdx;

    const userIdx = req.params.userIdx;
    
    const originPassword = req.body.originPassword;

    const newPassword = req.body.newPassword;

    const checkPassword = req.body.checkPassword;


    if (IDFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USERID_NOT_MATCH))
    } 
    if(!userIdx){
        res.send(errResponse(baseResponse.USERID_EMPTY))
    }
    else {
        //빈값
        if (!originPassword)
            return res.send(errResponse(baseResponse.MODI_OLD_PW_EMPTY))
        if (!newPassword)
            return res.send(errResponse(baseResponse.MODI_NEW_PW_EMPTY))
        if(!checkPassword)
            return res.send(errResponse(baseResponse.MODI_CHECK_PW_EMPTY))


        //길이
        if (originPassword.length < 6 || originPassword.length > 15 )  
            return res.send(response(baseResponse.REGISTER_PW_LENGTH));
        if (newPassword.length < 6 || newPassword.length > 15 )  
            return res.send(response(baseResponse.REGISTER_PW_LENGTH));
        if (checkPassword.length < 6 || checkPassword.length > 15 )  
            return res.send(response(baseResponse.REGISTER_PW_LENGTH));

        
        const editPW = await userService.editPW(
            userIdx, 
            originPassword,
            newPassword,
            checkPassword,
        );

        return res.send(editPW)
    }
    
}

/**
 * API NO. 7
 * API Name : 회원정보 수정 (전화번호)
 * [PATCH] /app/user/modi-phone/:userIdx
 * path variable : userIdx
 * body : phoneNumber
 */

exports.patchModiPhone = async function (req, res) {
    const IDFromJWT = req.verifiedToken.userIdx;

    const userIdx = req.params.userIdx;

    const phoneNumber = req.body.phoneNumber;

    if (IDFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USERID_NOT_MATCH))
    } 
    if(!userIdx){
        res.send(errResponse(baseResponse.USERID_EMPTY))
    }
    else {
        if (!phoneNumber)
            return res.send(errResponse(baseResponse.MODI_NEW_PHONE_EMPTY));

        else if (regExp.test(phoneNumber)) 
            return res.send(response(baseResponse.REGISTER_PHONE_ERROR_TYPE_HYPHEN));

        else if (!regExpcheck.test(phoneNumber))
            return res.send(response(baseResponse.REGISTER_PHONE_INVALID_VALUE));
        
    }

    const editPhone = await userService.editPhone(phoneNumber, userIdx);
    return res.send(editPhone);
}

/**
 * API No. 8
 * API Name : 회원탈퇴 
 * [DELETE] /app/user/unregister:userIdx
 * path variable : userIdx
 * body : password
 */

exports.deleteUnregister = async function (req, res) {

    const IDFromJWT = req.verifiedToken.userIdx;

    const userIdx = req.params.userIdx;

    const password = req.body.password;

    if (IDFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USERID_NOT_MATCH))
    } 
    if(!userIdx){
        res.send(errResponse(baseResponse.USERID_EMPTY))
    }
    else {
        if (!password)
            res.send(errResponse(baseResponse.UNREGISTER_PW_EMPTY));
    }

    const unregister = await userService.unregister(password, userIdx);
    return res.send(unregister);

}




