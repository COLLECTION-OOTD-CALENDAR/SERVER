
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// AddedClothes 중복 체크
async function selectClothesTag(connection, userIdx, flag, Content) {
  const selectTagParams = [userIdx, flag, Content, "active"];// (userAdded)

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
async function selectPwwTag(connection, userIdx, flag, Content) {
  var selectPwwTagListQuery =``;
  if(flag == "Place"){
      selectPwwTagListQuery = `
        SELECT place 
        FROM AddedPlace
        WHERE userIdx = ? AND place = ? AND status = ?;
    `;

  }
  if(flag == "Weather"){
    selectPwwTagListQuery = `
      SELECT weather 
      FROM AddedWeather
      WHERE userIdx = ? AND weather = ? AND status = ?;
    `; 
  }
  if(flag == "Who"){
    selectPwwTagListQuery = `
      SELECT who 
      FROM AddedWho
      WHERE userIdx = ? AND who = ? AND status = ?;
    `; 
  }

  const selectTagParams = [userIdx, Content, "active"];// (userAdded)

   const [tagRows] = await connection.query(
        selectPwwTagListQuery, 
        selectTagParams);

  return tagRows;
};



async function selectClothesNumber(connection, userIdx, flag) {  

  const selectTagNumParams = [userIdx, flag, "active"];// (userAdded)

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



async function selectPwwNumber(connection, userIdx, flag) {
  var selectPwwTagListQuery =``;
  if(flag == "Place"){
      selectPwwTagListQuery = `
        SELECT place 
        FROM AddedPlace
        WHERE userIdx = ? AND status = ?;
      `;

  }
  if(flag == "Weather"){
      selectPwwTagListQuery = `
        SELECT weather 
        FROM AddedWeather
        WHERE userIdx = ? AND status = ?;
      `; 
  }
  if(flag == "Who"){
      selectPwwTagListQuery = `
        SELECT who 
        FROM AddedWho
        WHERE userIdx = ? AND status = ?;
      `; 
  }

  const selectTagNumParams = [userIdx, "active"];// (userAdded)

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

  return insertClothesQueryRow[0];
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

  return insertPlaceQueryRow[0];
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

  return insertWeatherQueryRow[0];
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

  return insertWhoQueryRow[0];
}



//Clothes 존재 체크 
async function selectClothesExist(connection, userIdx, flag, Content) {
  const selectTagParams = [userIdx, flag, Content];// (userAdded)

  const selectClothesTagListQuery = `
        SELECT status 
        FROM AddedClothes
        WHERE userIdx = ? AND bigClass = ? AND smallClass = ?;
                `;
  const [tagRows] = await connection.query(
        selectClothesTagListQuery, 
        selectTagParams);

  return tagRows;
}

// PWW 존재 체크
async function selectPwwExist(connection, userIdx, flag, Content) {
  var selectPwwExistListQuery =``;
  if(flag == "Place"){
    selectPwwExistListQuery = `
        SELECT status 
        FROM AddedPlace
        WHERE userIdx = ? AND place = ?
    `;

  }
  if(flag == "Weather"){
    selectPwwExistListQuery = `
      SELECT status 
      FROM AddedWeather
      WHERE userIdx = ? AND weather = ?
    `; 
  }
  if(flag == "Who"){
    selectPwwExistListQuery = `
      SELECT status 
      FROM AddedWho
      WHERE userIdx = ? AND who = ?
    `; 
  }

  const selectTagParams = [userIdx, Content];// (userAdded)

   const [tagRows] = await connection.query(
        selectPwwExistListQuery, 
        selectTagParams);

  return tagRows;
}

//

async function deleteAddedClothes(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, flag, Content];
    const updateBlockQuery = `
        UPDATE AddedClothes 
        SET status = "inactive"
        WHERE userIdx = ? AND bigClass = ? AND smallClass = ?;
        `;
    const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
    return updateBlockRow[0];
}

async function deleteAddedPlace(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, Content];
  const updateBlockQuery = `
      UPDATE AddedPlace
      SET status = "inactive"
      WHERE userIdx = ? AND place = ?;
      `;
  const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
  return updateBlockRow[0];
}

async function deleteAddedWeather(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, Content];
  const updateBlockQuery = `
      UPDATE AddedWeather 
      SET status = "inactive"
      WHERE userIdx = ? AND weather = ?;
      `;
  const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
  return updateBlockRow[0];
}

async function deleteAddedWho(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, Content];
  const updateBlockQuery = `
      UPDATE AddedWho
      SET status = "inactive"
      WHERE userIdx = ? AND who = ?;
      `;
  const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
  return updateBlockRow[0];
}



//OOTD 존재 체크 
async function selectOotdExist(connection, selectOotdExistParams) {
  const selectOotdExistQuery = `
        SELECT ootdIdx 
        FROM OOTD
        WHERE userIdx = ? AND date = ?;
                `;
  const [ootdRows] = await connection.query(
        selectOotdExistQuery, 
        selectOotdExistParams);

  return ootdRows;
}


async function deleteOotdData(connection, userIdx, ootdIdx){  //
  var updateOotdRow={};
  try{
    const deleteOotdParams = [userIdx, ootdIdx];
    const updateOotdQuery = `
        UPDATE OOTD
        SET OOTD.status = "inactive"
        WHERE userIdx = ? AND ootdIdx = ?;
        `;
      updateOotdRow = await connection.query(updateOotdQuery, deleteOotdParams);
      console.log(`ootd deleted :`, ootdIdx);


    const updateClothesQuery= `
        UPDATE Clothes
        SET status = "inactive"
        WHERE Clothes.ootdIdx = ?;
        `;
    const updateClothesRow = await connection.query(updateClothesQuery, ootdIdx);
    console.log(`clothes deleted :`, ootdIdx);

    const updatePhotoQuery= `
        UPDATE Photo, OOTD
        SET Photo.status = "inactive"
        WHERE OOTD.photoIs = 0 AND Photo.ootdIdx = ? ;
        `;
    const updatePhotoRow = await connection.query(updatePhotoQuery, ootdIdx);
    console.log(`photo deleted :`, ootdIdx);

    await connection.commit();
  }
  catch(err){
    await connection.rollback();
  }
  finally{
    return updateOotdRow[0];
  }
  
}


module.exports = {
  selectClothesTag,
  selectPwwTag,
  selectClothesNumber,
  selectPwwNumber,
  insertAddedClothes,
  insertAddedPlace,
  insertAddedWeather,
  insertAddedWho,
  selectClothesExist,
  selectPwwExist,
  deleteAddedClothes,
  deleteAddedPlace,
  deleteAddedWeather,
  deleteAddedWho,
  selectOotdExist,
  deleteOotdData
};
