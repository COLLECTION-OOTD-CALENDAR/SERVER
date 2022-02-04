
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// AddedClothes 중복 체크
async function selectClothesTag(connection, selectTagParams) {
  const selectClothesTagListQuery = `
        SELECT smallClass 
        FROM AddedClothes
        WHERE userIdx = ? AND bigClass = ? AND smallClass = ? AND status = ?;
                `;
  const [tagRows] = await connection.query(
        selectClothesTagListQuery, 
        selectTagParams);

  return tagRows;
};

// PWW 중복 체크
async function selectPwwTag(connection, selectTagParams) {
  const selectPwwTagListQuery =``;
  if(selectTagParams[1] == "Place"){
      selectPwwTagListQuery = `
        SELECT place 
        FROM AddedPlace
        WHERE userIdx = ? AND place = ? AND status = ?;
    `;

  }
  if(selectTagParams[1] == "Weather"){
    selectPwwTagListQuery = `
      SELECT weather 
      FROM AddedWeather
      WHERE userIdx = ? AND weather = ? AND status = ?;
    `; 
  }
  if(selectTagParams[1] == "Who"){
    selectPwwTagListQuery = `
      SELECT who 
      FROM AddedWho
      WHERE userIdx = ? AND who = ? AND status = ?;
    `; 
  }

  selectTagParams.splice(1,1); // selectTagParmas = [userIdx, flag, content, "active"] =>[userIdx, content, "active"]

   const [tagRows] = await connection.query(
        selectPwwTagListQuery, 
        selectTagParams);

  return tagRows;
};



async function selectClothesNumber(connection, selectTagNumParams) {
  const selectClothesNumberListQuery = `
      SELECT smallClass 
      FROM AddedClothes
      WHERE userIdx = ? AND bigClass = ? AND status = ?;
                `;
  const [tagNumRows] = await connection.query(
        selectClothesNumberListQuery, 
        selectTagNumParams);

  return tagNumRows;
};



async function selectPwwNumber(connection, selectTagNumParams) {
  const selectPwwTagListQuery =``;
  if(selectTagParams[1] == "Place"){
      selectPwwTagListQuery = `
        SELECT place 
        FROM AddedPlace
        WHERE userIdx = ? AND status = ?;
      `;

  }
  if(selectTagParams[1] == "Weather"){
      selectPwwTagListQuery = `
        SELECT weather 
        FROM AddedWeather
        WHERE userIdx = ? AND status = ?;
      `; 
  }
  if(selectTagParams[1] == "Who"){
      selectPwwTagListQuery = `
        SELECT who 
        FROM AddedWho
        WHERE userIdx = ? AND status = ?;
      `; 
  }

  selectTagNumParams.splice(1,1); // selectTagParmas = [userIdx, flag, "active"] =>[userIdx, "active"]

   const [tagNumRows] = await connection.query(
        selectPwwTagListQuery, 
        selectTagNumParams);

  return tagNumRows;
};

async function insertAddedClothes(connection, insertNewBlockParams) {
  const insertClothesQuery = `
      INSERT INTO AddedClothes(userIdx, bigClass, smallClass)
      VALUES (?, ?, ?);
  `;
  const insertClothesQueryRow = await connection.query(
      insertClothesQuery,
      insertNewBlockParams
  );

  return insertClothesQueryRow;
}

async function insertAddedPlace(connection, insertNewBlockParams) {
  const insertPlaceQuery = `
      INSERT INTO AddedPlace(userIdx, place)
      VALUES (?, ?);
  `;
  const insertPlaceQueryRow = await connection.query(
      insertPlaceQuery,
      insertNewBlockParams
  );

  return insertPlaceQueryRow;
}

async function insertAddedWeather(connection, insertNewBlockParams) {
  const insertWeatherQuery = `
      INSERT INTO AddedWeather(userIdx, weather)
      VALUES (?, ?);
  `;
  const insertWeatherQueryRow = await connection.query(
      insertWeatherQuery,
      insertNewBlockParams
  );

  return insertWeatherQueryRow;
}

async function insertAddedWho(connection, insertNewBlockParams) {
  const insertWhoQuery = `
      INSERT INTO AddedWho(userIdx, who)
      VALUES (?, ?);
  `;
  const insertWhoQueryRow = await connection.query(
      insertWhoQuery,
      insertNewBlockParams
  );

  return insertWhoQueryRow;
}

module.exports = {
  selectClothesTag,
  selectPwwTag,
  selectClothesNumber,
  selectPwwNumber,
  insertAddedClothes,
  insertAddedPlace,
  insertAddedWeather,
  insertAddedWho
};
