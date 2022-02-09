const jwtMiddleware = require("../../../config/jwtMiddleware");
const ootdProvider = require("./ootdProvider");
const ootdService = require("./ootdService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const { TAG_NEVER_EXISTED } = require("../../../config/baseResponseStatus");

var datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/; 
var blankPattern = /^\s+|\s+$/g;
var lookpointPattern = /^[1-5]$/;

/**
 * API No. 8
 * API Name : OOTD 최종 등록하기
 * [POST] /app/ootd/last-register/:userIdx
 * path variable : userIdx
 * Body : date, lookname, photoIs, image[{imageUrl, thumbnail}],
 * fClothes[{index, color}], aClothes[{bigClass, smallClass, color}], 
 * fPlace[placeIdx], aPlace[place], fWeather[weatherIdx], aWeather[weather],
 * fWho[whoIdx], aWho[who], lookpoint, comment
 * (FixedPlace.index 값은 받을 수 있지만 AddedPlace.index 는 받을 수 없어서 Place.addedPlace -1 여부 체크하고 AddedPlace.place 값과 비교) 
 */

exports.registerOotd = async function (req, res) {

    // jwt - userId, path variable :userId
    console.log('[ootdController] registerOotd function');
    const userIdFromJWT = req.verifiedToken.userIdx;

    const userIdx = req.params.userIdx;

    let {date, lookname, photoIs, image, fClothes, aClothes,
    fPlace, aPlace, fWeather, aWeather, fWho, aWho, lookpoint, comment} = req.body;
    console.log('[ootdController] req body : ', req.body);

    // request body 풀어내기
    const n_date = new Date(date);

    const colorArr = [ "#d60f0f", "#f59a9a", "#ffb203", "#fde6b1", "#71a238", "#b7de89",
    "#ea7831", "#273e88", "#4168e8", "#a5b9fa", "#894ac7", "#dcacff",
    "#ffffff", "#888888", "#191919", "#e8dcd5", "#c3b5ac", "#74461f"]

    const bigArr = ["Top", "Bottom", "Shoes", "Etc"];

    /*********************************************** */
    /*****************request error***************** */
    /*********************************************** */

    // userIdx가 입력되지 않음, 추후 진행
    if (!userIdx) { 
        return res.send(errResponse(baseResponse.USERID_EMPTY));
    }

    // 유효하지 않는 userIdx 입력
    if (userIdFromJWT != userIdx) {
        return res.send(errResponse(baseResponse.USERID_NOT_MATCH));
    }

    // date 빈 값 체크
    if(!date) {
        return res.send(errResponse(baseResponse.DATE_EMPTY));
    }

    // date 형식 체크 
    if(!datePattern.test(date)){
        return res.send(errResponse(baseResponse.DATE_ERROR_TYPE));
    }

    // 2010년 1월 1일 ~ 2099년 12월 31 일 이내의 date(유효 date)인지 체크
    var date_start = new Date('2010-01-01');
    var date_end = new Date('2100-01-01');

    if(n_date < date_start || n_date > date_end) {
        return res.send(errResponse(baseResponse.DATE_INVALID_VALUE));
    }

    // lookname 빈 값 체크, key에 looknam이 없을 때
    if(!lookname){
        return res.send(errResponse(baseResponse.LOOKNAME_EMPTY));
    }

    // lookname에 공백만 입력된 경우
    lookname = lookname.toString();
    if(lookname.replace(blankPattern, '') == ""){
        return res.send(errResponse(baseResponse.REGISTER_BLANK_ALL));
    }

    // lookname 길이가 27자리를 초과할 때
    if(lookname.length > 27){
        return res.send(errResponse(baseResponse.LOOKNAME_LENGTH));
    }

    // photoIs 빈 값 체크
    if(photoIs === '' || photoIs === null || photoIs === undefined || photoIs === NaN){
        return res.send(errResponse(baseResponse.PHOTOIS_EMPTY));
    }

    // photoIs 형식 체크 (정수가 아닐 경우 error)
    if(!Number.isInteger(photoIs)){
        return res.send(errResponse(baseResponse.PHOTOIS_ERROR_TYPE));
    }

    // photoIs 값 -1 또는 0인지 체크
    //console.log(typeof photoIs);
    if(photoIs != -1 && photoIs != 0){
        return res.send(errResponse(baseResponse.PHOTOIS_INVALID_VALUE));
    }

    // image 키가 없을 경우 & 값이 비어있을 경우
    if(!image){
        return res.send(errResponse(baseResponse.REGISTER_IMAGE_EMPTY));
    }
    
    // image 변수 형식 체크 (배열이 아닐 경우 error)
    if(!Array.isArray(image)){
        return res.send(errResponse(baseResponse.IMAGE_ERROR_TYPE));
    }

    for(item of image){ // 배열의 원소가 하나라도 있어야 들어오는 반복문
        console.log('image item : ', item);
        // imgUrl 키가 없을 경우
        if(!item["imageUrl"]) {
            return res.send(errResponse(baseResponse.REGISTER_IMGURL_EMPTY));
        }

        // thumbnail 키가 없을 경우 (0이 가능하기에 이렇게)
        if(item["thumbnail"] === '' || item["thumbnail"] === null || item["thumbnail"] === undefined || item["thumbnail"] === NaN){
            return res.send(errResponse(baseResponse.REGISTER_THUMBNAIL_EMPTY));
        }
        
        // 입력된 이미지 URL이 S3에 존재하지 않는 경우
        // 추후 체크 + toString은 자동으로 해주기
        //item["imageUrl"] = item["imageUrl"].toString();

        // thumbnail 형식 체크 (정수가 아닐 경우 error)
        if(!Number.isInteger(item["thumbnail"])){
            return res.send(errResponse(baseResponse.THUMBNAIL_ERROR_TYPE));
        }
        // thumbnail 값 -1 또는 0인지 체크
        if(item["thumbnail"] != -1 && item["thumbnail" != 0]){
            return res.send(errResponse(baseResponse.THUMBNAIL_INVALID_VALUE));
        }
    }

    // fClothes 키가 없을 경우, 빈 값인 경우
    if(!fClothes) {
        return res.send(errResponse(baseResponse.REGISTER_FCLOTHES_EMPTY));
    }
    // fClothes 변수 형식 체크 (배열이 아닐 경우 error)
    if(!Array.isArray(fClothes)){
        return res.send(errResponse(baseResponse.REGISTER_FCLOTHES_ERROR_TYPE));
    }

    // aClothes 키가 없을 경우, 빈 값인 경우
    if(!aClothes){
        return res.send(errResponse(baseResponse.REGISTER_ACLOTHES_EMPTY));
    }
    // aClothes 변수 형식 체크 (배열이 아닐 경우 error)
    if(!Array.isArray(aClothes)){
        return res.send(errResponse(baseResponse.REGISTER_ACLOTHES_ERROR_TYPE));
    }
    
    // 선택된 Clothes가 없을 경우
    if(!fClothes[0] && !aClothes[0]){
        return res.send(errResponse(baseResponse.REGISTER_CLOTHES_EMPTY));
    }else {
        // fClothes 내 객체 조건 
        for(item of fClothes){
            // index 키가 없을 경우 및 빈 값인 경우
            if(!item["index"]){
                return res.send(errResponse(baseResponse.FCLOTHES_INDEX_EMPTY));
            }

            // color 키가 없을 경우 및 빈 값인 경우
            if(!item["color"]){
                return res.send(errResponse(baseResponse.FCLOTHES_COLOR_EMPTY));
            }

            // 올바르지 않은 fixedClothes index 형식 (정수가 아닌 경우)
            if(!Number.isInteger(item["index"])){
                return res.send(errResponse(baseResponse.FCLOTHES_ERROR_TYPE));
            }

            item["color"] = item["color"].toString();
            if(colorArr.indexOf(item["color"]) == -1){
                return res.send(errResponse(baseResponse.COLOR_INVALID_VALUE));
            }

        }

        // aClothes 내 객체 조건 
        for(item of aClothes){
            // bigClass 키가 없을 경우 및 빈 값인 경우
            if(!item["bigClass"]){
                return res.send(errResponse(baseResponse.ACLOTHES_BIG_EMPTY));
            }

            // smallClass 키가 없을 경우 및 빈 값인 경우
            if(!item["smallClass"]){
                return res.send(errResponse(baseResponse.ACLOTHES_SMALL_EMPTY));
            }

            // color 키가 없을 경우 및 빈 값인 경우
            if(!item["color"]){
                return res.send(errResponse(baseResponse.ACLOTHES_COLOR_EMPTY));
            }
            /*
            // 올바르지 않은 addedClothes smallClass 형식 (문자열이 아닌 경우)
            if(typeof item["smallClass"] !== 'string' && !(item["smallClass"] instanceof String)){
                return res.send(errResponse(baseResponse.ACLOTHES_ERROR_TYPE));
            }
            */

            // 존재하지 않는 옷 카테고리
            item["bigClass"] = item["bigClass"].toString();
            if(bigArr.indexOf(item["bigClass"]) == -1){
                return res.send(errResponse(baseResponse.BIG_CLASS_NOT_MATCH));
            }

            // 유효하지 않은 COLOR 값
            item["color"] = item["color"].toString();
            if(colorArr.indexOf(item["color"]) == -1){
                return res.send(errResponse(baseResponse.COLOR_INVALID_VALUE));
            }
        }

    }


    // Place (fPlace & aPlace) key가 없는 경우 및 빈 값 체크
    if(!fPlace && !aPlace){
        return res.send(errResponse(baseResponse.REGISTER_PLACE_EMPTY));
    }
    else {
        // 올바르지 않은 fPlace index 형식
        for(item of fPlace){
            if(!Number.isInteger(item["index"])){
                return res.send(errResponse(baseResponse.FPLACE_ERROR_TYPE));
            }
        }

        //aPlace 자체 String 변경
        for(item of aPlace){
            item["place"] = item["place"].toString();
        }
    }

    // Weather (fWeather & aWeather) key가 없는 경우 및 빈 값 체크
    if(!fWeather && !aWeather){
        return res.send(errResponse(baseResponse.REGISTER_WEATHER_EMPTY));
    }
    else{
        // 올바르지 않은 fWeather index 형식
        for(item of fWeather){
            if(!Number.isInteger(item["index"])){
                return res.send(errResponse(baseResponse.FWEATHER_ERROR_TYPE));
            }
        }
        // aWeather 자체 String 변경
        for(item of aWeather){
            item["weather"] = item["weather"].toString();
        }
    }

    // Who (fWho & aWho) key가 없는 경우 및 빈 값 체크
    if(!fWho && !aWho){
        return res.send(errResponse(baseResponse.REGISTER_WHO_EMPTY));
    }    
    else {
        // 올바르지 않은 fWho index 형식
        for(item of fWho){
            if(!Number.isInteger(item["index"])){
                return res.send(errResponse(baseResponse.FWHO_ERROR_TYPE));
            }
        }
        // aWho 자체 String 변경
        for(item of aWho){
            item["who"] = item["who"].toString();
        }
    }

    // LOOKPOINT key가 없는 경우 및 빈 값 체크
    if(!lookpoint){
        return res.send(errResponse(baseResponse.LOOKPOTNT_EMPTY));
    }

    // LOOKPOINT 범위 체크
    if(!lookpointPattern.test(lookpoint)){
        return res.send(errResponse(baseResponse.LOOKPOINT_INVALID_VALUE));
    }

    comment = comment.toString();
    // COMMENT 길이 체크
    if(comment.length > 65535){
        return res.send(errResponse(baseResponse.COMMENT_LENGTH));
    }

    
    /********************************************** */
    /****************response error**************** */
    /********************************************** */

    // 입력된 date에 이미 OOTD 존재
    const ootdRow = await ootdProvider.ootdDateCheck(userIdx, date);
    if(ootdRow.length > 0){
        return res.send(errResponse(baseResponse.OOTD_ALREADY_EXIST));
    }

    // 등록할 수 없는 옷(fClothes->index, aClothes->smallClass)
    for (item of fClothes){
        const fclothesRow = await ootdProvider.clothesCheck(userIdx, item["index"]);
        if(fclothesRow.length == 0){
            return res.send(errResponse(baseResponse.CLOTHES_NOT_MATCH));
        }
    }
    for (item of aClothes){
        const aClothesParams = [item["bigClass"], item["smallClass"]];
        const aclothesRow = await ootdProvider.clothesCheck(userIdx, aClothesParams);
        if(aclothesRow.length == 0){
            return res.send(errResponse(baseResponse.CLOTHES_NOT_MATCH));
        }
    
    }

    // 등록할 수 없는 Place (fPlace->index, aPlace->place)
    for (item of fPlace){
        const fplaceRow = await ootdProvider.placeCheck(userIdx, item["index"]);
        if(fplaceRow.length == 0){
            return res.send(errResponse(baseResponse.PLACE_NOT_MATCH));
        }
    }
    for (item of aPlace){
        const aplaceRow = await ootdProvider.placeCheck(userIdx, item["place"]);
        if(aplaceRow.length == 0){
            return res.send(errResponse(baseResponse.PLACE_NOT_MATCH));
        }
    }

    // 등록할 수 없는 Weather (fWeather->index, aWeather->weather)
    for (item of fWeather){
        const fweatherRow = await ootdProvider.weatherCheck(userIdx, item["index"]);
        if(fweatherRow.length == 0){
            return res.send(errResponse(baseResponse.WEATHER_NOT_MATCH));
        }
    }
    for (item of aWeather){
        const aweatherRow = await ootdProvider.weatherCheck(userIdx, item["weather"]);
        if(aweatherRow.length == 0){
            return res.send(errResponse(baseResponse.WEATHER_NOT_MATCH));
        }
    }

    // 등록할 수 없는 Who (fWho->index, aWho->who)
    for (item of fWho){
        const fwhoRow = await ootdProvider.whoCheck(userIdx, item["index"]);
        if(fwhoRow.length == 0){
            return res.send(errResponse(baseResponse.WHO_NOT_MATCH));
        }
    }
    for (item of aWho){
        const awhoRow = await ootdProvider.whoCheck(userIdx, item["who"]);
        if(awhoRow.length == 0){
            return res.send(errResponse(baseResponse.WHO_NOT_MATCH));
        }
    }

    const registerUserOotd = await ootdService.lastRegisterOotd(userIdx, n_date, lookname, photoIs, image, fClothes, aClothes,
        fPlace, aPlace, fWeather, aWeather, fWho, aWho, lookpoint, comment);
    return res.send(response(baseResponse.SUCCESS_LAST_REGISTER, registerUserOotd));

};


/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 * Body: email, password, nickname
 */
/*
exports.postUsers = async function (req, res) {

    const {email, password, nickname} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // createUser 함수 실행을 통한 결과 값을 signUpResponse에 저장
    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname
    );

    // signUpResponse 값을 json으로 전달
    return res.send(signUpResponse);
};
*/

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 * Query String: email
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
 * Path Variable: userId
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