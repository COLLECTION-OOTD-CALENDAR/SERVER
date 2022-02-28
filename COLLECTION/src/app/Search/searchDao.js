
async function selectHistory(connection, userIdx, PWWC) {

  const selectHistoryQuery = `
                SELECT index 
                FROM History 
                WHERE userIdx = ? AND PWWC = ? AND status = ?;
                `;

  const selectHistoryParams = [userIdx, PWWC, "active"];

  const [historyRows] = await connection.query(selectHistoryQuery, selectHistoryParams);
  return historyRows;
}


async function selectOldHistory(connection, userIdx, PWWC, keyword, color) {
  const selectHistoryParams = [userIdx, PWWC, keyword, color, "active"];// (userAdded)

  const selectOldHistoryQuery = `
        SELECT index 
        FROM History
        WHERE userIdx = ? AND PWWC = ? AND content = ? AND color = ? AND status = ?;
                `;
  const [historyRows] = await connection.query(
        selectOldHistoryQuery, 
        selectHistoryParams);

  return tagRows;
};

async function deleteOneHistory(connection, userIdx, PWWC, index){

  const updateOneHistQuery = `
        UPDATE History 
        SET status = "inactive", History.updateAt = CURRENT_TIMESTAMP
        WHERE index = ? AND userIdx = ? AND PWWC = ?;
        `;

  const updateOneHistParams = [index, userIdx, PWWC];

  const updateOneHistRow = await connection.query(updateOneHistQuery, updateOneHistParams);
  return updateOneHistRow[0]; 
}

async function insertHistory(connection, insertNewHistoryParams) {
  //insertNewHistoryParams = [userIdx, PWWC, keyword, color];
  const insertHistoryQuery = `
      INSERT INTO History(userIdx, PWWC, content, color)
      VALUES (?, ?, ?, ?);
  `;
  const insertHistoryQueryRow = await connection.query(
      insertHistoryQuery,
      insertNewHistoryParams
  );

  return insertHistoryQueryRow[0];
};



//키워드 존재 체크 -  Place (added, fixed) 
async function selectAddedPlaceCheck(connection, userIdx, keyword1) {
  const selectAddedPlaceQuery = `
        SELECT index
        FROM AddedPlace
        WHERE userIdx = ? AND place = ?;
                `;
  const selectAddedPlaceParams = [userIdx, keyword1]
  const [selectAddedPlaceRows] = await connection.query(
      selectAddedPlaceQuery, 
      selectAddedPlaceParams);

  return selectAddedPlaceRows;
}

async function selectFixedPlaceCheck(connection, keyword1) {
  const selectFixedPlaceQuery = `
        SELECT index
        FROM FixedPlace
        WHERE AND place = ?;
                `;
  const [selectFixedPlaceRows] = await connection.query(
    selectFixedPlaceQuery, 
      keyword1);

  return selectFixedPlaceRows;
}



//키워드 존재 체크 -  Weather (added, fixed) 
async function selectAddedWeatherCheck(connection, userIdx, keyword1) {
  const selectAddedWeatherQuery = `
        SELECT index
        FROM AddedWeather
        WHERE userIdx = ? AND weather = ?;
                `;
  const selectAddedWeatherParams = [userIdx, keyword1]
  const [selectAddedWeatherRows] = await connection.query(
      selectAddedWeatherQuery, 
      selectAddedWeatherParams);

  return selectAddedWeatherRows;
}

async function selectFixedWeatherCheck(connection, keyword1) {
  const selectFixedWeatherQuery = `
        SELECT index
        FROM FixedWeather
        WHERE AND weather = ?;
                `;
  const [selectFixedWeatherRows] = await connection.query(
    selectFixedWeatherQuery, 
      keyword1);

  return selectFixedWeatherRows;
}



//키워드 존재 체크 -  Who (added, fixed) 
async function selectAddedWhoCheck(connection, userIdx, keyword1) {
  const selectAddedWhoQuery = `
        SELECT index
        FROM AddedWho
        WHERE userIdx = ? AND who = ?;
                `;
  const selectAddedWhoParams = [userIdx, keyword1]
  const [selectAddedWhoRows] = await connection.query(
      selectAddedWhoQuery, 
      selectAddedWhoParams);

  return selectAddedWhoRows;
}

async function selectFixedWhoCheck(connection, keyword1) {
  const selectFixedWhoQuery = `
        SELECT index
        FROM FixedWho
        WHERE AND who = ?;
                `;
  const [selectFixedWhoRows] = await connection.query(
    selectFixedWhoQuery, 
      keyword1);

  return selectFixedWhoRows;
}


