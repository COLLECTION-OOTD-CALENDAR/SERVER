const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const ootdDao = require("./ootdDao");

// Provider: Read 비즈니스 로직 처리

exports.tagRedundantCheck = async function(userIdx, flag, Content){
  /*    

   1) Clothes일 경우 AddedClothes에서 userId와 flag (bigClass)가 일치하는 열 중
      Content가 smallClass와 같은 것을 배열에 저장한 후 반환

    2) PWW일 경우 flag에 해당하는 각 Place/Weather/Who에서 userId와 일치하는 열 중
       Content가 place/weather/who와 같은 것을 배열에 저장한 후 반환
   */

    const Clothes = ["Top", "Bottom", "Shoes", "Etc"];
    //const PWW = ["Place", "Weather", "Who"];


    const connection = await pool.getConnection(async (conn) => conn);
    console.log(`flag : ${flag}`);
    if(Clothes.includes(flag)){
      const clothesRedundantListResult = await ootdDao.selectClothesTag(connection, userIdx, flag, Content);
      connection.release();

      return clothesRedundantListResult;
    }
    else{
      const pwwRedundantListResult = await ootdDao.selectPwwTag(connection, userIdx, flag, Content);
      connection.release();

      return pwwRedundantListResult;
    }

};

exports.tagNumberCheck = async function(userIdx, flag){
  /*
   1) Clothes일 경우 AddedClothes에서 userId와 flag (bigClass)가 일치하는 열 중
      active인 것들을 배열에 저장한 후 반환

    2) PWW일 경우 flag에 해당하는 각 Place/Weather/Who에서 userId와 일치하는 열 중
       active인 것들을 pwwRows에 저장한 후 배열을 반환
   */

    const Clothes = ["Top", "Bottom", "Shoes", "Etc"];
    //const PWW = ["Place", "Weather", "Who"];

    const connection = await pool.getConnection(async (conn) => conn);

    if(Clothes.includes(flag)){
      const clothesNumberListResult = await ootdDao.selectClothesNumber(connection, userIdx, flag);
      connection.release();

      return clothesNumberListResult;
    }
    else{
      const pwwNumberListResult = await ootdDao.selectPwwNumber(connection, userIdx, flag);
      connection.release();

      return pwwNumberListResult;
    }

};


