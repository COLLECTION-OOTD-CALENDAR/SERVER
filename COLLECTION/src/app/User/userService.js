const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const userProvider = require("./userProvider");
const userDao = require("./userDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리 
// 회원가입 API
exports.register = async function (name,nickname,ID,password,phoneNumber) {
    try {
        // ID 중복 확인
        // UserProvider에서 해당 ID와 같은 User 목록을 받아서 IDRows에 저장한 후, 배열의 길이를 검사한다.
        // -> 길이가 0 이상이면 이미 해당 ID를 갖고 있는 User가 조회된다는 의미
        const IDRows = await userProvider.IDCheck(ID);
        console.log(`뭐가문제일까 : ${IDRows}`);
        if (IDRows.length > 0)
            return errResponse(baseResponse.REGISTER_ID_REDUNDANT);

        // 닉네임 중복 확인 
        // ID 중복 확인 방법과 동일하게 진행 
        const nicknameRows = await userProvider.nicknameCheck(nickname);
            if (nicknameRows.length > 0)
                return errResponse(baseResponse.REGISTER_NICKNAME_REDUNDANT);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        const insertUserInfoParams = [name,nickname,ID,hashedPassword,phoneNumber];

        const connection = await pool.getConnection(async (conn) => conn);

        const userResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${ID}`);
        connection.release();
        return response(baseResponse.SUCCESS_REGISTER);

    } catch (err) {
        logger.error(`App - register Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 로그인 API
exports.postLogIn = async function (ID, password) {
    try {
        // ID 여부 확인
        const IDRows = await userProvider.IDCheck(ID);
         if (IDRows.length < 1) return errResponse(baseResponse.LOGIN_ID_WRONG);

        const selectID = IDRows[0].ID

        // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectID, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.LOGIN_PW_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(ID);

        //  if (userInfoRows[0].status === "INACTIVE") {
        //      return errResponse(baseResponse.LOGIN_ID_WRONG);
        // } 
        if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.LOGIN_UNREGISTER_USER); //탈퇴한 USER
        }

        console.log(userInfoRows[0].ID) // DB의 ID 

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].ID,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS_LOGIN, {'userId': userInfoRows[0].ID, 'jwt': token});

    } catch (err) {
        logger.error(`App - postLogIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//중복 ID 확인 API 
exports.dupliID = async function(ID){
    try{
        const IDRows = await userProvider.IDCheck(ID);
        console.log(`뭐가문제일까 : ${IDRows}`);
        if (IDRows.length > 0){
            return errResponse(baseResponse.REGISTER_ID_REDUNDANT);
        }
        else{
            return errResponse(baseResponse.SUCCESS_DUPLICATE_ID);
        }
    } catch (err) {
        logger.error(`App - dupliID Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//중복 닉네임 확인 API
exports.dupliNickname = async function(nickname){
    try{
        const nicknameRows = await userProvider.nicknameCheck(nickname);
        if (nicknameRows.length > 0){
            return errResponse(baseResponse.REGISTER_NICKNAME_REDUNDANT);
        }
        else{
            return errResponse(baseResponse.SUCCESS_DUPLICATE_NICKNAME);
        }
    } catch (err) {
        logger.error(`App - dupliNickname Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


//회원정보 수정(닉네임) API

exports.editNickname = async function (userIdx, nickname) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, userIdx, nickname)
        connection.release();

        return response(baseResponse.SUCCESS_USERS_MODI,{'nickname':editUserResult[0].nickname});

    } catch (err) {
        logger.error(`App - editNickname Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}





// // TODO: After 로그인 인증 방법 (JWT)
// exports.postSignIn = async function (email, password) {
//     try {
//         // 이메일 여부 확인
//         const emailRows = await userProvider.emailCheck(email);
//         if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

//         const selectEmail = emailRows[0].email

//         // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");

//         const selectUserPasswordParams = [selectEmail, hashedPassword];
//         const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

//         if (passwordRows[0].password !== hashedPassword) {
//             return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
//         }

//         // 계정 상태 확인
//         const userInfoRows = await userProvider.accountCheck(email);

//         if (userInfoRows[0].status === "INACTIVE") {
//             return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
//         } else if (userInfoRows[0].status === "DELETED") {
//             return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
//         }

//         console.log(userInfoRows[0].id) // DB의 userId

//         //토큰 생성 Service
//         let token = await jwt.sign(
//             {
//                 userId: userInfoRows[0].id,
//             }, // 토큰의 내용(payload)
//             secret_config.jwtsecret, // 비밀키
//             {
//                 expiresIn: "365d",
//                 subject: "userInfo",
//             } // 유효 기간 365일
//         );

//         return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

//     } catch (err) {
//         logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };






//예시내용들


// exports.createUser = async function (name,nickname,ID,password,phoneNumber) {
//     try {
//         // 이메일 중복 확인
//         // UserProvider에서 해당 이메일과 같은 User 목록을 받아서 emailRows에 저장한 후, 배열의 길이를 검사한다.
//         // -> 길이가 0 이상이면 이미 해당 이메일을 갖고 있는 User가 조회된다는 의미
//         const emailRows = await userProvider.emailCheck(email);
//         if (emailRows.length > 0)
//             return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

//         // 비밀번호 암호화
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");

//         // 쿼리문에 사용할 변수 값을 배열 형태로 전달
//         const insertUserInfoParams = [email, hashedPassword, nickname];

//         const connection = await pool.getConnection(async (conn) => conn);

//         const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
//         console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
//         connection.release();
//         return response(baseResponse.SUCCESS);

//     } catch (err) {
//         logger.error(`App - createUser Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };