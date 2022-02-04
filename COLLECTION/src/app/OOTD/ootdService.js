const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const ootdProvider = require("./ootdProvider");
const ootdDao = require("./ootdDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리





exports.createNewBlock = async function (userId, flag, content) {
    try {    
        //1. 블럭 content 중복 확인  
        const contentRows = await ootdProvider.tagRedundantCheck(userId, flag, content);
        if(contentRows.length > 0)
            return errResponse(baseResponse.TAG_REDUNDANT);


            
        //  2. 추가하는 블럭 20개 넘는지 체크, 20개 미만이면 추가
        const numberRows = await ootdProvider.tagNumberCheck(userId, flag);
        if (numberRows.length >= 20)
            return errResponse(baseResponse.TAG_OVERFLOW);



        // 3. POST 쿼리문에 사용할 변수 값을 배열 형태로 전달
        
        const insertNewBlockParams = [userId, flag, content];

        
        const connection = await pool.getConnection(async (conn) => conn);

        if(Clothes.includes(flag)){
            const clothesResult = await ootdDao.insertAddedClothes(connection, insertNewBlockParams);
            connection.release();
            
            console.log(`추가된 블럭 : ${content}`);
            return response(baseResponse.SUCCESS, clothesResult);
        }        
        else if(flag == "Place"){
            insertNewBlockParams = [userId, content];
            const placeResult = await ootdDao.insertAddedPlace(connection, insertNewBlockParams);
            connection.release();
            
            console.log(`추가된 블럭 : ${content}`);
            return response(baseResponse.SUCCESS, placeResult);
        }
        else if(flag == "Weather"){
            insertNewBlockParams = [userId, content];
            const weatherResult = await ootdDao.insertAddedWeather(connection, insertNewBlockParams);
            connection.release();
      
            console.log(`추가된 블럭 : ${content}`);
            return response(baseResponse.SUCCESS, weatherResult);
        }
        else if(flag == "Who"){
            insertNewBlockParams = [userId, content];
            const whoResult = await ootdDao.insertAddedWho(connection, insertNewBlockParams);
            connection.release();
      
            
            console.log(`추가된 블럭 : ${content}`);
            return response(baseResponse.SUCCESS, whoResult);
        }


    } catch (err) {
        logger.error(`App - createNewBlock Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
