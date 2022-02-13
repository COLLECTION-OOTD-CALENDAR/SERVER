const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const calendarDao = require("./calendarDao");

// Provider: Read 비즈니스 로직 처리

// Monthly 달력 OOTD 부르기
exports.retrieveMonthlyList = async function (userIdx) {

  try {
    console.log('[calendarProvider] retrieveMonthlyList start');

    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    // Dao 쿼리문의 결과를 호출
    const monthlyListResult = await calendarDao.selectMonthly(connection, userIdx);
    for ( i in monthlyListResult ) {
      var moment = require('moment');
      monthlyListResult[i].date = moment(monthlyListResult[i].date).format('YYYY-MM-DD');
    }
    // connection 해제
    connection.release();
    console.log('[calendarProvider] retrieveMonthlyList finish');

    return monthlyListResult;

  } catch(err) {
    logger.error(`App - getMonthly Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

// Weekly 달력 OOTD 부르기
exports.retrieveWeeklyList = async function (userIdx) {

  console.log('[calendarProvider] retrieveWeeklyList start');

  try{
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    // Dao 쿼리문의 결과를 호출
    const ootdWeeklyListResult = await calendarDao.selectWeeklyOotdList(connection, userIdx);
    // connection 해제
    connection.release();

    let ootds = [];
    var moment = require('moment');

    for (let row of ootdWeeklyListResult) {
      
      // ootds 배열에 새로운 ootd row 추가 여부 결정
      let ootd = getOotd(row.ootdIdx, ootds);

      // ootdIdx, date, lookpoint, imageUrl 정의. 똑같을 확률 높음.
      ootd["ootdIdx"] = row.ootdIdx;
      ootd["date"] = moment(row.date).format('YYYY-MM-DD');
      ootd["lookpoint"] = row.lookpoint;
      ootd["imageUrl"] = row.imageUrl;

      // place, weather, who에 접근하여 같은 것이 있는지 확인하고 넣기
      ootd["place"] = getPlaces(row, ootd["place"]);
      ootd["weather"] = getWeathers(row, ootd["weather"]);
      ootd["who"] = getWhos(row, ootd["who"]);
      
      // bigClass 이름으로 된 key가 없을 경우 추가 및 빈 배열 value 생성
      ootd = getBigClass(row.ootdIdx, ootds, ootd);

      // fixedClothes가 있을 때
      if(row.fixedBig != null) {
        // smallClass - color로 이루어진 객체 생성
        let data = { smallClass : row.fixedSmall, color : row.color};

        // 만든 smallClass - color 객체가 이미 저장되었는지 확인한 후 저장 
        if(!hasClothes(ootd[row.fixedBig], data)){
          ootd[row.fixedBig].push(data);
        }
      }
      else { // addedClothes가 있을 때
        // smallClass - color로 이루어진 객체 생성
        let data = {smallClass : row.addedSmall, color : row.color};

        // 만든 smallClass - color 객체가 이미 저장되었는지 확인한 후 저장
        if(!hasClothes(ootd[row.addedBig], data)){
          ootd[row.addedBig].push(data);
        }
      }
      
      // 새로 만들어진 ootd를 배열에 삽입
      ootds = pushOotd(ootds, ootd);
    }

    console.log('[calendarProvider] retrieveWeeklyList finish');
    return ootds;

  }catch(err){
    logger.error(`App - getWeekly Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

// ootds 배열에 새로운 ootd row 추가 or 삽입 여부 결정
function getOotd(ootdIdx, ootds) {
  for (let each of ootds){
    if(each.ootdIdx == ootdIdx) return each;
  }

  return {};
};

// bigClass명으로 된 key가 없을 때 key 및 빈 배열 value 생성
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

// 이미 place 배열이 존재하는 지 확인 -> place명 추가
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

// 이미 weather 배열이 존재하는 지 확인 -> weather명 추가
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

// 이미 who 배열이 존재하는 지 확인 -> who명 추가
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

// 주어진 list 내에 data가 존재하는 지 확인
function hasClothes(list, data) {
  for(let each of list) {
      if(each.smallClass == data.smallClass && each.color == data.color) return true;
  }

  return false;
};

// ootdIdx가 같다면 삽입 X. 같지 않다면 삽입 O
function pushOotd(list, data){
  for (let each of list){
    if(each.ootdIdx == data.ootdIdx) return list;
  }

  list.push(data);
  return list;
};