//키워드 존재 체크 -  Clothes (added, fixed) 
async function selectAddedClothesCheck(connection, userIdx, keyword1) {
  const selectAddedClothesQuery = `
        SELECT index
        FROM AddedClothes
        WHERE userIdx = ? AND smallClass = ?;
                `;
  const selectAddedClothesParams = [userIdx, keyword1]
  const [selectAddedClothesRows] = await connection.query(
      selectAddedClothesQuery, 
      selectAddedClothesParams);

  return selectAddedClothesRows;
}

async function selectFixedClothesCheck(connection, keyword1) {
  const selectFixedClothesQuery = `
        SELECT index
        FROM FixedClothes
        WHERE AND smallClass = ?;
                `;
  const [selectFixedClothesRows] = await connection.query(
    selectFixedClothesQuery, 
      keyword1);

  return selectFixedClothesRows;
}



async function selectSearchPlaceList(connection, userIdx, fixedPlaceIdx, addedPlaceIdx){
  const selectSearchPlaceQuery = `
        SELECT distinct O.ootdIdx, O.date, O.lookpoint,
        TMPH.imageUrl, TMPH.thumbnail, TMPL.fpName, TMPL.apName,
        TMWE.fwName, TMWE.awName, TMWH.fwhName, TMWH.awhName,
        TMCL.color, TMCL.fixedBig, TMCL.fixedSmall, TMCL.addedBig, TMCL.addedSmall

        FROM Place, OOTD AS O
        LEFT JOIN ( SELECT Ph.ootdIdx, Ph.imageUrl, Ph.thumbnail
          FROM Photo AS Ph
            RIGHT JOIN OOTD AS O
              ON Ph.ootdIdx = O.ootdIdx) AS TMPH
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
        LEFT JOIN ( SELECT CL.ootdIdx, CL.fixedType, CL.addedType, CL.color, FC.bigClass AS fixedBig, FC.smallClass AS fixedSmall, AC.bigClass AS addedBig, AC.smallClass AS addedSmall
          FROM Clothes AS CL
            LEFT JOIN FixedClothes AS FC
              ON CL.fixedType = FC.index
            LEFT JOIN AddedClothes AS AC
              ON CL.addedType = AC.index ) AS TMCL
          ON O.ootdIdx = TMCL.ootdIdx
        WHERE  O.userIdx = ? AND Place.fixedPlace = ?  AND Place.addedPlace = ? AND O.status = ?
        ORDER BY O.date;
        `;
  const selectSearchPlaceParams = [userIdx, fixedPlaceIdx, addedPlaceIdx, 'active'];
  const [searchPlaceRows] = await connection.query(selectSearchPlaceQuery, selectSearchPlaceParams);
  return searchPlaceRows;
};

async function selectSearchWeatherList(connection, userIdx, fixedWeatherIdx, addedWeatherIdx){
  const selectSearchWeatherQuery = `
        SELECT distinct O.ootdIdx, O.date, O.lookpoint,
        TMPH.imageUrl, TMPH.thumbnail, TMPL.fpName, TMPL.apName,
        TMWE.fwName, TMWE.awName, TMWH.fwhName, TMWH.awhName,
        TMCL.color, TMCL.fixedBig, TMCL.fixedSmall, TMCL.addedBig, TMCL.addedSmall

        FROM Weather, OOTD AS O
        LEFT JOIN ( SELECT Ph.ootdIdx, Ph.imageUrl, Ph.thumbnail
          FROM Photo AS Ph
            RIGHT JOIN OOTD AS O
              ON Ph.ootdIdx = O.ootdIdx) AS TMPH
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
        LEFT JOIN ( SELECT CL.ootdIdx, CL.fixedType, CL.addedType, CL.color, FC.bigClass AS fixedBig, FC.smallClass AS fixedSmall, AC.bigClass AS addedBig, AC.smallClass AS addedSmall
          FROM Clothes AS CL
            LEFT JOIN FixedClothes AS FC
              ON CL.fixedType = FC.index
            LEFT JOIN AddedClothes AS AC
              ON CL.addedType = AC.index ) AS TMCL
          ON O.ootdIdx = TMCL.ootdIdx
        WHERE  O.userIdx = ? AND Weather.fixedWeather = ?  AND Weather.addedWeather = ? AND O.status = ?
        ORDER BY O.date;
        `;
  const selectSearchWeatherParams = [userIdx, fixedWeatherIdx, addedWeatherIdx, 'active'];
  const [searchWeatherRows] = await connection.query(selectSearchWeatherQuery, selectSearchWeatherParams);
  return searchWeatherRows;
};


