const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const searchDao = require("./searchDao");
const calendarProvider = require("../Calendar/calendarProvider"); //

/* 
getSearchResult : calendarProvider 내 retrieveWeeklyList 함수 로직 이용 및 함수 이용 (credits to 녜) 

changeBlankClothes
getImageUrlKey
getImageUrl
getImageCntKey
hasImageUrl
getImageCnt
getOotd
getBigClass
getPlaces
getWeathers
getWhos
hasClothes
pushOotd

*/



exports.historyRedudantCheck = async function(userIdx, PWWC, keyword, color){
  const connection = await pool.getConnection(async (conn) => conn);
  const historyRedundantResult = await searchDao.selectOldHistory(connection, userIdx, PWWC, keyword, color);
  connection.release();
  return historyRedundantResult;
};

exports.historyNumCheck = async function (userIdx, PWWC) {

  const connection = await pool.getConnection(async (conn) => conn);
  const historyListResult = await searchDao.selectHistory(connection, userIdx, PWWC);
  connection.release();

  return historyListResult;
  
};



exports.getSearchResult = async function (userIdx, PWWC, keyword1, keyword2, color1, color2, startAt, endAt){

const connection = await pool.getConnection(async (conn) => conn);
const historyListResult = await searchDao.selectHistory(connection, userIdx, PWWC);
connection.release();


console.log('[calendarProvider] retrieveWeeklyList start');

  try{
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    // PWWC에 따라 Dao 쿼리문의 결과를 호출
    var searchListResult = [];


    if(PWWC == 0){          //place      
      //keyword1이 added, fixed 중에 있는지 get 후 해당 index를 search query의 인자로 넘겨줌
      
      var fixedPlaceIdx = -1;    
      var addedPlaceIdx = -1;
      

      let fixedpIdx = await searchDao.selectFixedPlaceCheck(connection, keyword1); 
      console.log(`fixedPlace exist 검사 - fixedIdx :`, fixedpIdx);
      
      if(typeof(fixedpIdx)!='undefined'){
        fixedPlaceIdx = fixedpIdx.index;
      }    


      let addedpIdx = await searchDao.selectAddedPlaceCheck(connection, userIdx, keyword1); 
      console.log(`addedPlace exist 검사 - addedIdx :`, addedpIdx);
      
      if(typeof(addedpIdx)!='undefined'){
        addedPlaceIdx = addedpIdx.index;
      }
       

      //검색결과 가져오기
      searchListResult = await calendarDao.selectSearchPlaceList(connection, userIdx, fixedPlaceIdx, addedPlaceIdx);
    }


    else if(PWWC == 1){     //weather
      var fixedWeatherIdx = -1;
      var addedWeatherIdx = -1;
      

      let fixedWeIdx = await searchDao.selectFixedWeatherCheck(connection, keyword1); 
      console.log(`fixedWeather exist 검사 - fixedIdx :`, fixedWeIdx);
      
      if(typeof(fixedWeIdx)!='undefined'){
        fixedWeatherIdx = fixedWeIdx.index;
      }    
       
      let addedWeIdx = await searchDao.selectAddedWeatherCheck(connection, userIdx, keyword1); 
      console.log(`addedWeather exist 검사 - addedIdx :`, addedWeIdx);
      
      if(typeof(addedWeIdx)!='undefined'){
        addedWeatherIdx = addedWeIdx.index;
      }

      searchListResult = await calendarDao.selectSearchWeatherList(connection, userIdx, fixedWeatherIdx, addedWeatherIdx);
    }


    else if(PWWC == 2){     //who
      var fixedWhoIdx = -1;
      var addedWhoIdx = -1;

      let fixedWhIdx = await searchDao.selectFixedWhoCheck(connection, keyword1); 
      console.log(`fixedWho exist 검사 - fixedIdx :`, fixedWhIdx);
      
      if(typeof(fixedWhIdx)!='undefined'){
        fixedWhoIdx = fixedWhIdx.index;
      }    
      
      let addedWhIdx = await searchDao.selectAddedWhoCheck(connection, userIdx, keyword1); 
      console.log(`addedWho exist 검사 - addedIdx :`, addedWhIdx);
      
      if(typeof(addedWhIdx)!='undefined'){
        addedWhoIdx = addedWhIdx.index;
      }

      searchListResult = await calendarDao.selectSearchWhoList(connection, userIdx, fixedWhoIdx, addedWhoIdx);
    }


    else if (PWWC == 3){    //color
      var addedClothesIdx = [];     //같은 smallClass를 갖는 bigClass들 존재 가능 (ex: top-나이키, shoes-나이키)
      var fixedClothesIdx = -1;

      let fixedCIdx = await searchDao.selectFixedClothesCheck(connection, keyword1); 
      console.log(`fixedClothes exist 검사 - fixedIdx :`, fixedCIdx);
      
      if(typeof(fixedCIdx)!='undefined'){
        fixedWhoIdx = fixedCIdx.index;
      }    
      
      let addedCIdx = await searchDao.selectAddedClothesCheck(connection, userIdx, keyword1); 
      console.log(`addedClothes exist 검사 - addedIdx :`, addedCIdx);
      
      if(typeof(addedCIdx)!='undefined'){
        addedWhoIdx = addedCIdx;
      }                     

      for(let addedCloIdx of addedClothesIdx){
        let searchResult = await calendarDao.selectSearchColorList(connection, userIdx, fixedClothesIdx, addedCloIdx, color1);
        searchListResult = searchListResult.concat(searchResult);
      }



      
    }
    // connection 해제
    connection.release();




    //ootd list 처리 - credits to 녜
    let ootds = [];
    var moment = require('moment');
    let img_cnt = 0;
    let imgUrlArr = [];

    for (let row of searchListResult) {
      
      // ootds 배열에 새로운 ootd row 추가 여부 결정
      let ootd = calendarProvider.getOotd(row.ootdIdx, ootds);
      // img_cnt와 distinct한 imgUrl을 저장하는 배열 초기화
      if(!ootd.ootdIdx){
        img_cnt = 0;
        imgUrlArr = [];
      }

      // ootdIdx, date, lookpoint, imageUrl 정의. 똑같을 확률 높음.
      ootd["ootdIdx"] = row.ootdIdx;
      ootd["date"] = moment(row.date).format('YYYY-MM-DD');
      ootd["lookpoint"] = row.lookpoint;

      // imageUrl key를 이어가거나 새로 추가하기
      ootd["imageUrl"] = calendarProvider.getImageUrlKey(row.ootdIdx, ootds);
      // imageUrl
      if(!ootd["imageUrl"]){
        ootd["imageUrl"] = calendarProvider.getImageUrl(row.imageUrl, row.thumbnail);
      }
      
      // imageCnt key를 이어나가거나 새로 추가하기
      ootd["imageCnt"] = calendarProvider.getImageCntKey(row.ootdIdx, ootds);
      //imageCnt
      if(!calendarProvider.hasImageUrl(imgUrlArr, row.imageUrl)){
        ootd["imageCnt"] = calendarProvider.getImageCnt(row.thumbnail, img_cnt, ootd["imageCnt"]);
        img_cnt = ootd["imageCnt"];
      }

      // place, weather, who에 접근하여 같은 것이 있는지 확인하고 넣기
      ootd["place"] = calendarProvider.getPlaces(row, ootd["place"]);
      ootd["weather"] = calendarProvider.getWeathers(row, ootd["weather"]);
      ootd["who"] = calendarProvider.getWhos(row, ootd["who"]);
      
      // bigClass 이름으로 된 key가 없을 경우 추가 및 빈 배열 value 생성
      ootd = calendarProvider.getBigClass(row.ootdIdx, ootds, ootd);

      // fixedClothes가 있을 때
      if(row.fixedBig != null) {
        // smallClass - color로 이루어진 객체 생성
        let data = { smallClass : row.fixedSmall, color : row.color};

        // 만든 smallClass - color 객체가 이미 저장되었는지 확인한 후 저장 
        if(!calendarProvider.hasClothes(ootd[row.fixedBig], data)){
          ootd[row.fixedBig].push(data);
        }
      }
      else { // addedClothes가 있을 때
        // smallClass - color로 이루어진 객체 생성
        let data = {smallClass : row.addedSmall, color : row.color};

        // 만든 smallClass - color 객체가 이미 저장되었는지 확인한 후 저장
        if(!calendarProvider.hasClothes(ootd[row.addedBig], data)){
          ootd[row.addedBig].push(data);
        }
      }
      
      // 새로 만들어진 ootd를 배열에 삽입
      ootds = calendarProvider.pushOotd(ootds, ootd);
    }

    // 빈 배열을 갖는 Top, Bottom, Shoes, Etc 값 변경 함수
    ootds = calendarProvider.changeBlankClothes(ootds);



    //keyword2 != null일 경우 포함하지 않는 것 제외 -> 모두 제외되면 err(SEARCH_NOT_FOUND)
    //date처리 - startAt, endAt





    console.log('[searchProvider] getSearchResult finish');
    return ootds;

  }catch(err){
    logger.error(`App - getSearchResult Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }





};
