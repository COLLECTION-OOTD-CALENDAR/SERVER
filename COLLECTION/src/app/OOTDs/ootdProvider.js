const e = require("express");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const ootdDao = require("./ootdDao");

// Provider: Read 비즈니스 로직 처리

/*
exports.retrieveUserList = async function (email) {

  //email을 인자로 받는 경우와 받지 않는 경우를 구분하여 하나의 함수에서 두 가지 기능을 처리함

  if (!email) {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    // Dao 쿼리문의 결과를 호출
    const userListResult = await userDao.selectUser(connection);
    // connection 해제
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};
*/
// 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴

// 입력된 date에 해당하는 ootd 존재 여부 체크
exports.ootdDateCheck = async function (userIdx, date) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const ootdDateCheckResult = await ootdDao.checkDateOotd(connection, userIdx, date);
    connection.release();
    
    return ootdDateCheckResult; //ootdDateCheckResult[0] 할 수도

  } catch (err) {
    logger.error(`App - ootdDateCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

// 등록할 수 없는 옷 (fClothes->index, aClothes->smallClass)
exports.clothesCheck = async function (userIdx, data) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    if(Number.isInteger(data)){ // data가 정수일 경우 (fClothes->index)
      const clothesCheckResult = await ootdDao.checkClothesIdxIs(connection, data);
      connection.release();
      return clothesCheckResult;  //clothesCheckResult[0] 할 수도
    }
    else {
      const clothesCheckResult = await ootdDao.checkClothesIs(connection, userIdx, data);
      connection.release();
      return clothesCheckResult;  //clothesCheckResult[0] 할 수도
    
    }
  } catch (err) {
    logger.error(`App - clothesCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 등록할 수 없는 Place (fPlace->index, aPlace->place)
exports.placeCheck = async function (userIdx, data) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    if(Number.isInteger(data)){ // data가 정수일 경우 (fPlace->index)
      const placeCheckResult = await ootdDao.checkPlaceIdxIs(connection, data);
      connection.release();
      return placeCheckResult; //placeCheckResult[0] 할 수도
    }
    else {
      const placeCheckResult = await ootdDao.checkPlaceIs(connection, userIdx, data);
      connection.release();
      return placeCheckResult; //placeCheckResult[0] 할 수도
    
    }
  } catch (err) {
    logger.error(`App - placeCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 등록할 수 없는 Weather (fWeather->index, aWeather->weather)
exports.weatherCheck = async function (userIdx, data) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    if(Number.isInteger(data)){ // data가 정수일 경우 (fWeather->index)
      const weatherCheckResult = await ootdDao.checkWeatherIdxIs(connection, data);
      connection.release();
      return weatherCheckResult; //weatherCheckResult[0] 할 수도
    }
    else {
      const weatherCheckResult = await ootdDao.checkWeatherIs(connection, userIdx, data);
      connection.release();
      return weatherCheckResult; //weatherCheckResult[0] 할 수도
    
    }
  } catch (err) {
    logger.error(`App - weatherCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 등록할 수 없는 Who (fWho->index, aWho->who)
exports.whoCheck = async function (userIdx, data) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    if(Number.isInteger(data)){ // data가 정수일 경우 (fWeather->index)
      const whoCheckResult = await ootdDao.checkWhoIdxIs(connection, data);
      connection.release();
      return whoCheckResult; //whoCheckResult[0] 할 수도
    }
    else {
      const whoCheckResult = await ootdDao.checkWhoIs(connection, userIdx, data);
      connection.release();
      return whoCheckResult; //whoCheckResult[0] 할 수도
    
    }
  } catch (err) {
    logger.error(`App - whoCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// userIdx와 date를 이용하여 ootdIdx 추출하기
exports.newOotdIdx = async function (connection, userIdx, date) {

  const newOotdIdxResult = await ootdDao.checkNewOotd(connection, userIdx, date);
  return newOotdIdxResult[0];
  
};

// userIdx와 aClothes의 bigClass, smallClass를 이용한 index 추출하기
exports.addedClothesIdx = async function (connection, userIdx, aClothes){

  const addedClothesIdxResult = await ootdDao.getAddedClothesIdx(connection, userIdx, aClothes);
  return addedClothesIdxResult;
};

// userIdx와 aPlace의 place를 이용한 index 추출하기
exports.addedPlaceIdx = async function (connection, userIdx, aPlace){
  
  const addedPlaceIdxResult = await ootdDao.getAddedPlaceIdx(connection, userIdx, aPlace);
  return addedPlaceIdxResult;
};

// userIdx와 aWeather의 weather를 이용한 index 추출하기
exports.addedWeatherIdx = async function (connection, userIdx, aWeather){

  const addedWeatherIdxResult = await ootdDao.getAddedWeatherIdx(connection, userIdx, aWeather);
  return addedWeatherIdxResult;
};

// userIdx와 aWho의 who를 이용한 index 추출하기
exports.addedWhoIdx = async function (connection, userIdx, aWho){

  const addedWhoIdxResult = await ootdDao.getAddedWhoIdx(connection, userIdx, aWho);
  return addedWhoIdxResult;
};
/*
exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  // 쿼리문에 여러개의 인자를 전달할 때 selectUserPasswordParams와 같이 사용합니다.
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};
*/

/*
exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};
*/