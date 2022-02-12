const e = require("express");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

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

// errResponse 뺄 것 있음
// 입력된 date에 해당하는 ootd 존재 여부 체크
exports.ootdDateCheck = async function (userIdx, date) {

  console.log('[ootdProvider] userIdx :', userIdx);
  console.log('[ootdProvider] date : ', date);
  console.log('[ootdProvider] typeof date : ', typeof date);
  const connection = await pool.getConnection(async (conn) => conn);

  try {
    console.log('[ootdProvider] ootdDao checkDateOotd 넘어가기 전');
    const ootdDateCheckResult = await ootdDao.checkDateOotd(connection, userIdx, date);
    connection.release();
    console.log('[ootdProvider] ootdDao checkDateOotd 결과 : ', ootdDateCheckResult);

    return ootdDateCheckResult; //ootdDateCheckResult[0] 할 수도

  }catch(err) {
    logger.error(`App - ootdDateCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

// 등록할 수 없는 옷 (fClothes->index, aClothes->smallClass)
exports.clothesCheck = async function (userIdx, data) {

  console.log('[ootdProvider] userIdx :', userIdx);
  console.log('[ootdProvider] data : ', data);
  console.log('[ootdProvider] typeof data : ', typeof data);
  const connection = await pool.getConnection(async (conn) => conn);

  try {
    
    if(Number.isInteger(data) && typeof data == 'number'){ // data가 정수일 경우 (fClothes->index)
      const clothesCheckResult = await ootdDao.checkClothesIdxIs(connection, data);
      connection.release();
      return clothesCheckResult;  //clothesCheckResult[0] 할 수도
    }
    else {
      const clothesCheckResult = await ootdDao.checkClothesIs(connection, userIdx, data);
      connection.release();
      return clothesCheckResult;  //clothesCheckResult[0] 할 수도
    
    }
  }catch(err) {
    logger.error(`App - clothesCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 등록할 수 없는 Place (fPlace->index, aPlace->place)
exports.placeCheck = async function (userIdx, data) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    if(Number.isInteger(data) && typeof data == 'number'){ // data가 정수일 경우 (fPlace->index)
      const placeCheckResult = await ootdDao.checkPlaceIdxIs(connection, data);
      connection.release();
      return placeCheckResult; //placeCheckResult[0] 할 수도
    }
    else {
      const placeCheckResult = await ootdDao.checkPlaceIs(connection, userIdx, data);
      connection.release();
      return placeCheckResult; //placeCheckResult[0] 할 수도
    
    }
  }catch(err) {
    logger.error(`App - placeCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 등록할 수 없는 Weather (fWeather->index, aWeather->weather)
exports.weatherCheck = async function (userIdx, data) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    if(Number.isInteger(data) && typeof data == 'number'){ // data가 정수일 경우 (fWeather->index)
      const weatherCheckResult = await ootdDao.checkWeatherIdxIs(connection, data);
      connection.release();
      return weatherCheckResult; //weatherCheckResult[0] 할 수도
    }
    else {
      const weatherCheckResult = await ootdDao.checkWeatherIs(connection, userIdx, data);
      connection.release();
      return weatherCheckResult; //weatherCheckResult[0] 할 수도
    
    }
  }catch(err) {
    logger.error(`App - weatherCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 등록할 수 없는 Who (fWho->index, aWho->who)
exports.whoCheck = async function (userIdx, data) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    if(Number.isInteger(data) && typeof data == 'number'){ // data가 정수일 경우 (fWeather->index)
      const whoCheckResult = await ootdDao.checkWhoIdxIs(connection, data);
      connection.release();
      return whoCheckResult; //whoCheckResult[0] 할 수도
    }
    else {
      const whoCheckResult = await ootdDao.checkWhoIs(connection, userIdx, data);
      connection.release();
      return whoCheckResult; //whoCheckResult[0] 할 수도
    
    }
  }catch(err) {
    logger.error(`App - whoCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// userIdx와 date를 이용하여 ootdIdx 추출하기
/*
exports.newOotdIdx = async function (connection, userIdx, date) {

  const newOotdIdxResult = await ootdDao.checkNewOotd(connection, userIdx, date);
  return newOotdIdxResult[0];
  
};
*/

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



// OOTD 수정하기 - 지난 작성 화면 보여주기
exports.retrieveModiOotd = async function (userIdx){

  try {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);

    // Dao 쿼리문의 결과를 호출
    const modiOotdListResult = await ootdDao.selectModiDateOotd(connection, userIdx);
    console.log('[ootdProvider] modiOotdListResult : ', modiOotdListResult);
    // connection 해제
    connection.release();

    // 추가한 항목들이 없을 경우
    if(!modiOotdListResult[0]){
      return modiOotdListResult[0];
    }

    let added = {};
    for (let row of modiOotdListResult){

      added["aPlace"] = getPlaceList(row, ootd["aPlace"]);
      added["aWeather"] = getWeatherList(row, ootd["aWeather"]);
      added["aWho"] = getWhoList(row, ootd["aWho"]);

      // bigClass Key 생성
      added = getAddedBigClass(added);
      
      let bigKey = 'a'+row.bigClass;
      if(!hasAdded(added[bigKey], row.smallClass)){
        added[bigKey].push(row.smallClass);
        //console.log('ootd(+ clothes) : ', ootd);
      }

    }

    console.log('[ootdProvider] 최종 added : ', added);

    return added;

  } catch(err) {
    logger.error(`App - modiOotd Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


function getPlaceList(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.place != null && tags.indexOf(row.place) < 0){
    tags.push(row.place);
  }

  return tags;
};

function getWeatherList(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.weather != null && tags.indexOf(row.weather) < 0){
    tags.push(row.weather);
  }

  return tags;
};

function getWhoList(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.who != null && tags.indexOf(row.who) < 0){
    tags.push(row.who);
  }

  return tags;
};

function getAddedBigClass(added){
  if(!added["aTop"] && !added["aBottom"] && !added["aShoes"] && !added["aEtc"]){
    added["aTop"] = [];
    added["aBottom"] = [];
    added["aShoes"] = [];
    added["aEtc"] = [];
  }
};

function hasAdded(list, data){
  for(let each of list){
    if(each == data) return true;
  }

  return false;
};

// OOTD 완료 페이지 불러오기
exports.retrieveCompleteOotd = async function (userIdx, date){

  try {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);

    // Dao 쿼리문의 결과를 호출
    const completeOotdListResult = await ootdDao.selectDateOotd(connection, userIdx, date);
    console.log('[ootdProvider] completeOotdListResult : ', completeOotdListResult);
    // connection 해제
    connection.release();

    // 입력된 날짜의 ootd가 존재하는지
    //if (!completeOotdListResult[0]) 추가할 지 고민해보기
    if(!completeOotdListResult[0]){
      return completeOotdListResult[0];
    }

    let ootd = {};
    var moment = require('moment');
    for (let row of completeOotdListResult){
      console.log('row : ', row);
      if(row === completeOotdListResult[0]){
        ootd["ootdIdx"] = row.ootdIdx;
        ootd["date"] = moment(row.date).format('YYYY-MM-DD');
        ootd["lookname"] = row.lookname;
        ootd["lookpoint"] = row.lookpoint;
        ootd["comment"] = row.comment;
      }

      ootd["image"] = getImages(row, ootd["image"]);
      ootd["place"] = getPlaces(row, ootd["place"]);
      ootd["weather"] = getWeathers(row, ootd["weather"]);
      ootd["who"] = getWhos(row, ootd["who"]);

      // bigClass Key 생성
      ootd = getBigClass(ootd);
      
      // smallClass 넣기
      if(row.fixedBig != null){
        let data = {smallClass : row.fixedSmall, color : row.color};

        if(!hasClothes(ootd[row.fixedBig], data)){
          ootd[row.fixedBig].push(data);
          //console.log('ootd(+ clothes) : ', ootd);
        }
      }
      else {
        let data = {smallClass : row.addedSmall, color : row.color};

        if(!hasClothes(ootd[row.addedBig], data)){
          ootd[row.addedBig].push(data);
          //console.log('ootd(+ clothes) : ', ootd);
        }
      }
      
    }
    console.log('[ootdProvider] 최종 ootd : ', ootd);

    return ootd;

  } catch(err) {
    logger.error(`App - retrieveOotd Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};



// Image value를 채우는 함수
function getImages(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  }else {
    tags = tmp;
  }

  for (let each of tags){
    if(each.imageUrl == row.imageUrl && each.thumbnail == row.thumbnail) return tags;
  }

  if(row.imageUrl != null && tags.indexOf(row.imageUrl) < 0){
    console.log('row.imageUrl : ', row.imageUrl);
    let data = { imageUrl : row.imageUrl, thumbnail : row.thumbnail};
    tags.push(data);
  }

  return tags;
};

// Place value를 채우는 함수
function getPlaces(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.fpName != null && tags.indexOf(row.fpName) < 0){
    tags.push(row.fpName);
  }

  if(row.apName != null && tags.indexOf(row.apName) < 0){
    tags.push(row.apName);
  }
  return tags;
};

// Weather value를 채우는 함수
function getWeathers(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.fwName != null && tags.indexOf(row.fwName) < 0){
    tags.push(row.fwName);
  }

  if(row.awName != null && tags.indexOf(row.awName) < 0){
    tags.push(row.awName);
  }
  return tags;
};

// Who value를 채우는 함수
function getWhos(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.fwhName != null && tags.indexOf(row.fwhName) < 0){
    tags.push(row.fwhName);
  }

  if(row.awhName != null && tags.indexOf(row.awhName) < 0){
    tags.push(row.awhName);
  }
  return tags;
};

// BigClass에 해당하는 key를 모두 만드는 함수
function getBigClass(ootd){
  if(!ootd["Top"] && !ootd["Bottom"] && !ootd["Shoes"] && !ootd["Etc"]){
    ootd["Top"] = [];
    ootd["Bottom"] = [];
    ootd["Shoes"] = [];
    ootd["Etc"] = [];
  }

  return ootd;
};

function hasClothes(list, data){
  for(let each of list){
    if(each.smallClass == data.smallClass && each.color == data.color) return true;
  }

  return false;
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