const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const calendarDao = require("./calendarDao");

// Provider: Read 비즈니스 로직 처리

// Monthly 달력 OOTD 부르기
exports.retrieveMonthlyList = async function (userIdx) {

  try {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    console.log('calendarProvider : connect complete');
    // Dao 쿼리문의 결과를 호출
    const monthlyListResult = await calendarDao.selectMonthly(connection, userIdx);
    for ( i in monthlyListResult ) {
      var moment = require('moment');
      monthlyListResult[i].date = moment(monthlyListResult[i].date).format('YYYY-MM-DD');
      console.log(monthlyListResult[i].date);
    }
    console.log('calendarProvider return: ', monthlyListResult);

    // connection 해제
    connection.release();
    return monthlyListResult;

  } catch(err) {
    logger.error(`App - getMonthly Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

// Weekly 달력 OOTD 부르기
exports.retrieveWeeklyList = async function (userIdx) {

  // connection 은 db와의 연결을 도와줌
  const connection = await pool.getConnection(async (conn) => conn);
  // Dao 쿼리문의 결과를 호출
  //const placeFixedOrAdded = await calendarDao.selectWhatPlace(connection, userIdx);
  //if(placeFixedOrAdded)

  //자체적으로 android에서 필요한 정보들을 뽑아 쓰는 것이라고 가정

  // date, lookpoint
  //const ootdListResult = await calendarDao.selectWeeklyOotd(connection, userIdx);
  //console.log('ootdListResult(date, lookpoint) : ', ootdListResult);
  
  // ootdIdx
  //const ootdIdxListResult = await calendarDao.selectWeeklyOotdIdx(connection, userIdx);
  //console.log('ootdIdxListResult(ootdIdx) : ', ootdIdxListResult);

  // ootd & place로 fixedPlace, addedPlace 리스트 (userIdx 사용)
  //const placeListResult1 = await calendarDao.selectWeeklyPlace1(connection, userIdx);
  //console.log('placeListResult1(fixedPlace, addedPlace) by userIdx : ', placeListResult1);

  // ootd & place로 fixedPlace, addedPlace 리스트 (ootdIdx 사용)
  //const placeListResult2 = await calendarDao.selectWeeklyPlace2(connection, ootdIdxListResult);
  //console.log('placeListResult2(fixedPlace, addedPlace) by ootdIdx : ', placeListResult2);

  // FixedPlace & AddedPlace 테이블 내 값 가져오기
  //const fixedAddedPlaceResult1 = await calendarDao.selectWeeklyPlaceName(connection, placeListResult1);
  //const fixedAddedPlaceResult2 = await calendarDao.selectWeeklyPlaceName2(connection, placeListResult2);

  /********또 다른 방법******* */

  // Place & FixedPlace & AddedPlace 테이블 join
  //const placeJoinTable = await calendarDao.selectWeeklyPlaceJoin(connection);

  // OOTD & Place Join 테이블 join하여 place 
  //const fixedAddedPlaceResult3 = await calendarDao.selectWeeklyPlaceName3(connection, userIdx, placeJoinTable);

  /*******다 같이 JOIN & UNION*******/
  // group concat 사용
  /*
  try {
    console.log('calendarProvider : connect complete');
    const ootdWeeklyListResult = await calendarDao.selectWeeklyOotdList(connection, userIdx);
    for ( i in ootdWeeklyListResult ) {
      var moment = require('moment');
      ootdWeeklyListResult[i].date = moment(ootdWeeklyListResult[i].date).format('YYYY-MM-DD');
      console.log(ootdWeeklyListResult[i].date);
    }
    console.log('calendarProvider return: ', ootdWeeklyListResult);
    // const weeklyListResult = await calendarDao.selectWeekly(connection, userIdx);
    // connection 해제
    connection.release();

    return ootdWeeklyListResult;
  } catch(err) {
    logger.error(`App - getWeekly Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
  */

  // object merge 및 assgin 사용
  console.log('calendarProvider : connect complete');
  const ootdWeeklyListResult = await calendarDao.selectWeeklyOotdList(connection, userIdx);
  console.log('ootdWeeklyListResult length : ', ootdWeeklyListResult.length);
  console.log('ootdWeeklyListResult : ', ootdWeeklyListResult);
  connection.release();

  let ootds = [];
  var moment = require('moment');

  for (let row of ootdWeeklyListResult) {
    console.log('=============for start===============');
    //console.log('ootdWeeklyListResult[0] : ', ootdWeeklyListResult[0]);
    console.log('row : ', row);
    let ootd = getOotd(row.ootdIdx, ootds);
    //console.log('처음 ootd 상태 : ', ootd);

    ootd["ootdIdx"] = row.ootdIdx;
    ootd["date"] = moment(row.date).format('YYYY-MM-DD');
    ootd["lookpoint"] = row.lookpoint;
    ootd["imageUrl"] = row.imageUrl;
    //console.log('ootd(ootdIdx, date, lookpoint, imageUrl) : ', ootd);

    ootd["place"] = getPlaces(row, ootd["place"]);
    ootd["weather"] = getWeathers(row, ootd["weather"]);
    ootd["who"] = getWhos(row, ootd["who"]);
    ootd = getBigClass(row.ootdIdx, ootds, ootd);
    //console.log('ootd(+ PWW, Top, Bottom, Shoes, Etc)', ootd);

    if(row.fixedBig != null) {
      let data = { smallClass : row.fixedSmall, color : row.color};

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
    console.log('final ootd : ', ootd);
    ootds = pushOotd(ootds, ootd);
    console.log('****** 현재 ootds ******', ootds);
  }

  console.log('++++++++최종 return ootds++++++++');
  console.log(ootds);
  return ootds;

};

function getOotd(ootdIdx, ootds) {
  for (let each of ootds){
    if(each.ootdIdx == ootdIdx) return each;
  }

  return {};
};

function getBigClass(ootdIdx, ootds, ootd){
  for (let each of ootds){
    if(each.ootdIdx == ootdIdx) return ootd;
  }

  ootd["Top"] = [];
  ootd["Bottom"] = [];
  ootd["Shoes"] = [];
  ootd["Etc"] = [];

  return ootd;
};

/*
function getPWWs(row, tmp) {
  //console.log('[getPWWs func] row : ', row);
  //console.log('[getPWWs func] tmp : ', tmp);
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

  if(row.fwName != null && tags.indexOf(row.fwName) < 0){
    tags.push(row.fwName);
  }

  if(row.awName != null && tags.indexOf(row.awName) < 0){
    tags.push(row.awName);
  }

  if(row.fwhName != null && tags.indexOf(row.fwhName) < 0){
    tags.push(row.fwhName);
  }

  if(row.fpName != null && tags.indexOf(row.fpName) < 0){
    tags.push(row.awhName);
  }

  return tags;
};
*/

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
}

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
}

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
}

function hasClothes(list, data) {
  for(let each of list) {
      if(each.smallClass == data.smallClass && each.color == data.color) return true;
  }

  return false;
};

function pushOotd(list, data){
  for (let each of list){
    if(each.ootdIdx == data.ootdIdx) return list;
  }

  list.push(data);
  return list;
};

/*
exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

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

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};
*/