const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const ootdProvider = require("./ootdProvider");
const ootdDao = require("./ootdDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.lastRegisterOotd = async function (userIdx, date, lookname, photoIs, image,
    fClothes, aClothes, fPlace, aPlace, fWeather, aWeather,
    fWho, aWho, lookpoint, comment) {
    try {
        // 이메일 중복 확인
        // UserProvider에서 해당 이메일과 같은 User 목록을 받아서 emailRows에 저장한 후, 배열의 길이를 검사한다.
        // -> 길이가 0 이상이면 이미 해당 이메일을 갖고 있는 User가 조회된다는 의미
        //const emailRows = await userProvider.emailCheck(email);
        //if (emailRows.length > 0)
        //    return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);
        //let 

        const connection = await pool.getConnection(async (conn) => conn);

            
        /*********************************************** */
        /****************OOTD 테이블 등록**************** */
        /*********************************************** */

        // OOTD 테이블 등록을 위한 params
        const lastRegisterOotdParams = [userIdx, date, lookname, photoIs, lookpoint, comment];
        
        // OOTD 테이블 등록
        const lastRegisterResult = await ootdDao.registerNewOotd(connection, lastRegisterOotdParams);
        //console.log(`추가된 OOTD : ${lastRegisterResult[0].userIdx}`);
        console.log('lastRegisterResult : ', lastRegisterResult);
        //로그 변경할 것 ${userIdResult[0].insertId}
        
        // OOTD 테이블 등록 후 생성된 ootdIdx 가져오기
        // 위에서 insertId를 가지고 온다면 굳이 필요하진 않다는 것
        const lastRegisterOotdIdx = await ootdProvider.newOotdIdx(connection, userIdx, date);
        console.log('새로 추가된 ootdIdx : ', lastRegisterOotdIdx["ootdIdx"]);
        const ootdIdxParam = lastRegisterOotdIdx["ootdIdx"];

        /*********************************************** */
        /****************Photo 테이블 등록*************** */
        /*********************************************** */

        // Photo 테이블 등록
        if(photoIs == 0){
            const ootdPhotoResult = await ootdDao.registerOotdPhoto(connection, ootdIdxParam, image);
            // 수정 가능성 O
            console.log('ootdPhotoResult : ', ootdPhotoResult);
            //로그 변경할 것 ${userIdResult[0].insertId}

        }

        /*********************************************** */
        /***************Clothes 테이블 등록************** */
        /*********************************************** */

        // Clothes 테이블 등록을 위한 params
        //let ootdFixedClothes = [];
        let ootdAddedClothes = [];
        /*
        for (item of fClothes){
            let tmpfClothes = {};
            tmpfClothes["index"] = item["index"];
            tmpfClothes["color"] = item["color"];
            ootdFixedClothes.push(tmpfClothes);
        }*/

        const AClothesIdxList = await ootdProvider.addedClothesIdx(connection, userIdx, aClothes);
        console.log('AClothesIdxList.length : ', AClothesIdxList.length);
        console.log('aClothes.length : ', aClothes.length);
        for (i in aClothes){
            let tmpAClothes = {};
            tmpAClothes["index"] = AClothesIdxList[i];
            tmpAClothes["color"] = aClothes[i].color;
            ootdAddedClothes.push(tmpAClothes);
        }

        console.log('fClothes : ', fClothes);
        console.log('ootdAddedClothesIdx : ', ootdAddedClothes);

        // Clothes 테이블 - fixedType 등록
        const ootdFClothesResult = await ootdDao.registerOotdFClothes(connection, ootdIdxParam, fClothes);
        // 수정 가능성 O
        //로그 변경할 것 ${userIdResult[0].insertId}
        console.log('ootdFClothesResult : ', ootdFClothesResult); 

        // Clothes 테이블 - addedType 등록
        const ootdAClothesResult = await ootdDao.registerOotdAClothes(connection, ootdIdxParam, ootdAddedClothes);
        // 수정 가능성 O
        //로그 변경할 것 ${userIdResult[0].insertId}
        console.log('ootdAClothesResult : ', ootdAClothesResult); 

        /*********************************************** */
        /****************Place 테이블 등록*************** */
        /*********************************************** */

        // Place 테이블 등록을 위한 params
        const APlaceIdxList = await ootdProvider.addedPlaceIdx(connection, userIdx, aPlace);
        console.log('APlaceIdxList.length : ', APlaceIdxList.length);
        console.log('aPlace.length : ', aPlace.length);
        console.log('APlaceIdxList : ', APlaceIdxList);
        // 두 Place 배열이 모두 비어있을 때
        if(!fPlace[0] && !aPlace[0]){
            const ootdPlaceResult = await ootdDao.registerOotdPlace(connection, ootdIdxParam);
            console.log('ootdPlaceResult : ', ootdPlaceResult);
        }else {
            // Place 테이블 등록 - fixedPlace 등록
            const ootdFPlaceResult = await ootdDao.registerOotdFPlace(connection, ootdIdxParam, fPlace);
            // 수정 가능성 O        
            console.log('ootdFPlaceResult : ', ootdFPlaceResult);

            // Place 테이블 등록 - addedPlace 등록
            const ootdAPlaceResult = await ootdDao.registerOotdAPlace(connection, ootdIdxParam, APlaceIdxList);
            // 수정 가능성 O
            console.log('ootdAPlaceResult : ', ootdAPlaceResult);
        }
        /*********************************************** */
        /***************Weather 테이블 등록************** */
        /*********************************************** */

        const AWeatherIdxList = await ootdProvider.addedWeatherIdx(connection, userIdx, aWeather);
        console.log('AWeatherIdxList.length : ', AWeatherIdxList.length);
        console.log('aWeather.length : ', aWeather.length);

        // 두 Weather 배열이 모두 비어있을 때
        if(!fWeather[0] && !aWeather[0]){
            const ootdWeatherResult = await ootdDao.registerOotdWeather(connection, ootdIdxParam);
            console.log('ootdWeatherResult : ', ootdWeatherResult);
        }else {
            // Weather 테이블 등록 - fixedWeather 등록
            const ootdFWeatherResult = await ootdDao.registerOotdFWeather(connection, ootdIdxParam, fWeather);
            // 수정 가능성 O        
            console.log('ootdFWeatherResult : ', ootdFWeatherResult);

            // Weather 테이블 등록 - addedWeather 등록
            const ootdAWeatherResult = await ootdDao.registerOotdAWeather(connection, ootdIdxParam, AWeatherIdxList);
            // 수정 가능성 O
            console.log('ootdAWeatherResult : ', ootdAWeatherResult);
        }
        /*********************************************** */
        /*****************Who 테이블 등록**************** */
        /*********************************************** */


        const AWhoIdxList = await ootdProvider.addedWhoIdx(connection, userIdx, aWho);
        console.log('AWhoIdxList.length : ', AWhoIdxList.length);
        console.log('aWho.length : ', aWho.length);

        // 두 Who 배열이 모두 비어있을 때
        if(!fWho[0] && !aWho[0]){
            const ootdWhoResult = await ootdDao.registerOotdWho(connection, ootdIdxParam);
            console.log('ootdWhoResult : ', ootdWhoResult);
        }else {
            // Who 테이블 등록 - fixedWho 등록
            const ootdFWhoResult = await ootdDao.registerOotdFWho(connection, ootdIdxParam, fWho);
            // 수정 가능성 O        
            console.log('ootdFWhoResult : ', ootdFWhoResult);

            // Who 테이블 등록 - addedWho 등록
            const ootdAWhoResult = await ootdDao.registerOotdAWho(connection, ootdIdxParam, AWhoIdxList);
            // 수정 가능성 O
            console.log('ootdAWhoResult : ', ootdAWhoResult);
        }

        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - lastRegisterOotd Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

/*
// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].id) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
*/

/*
exports.editUser = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
*/