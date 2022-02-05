
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// Monthly 달력 OOTD 부르기
async function selectMonthly(connection, userIdx) {
  const selectMonthlyListQuery = `
                SELECT date, lookpoint
                FROM OOTD
                WHERE userIdx = ?;
                `;
  const [monthlyRows] = await connection.query(selectMonthlyListQuery, userIdx);
  return monthlyRows;
}

// Weekly 달력 OOTD 부르기 - date, lookpoint 가져오기
/*
async function selectWeeklyOotd(connection, userIdx) {
  const selectWeeklyOotdQuery = `
                SELECT date, lookpoint
                FROM OOTD
                WHERE userIdx = ?;
                `;
  const [weeklyOotdRows] = await connection.query(selectWeeklyOotdQuery, userIdx);
  return weeklyOotdRows;
}
*/

// Weekly 달력 OOTD 부르기 - ootdIdx 구하기
/*
async function selectWeeklyOotdIdx(connection, userIdx) {
  const selectWeeklyOotdIdxQuery = `
                  SELECT ootdIdx
                  FROM OOTD
                  WHERE userIdx = ?;
                  `;
  const [weeklyOotdIdxRows] = await connection.query(selectWeeklyOotdIdxQuery, userIdx);
  return weeklyOotdIdxRows;
}
*/

// Weekly 달력 OOTD 부르기 - fixedPlace와 addedPlace 리스트 구하기(userIdx 이용)
/*
async function selectWeeklyPlace1(connection, userIdx) {
  const selectWeeklyPlace1Query = `
                  SELECT PL.fixedPlace, PL.addedPlace
                  FROM OOTD As O
                    JOIN Place AS PL
                      ON O.ootdIdx = PL.ootdIdx
                  WHERE O.userIdx = ?;
                  `;
  const [weeklyPlaceRows] = await connection.query(selectWeeklyPlace1Query, userIdx);
  return weeklyPlaceRows;
}
*/

// Weekly 달력 OOTD 부르기 - fixedPlace와 addedPlace 리스트 구하기(ootdIdx 이용)
/*
async function selectWeeklyPlace2(connection, ootdIdxListResult) {
  const selectWeeklyPlace2Query = `
                  SELECT PL.fixedPlace, PL.addedPlace
                  FROM OOTD As O
                    JOIN Place AS PL
                      ON O.ootdIdx = PL.ootdIdx
                  WHERE O.ootdIdx = ?;
                  `;
  const [weeklyPlaceRows] = await connection.query(selectWeeklyPlace2Query, ootdIdxListResult);
  return weeklyPlaceRows;
}
*/

// Weekly 달력 OOTD 부르기 - FixedPlace, AddedPlace 테이블 내 place 값 출력 (인자 : placeListResult1)
/*
async function selectWeeklyPlaceName1(connection, placeListResult1) {
  const weeklyPlaceNameRows = [];
  const selectWeeklyFixedPlaceQuery = `
                  SELECT place
                  FROM FixedPlace
                  WHERE index = ?;
                  `;
  const selectWeeklyAddedPlaceQuery = `
                  SELECT place
                  FROM AddedPlace
                  WHERE index = ?;
                  `;
  for(i in placeListResult1){
    const arr = [];
    //if(i[0] != -1 || i[1] != -1){
    //  arr = new Array();
    //}
    if(i[0] == -1){
      arr.splice(0, 0, null);
    }
    else{
      var place1 = await connection.query(selectWeeklyFixedPlaceQuery, placeListResult1);
      arr.splice(0, 0, place1);
    }

    if(i[1] == -1){
      arr.splice(arr.length, 0, null);
    }
    else{
      var place2 = await connection.query(selectWeeklyAddedPlaceQuery, placeListResult1);
      arr.splice(arr.length, 0, place2);
    }

    weeklyPlaceNameRows.splice(weeklyPlaceNameRows.length(), 0, arr);
  }
  return weeklyPlaceNameRows;
}
*/

// Weekly 달력 OOTD 부르기 - FixedPlace, AddedPlace 테이블 내 place 값 출력 (인자 : placeListResult2)
/*
async function selectWeeklyPlaceName2(connection, placeListResult2) {
  const weeklyPlaceNameRows = [];
  const selectWeeklyFixedPlaceQuery = `
                  SELECT place
                  FROM FixedPlace
                  WHERE index = ?;
                  `;
  const selectWeeklyAddedPlaceQuery = `
                  SELECT place
                  FROM AddedPlace
                  WHERE index = ?;
                  `;
  for(i in placeListResult2){
    const arr = [];
    //if(i[0] != -1 || i[1] != -1){
    //  arr = new Array();
    //}
    if(i[0] == -1){
      arr.splice(0, 0, null);
    }
    else{
      var place1 = await connection.query(selectWeeklyFixedPlaceQuery, i[0]);
      arr.splice(0, 0, place1);
    }

    if(i[1] == -1){
      arr.splice(arr.length, 0, null);
    }
    else{
      var place2 = await connection.query(selectWeeklyAddedPlaceQuery, i[1]);
      arr.splice(arr.length, 0, place2);
    }

    weeklyPlaceNameRows.splice(weeklyPlaceNameRows.length(), 0, arr);
  }
  return weeklyPlaceNameRows;
}
*/

/******************************************** */

// Weekly 달력 OOTD 부르기 - Place, FixedPlace, AddedPlace 테이블 join하여 반환하기
/*
async function selectWeeklyPlaceJoin(connection){
    const selectWeeklyPlaceJoinQuery = `
                SELECT PL.ootdIdx, PL.fixedPlace, PL.addedPlace, FP.place AS fpName, AP.place AS apName
                FROM Place as PL
                    LEFT JOIN FixedPlace as FP
                        ON PL.fixedPlace = FP.index
                    LEFT JOIN AddedPlace as AP
                        ON PL.addedPlace = AP.index;    
                `;
  const [placeJoinRows] = await connection.query(selectWeeklyPlaceJoinQuery);
  return placeJoinRows;
}
*/

// Weekly 달력 OOTD 부르기 - OOTD & Place join해서 placeList 구하기(userIdx 이용)
/*
async function selectWeeklyPlaceName3(connection, userIdx, placeJoinTable) {
  const selectWeeklyPlaceName3Query = `
                  SELECT PJT.fpName, PJT.apName
                  FROM OOTD as O
                      LEFT JOIN placeJoinTable as PJT
                          ON O.ootdIdx = PJT.ootdIdx
                  WHERE O.userIdx = ?
                  `;
  const [weeklyPlaceRows] = await connection.query(selectWeeklyPlaceName3Query, userIdx);
  return weeklyPlaceRows;
}
*/

/******************************************** */

// Weekly 달력 OOTD 부르기 - 테이블 Join & Union해서 한 번에 ootdList 구하기

async function selectWeeklyOotdList(connection, userIdx){
  const selectWeeklyOotdListQuery = `
                  SELECT O.ootdIdx, O.date, O.lookpoint, TMPH.imageUrl, group_concat( distinct TMPL.fpName) AS fPlace, group_concat( distinct TMPL.apName) AS aPlace,
                  group_concat( distinct TMWE.fwName) AS fWeather, group_concat( distinct TMWE.awName) AS aWeather,
                  group_concat( distinct TMWH.fwhName) AS fWho, group_concat( distinct TMWH.awhName) AS aWho,
                  group_concat( distinct TMCL.fixedBig) AS fBig, group_concat( distinct TMCL.fixedSmall) AS fSmall, group_concat( distinct TMCL.addedBig) AS aBig, group_concat( distinct TMCL.addedSmall) AS aSmall
                  
                  FROM OOTD AS O

                    LEFT JOIN ( SELECT Ph.ootdIdx, Ph.imageUrl
                      FROM Photo AS Ph
                        RIGHT JOIN OOTD AS O
                          ON Ph.ootdIdx = O.ootdIdx
                      WHERE Ph.thumbnail = 0 ) AS TMPH
                    ON O.ootdIdx = TMPH.ootdIdx
                    
                    LEFT JOIN ( SELECT PL.ootdIdx, PL.fixedPlace, PL.addedPlace, FP.place AS fpName, AP.place AS apName
                      FROM Place as PL
                        LEFT JOIN FixedPlace AS FP
                          ON PL.fixedPlace = FP.index
                        LEFT JOIN AddedPlace AS AP
                          ON PL.addedPlace = AP.index ) AS TMPL
                    ON O.ootdIdx = TMPL.ootdIdx
                    
                    LEFT JOIN ( SELECT WE.ootdIdx, WE.fixedWeather, WE.addedWeather, FW.weather AS fwName, AW.weather AS awName
                      FROM Weather as WE
                        LEFT JOIN FixedWeather AS FW
                          ON WE.fixedWeather = FW.index
                      LEFT JOIN AddedWeather AS AW
                          ON WE.addedWeather = AW.index ) AS TMWE
                    ON O.ootdIdx = TMWE.ootdIdx
                    
                    LEFT JOIN ( SELECT WH.ootdIdx, WH.fixedWho, WH.addedWho, FWH.who AS fwhName, AWH.who AS awhName
                      FROM Who as WH
                        LEFT JOIN FixedWho AS FWH
                          ON WH.fixedWho = FWH.index
                        LEFT JOIN AddedWho AS AWH
                          ON WH.addedWho = AWH.index ) AS TMWH
                    ON O.ootdIdx = TMWH.ootdIdx
                    
                    LEFT JOIN ( SELECT CL.ootdIdx, CL.fixedType, CL.addedType, FC.bigClass AS fixedBig, FC.smallClass AS fixedSmall, AC.bigClass AS addedBig, AC.smallClass AS addedSmall
                      FROM Clothes AS CL
                        LEFT JOIN FixedClothes AS FC
                          ON CL.fixedType = FC.index
                      LEFT JOIN AddedClothes AS AC
                          ON CL.addedType = AC.index ) AS TMCL
                    ON O.ootdIdx = TMCL.ootdIdx
                  
                  WHERE O.userIdx = ?
                  
                  GROUP BY O.ootdIdx;
                  `;
const [weeklyOotdRows] = await connection.query(selectWeeklyOotdListQuery, userIdx);
return weeklyOotdRows;
}


module.exports = {
  selectMonthly,
  selectWeeklyOotdList
};