async function selectSearchWhoList(connection, userIdx, fixedWhoIdx, addedWhoIdx){
  const selectSearchWhoQuery = `
        SELECT distinct O.ootdIdx, O.date, O.lookpoint,
        TMPH.imageUrl, TMPH.thumbnail, TMPL.fpName, TMPL.apName,
        TMWE.fwName, TMWE.awName, TMWH.fwhName, TMWH.awhName,
        TMCL.color, TMCL.fixedBig, TMCL.fixedSmall, TMCL.addedBig, TMCL.addedSmall

        FROM Who, OOTD AS O
        LEFT JOIN ( SELECT Ph.ootdIdx, Ph.imageUrl, Ph.thumbnail
          FROM Photo AS Ph
            RIGHT JOIN OOTD AS O
              ON Ph.ootdIdx = O.ootdIdx) AS TMPH
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
        LEFT JOIN ( SELECT CL.ootdIdx, CL.fixedType, CL.addedType, CL.color, FC.bigClass AS fixedBig, FC.smallClass AS fixedSmall, AC.bigClass AS addedBig, AC.smallClass AS addedSmall
          FROM Clothes AS CL
            LEFT JOIN FixedClothes AS FC
              ON CL.fixedType = FC.index
            LEFT JOIN AddedClothes AS AC
              ON CL.addedType = AC.index ) AS TMCL
          ON O.ootdIdx = TMCL.ootdIdx
        WHERE  O.userIdx = ? AND Who.fixedWho = ?  AND Who.addedWho = ? AND O.status = ?
        ORDER BY O.date;
        `;
  const selectSearchWhoParams = [userIdx, fixedWhoIdx, addedWhoIdx, 'active'];
  const [searchWhoRows] = await connection.query(selectSearchWhoQuery, selectSearchWhoParams);
  return searchWhoRows;
};

async function selectSearchColorList(connection, userIdx, fixedClothesIdx, addedCloIdx, color1){
  const selectSearchColorQuery = `
        SELECT distinct O.ootdIdx, O.date, O.lookpoint,
        TMPH.imageUrl, TMPH.thumbnail, TMPL.fpName, TMPL.apName,
        TMWE.fwName, TMWE.awName, TMWH.fwhName, TMWH.awhName,
        TMCL.color, TMCL.fixedBig, TMCL.fixedSmall, TMCL.addedBig, TMCL.addedSmall
        
        FROM Clothes, OOTD AS O
        LEFT JOIN ( SELECT Ph.ootdIdx, Ph.imageUrl, Ph.thumbnail
          FROM Photo AS Ph
            RIGHT JOIN OOTD AS O
              ON Ph.ootdIdx = O.ootdIdx) AS TMPH
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
        LEFT JOIN ( SELECT CL.ootdIdx, CL.fixedType, CL.addedType, CL.color, FC.bigClass AS fixedBig, FC.smallClass AS fixedSmall, AC.bigClass AS addedBig, AC.smallClass AS addedSmall
          FROM Clothes AS CL
            LEFT JOIN FixedClothes AS FC
              ON CL.fixedType = FC.index
            LEFT JOIN AddedClothes AS AC
              ON CL.addedType = AC.index ) AS TMCL
          ON O.ootdIdx = TMCL.ootdIdx
        WHERE  O.userIdx = ? AND Clothes.fixedType = ?  AND Clothes.addedType = ? AND Clothes.color = ? AND O.status = ?
        ORDER BY O.date;
        `;
  const selectSearchColorParams = [userIdx, fixedClothesIdx, addedCloIdx, color1, 'active'];
  const [searchColorRows] = await connection.query(selectSearchColorQuery, selectSearchColorParams);
  return searchColorRows;
};









module.exports = {
  selectHistory,
  selectOldHistory,
  deleteOneHistory,
  insertHistory,  
  
  selectAddedPlaceCheck,
  selectFixedPlaceCheck,
  
  selectAddedWeatherCheck,
  selectFixedWeatherCheck,

  selectAddedWhoCheck,
  selectFixedWhoCheck,

  selectAddedClothesCheck,
  selectFixedClothesCheck,


  selectSearchPlaceList,
  selectSearchWeatherList,
  selectSearchWhoList,
  selectSearchColorList,
};
