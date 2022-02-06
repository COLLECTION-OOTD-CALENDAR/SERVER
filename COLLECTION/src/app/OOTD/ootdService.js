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





exports.createNewBlock = async function (userIdx, Clothes, PWW, Content) {
    try {    
        //1. 블럭 Content 중복 확인  
        const ContentRows = await ootdProvider.tagRedundantCheck(userIdx, Clothes, PWW, Content);
        if(ContentRows.length > 0)
            return errResponse(baseResponse.TAG_REDUNDANT);


            
        //  2. 추가하는 블럭 20개 넘는지 체크, 20개 미만이면 추가
        const numberRows = await ootdProvider.tagNumberCheck(userIdx, Clothes, PWW);
        if (numberRows.length >= 20)
            return errResponse(baseResponse.TAG_OVERFLOW);



        // 3. POST 쿼리문에 사용할 변수 값을 배열 형태로 전달
        

        
        const connection = await pool.getConnection(async (conn) => conn);

        if(PWW == -1){
            var flag;//undefined
            if(Clothes == 0) 
                flag = "Top";
            
            else if(Clothes == 1) 
                flag = "Bottom";

            else if(Clothes == 2) 
                flag = "Shoes";
            else if(Clothes == 3) 
                flag = "Etc"; 

            console.log(`service flag : ${flag}`);
            const insertNewBlockParams = [userIdx, flag, Content];
            const clothesResult = await ootdDao.insertAddedClothes(connection, insertNewBlockParams);
            connection.release();
            
            console.log(`추가된 블럭 : ${Content}`);
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Clothes' : Content});
        }        
        else if(PWW == 0){
            insertNewBlockParams = [userIdx, Content];
            const placeResult = await ootdDao.insertAddedPlace(connection, insertNewBlockParams);
            connection.release();
            
            console.log(`추가된 블럭 : ${Content}`);
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Place' : Content});
        }
        else if(PWW == 1){
            insertNewBlockParams = [userIdx, Content];
            const weatherResult = await ootdDao.insertAddedWeather(connection, insertNewBlockParams);
            connection.release();
      
            console.log(`추가된 블럭 : ${Content}`);
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Weather' : Content});
        }
        else if(PWW == 2){
            insertNewBlockParams = [userIdx, Content];
            const whoResult = await ootdDao.insertAddedWho(connection, insertNewBlockParams);
            connection.release();
      
            
            console.log(`추가된 블럭 : ${Content}`);
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Place' : Content});
        }


    } catch (err) {
        logger.error(`App - createNewBlock Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.deleteBlock = async function (userIdx, Clothes, PWW, Content) {
    try {    
        //1. 블럭 Content 존재 확인  
        // 해당하는 블럭의 status를 블러와서 길이가 0이면 아예 존재하지 않는 경우, 내용이 inactive이면 이미 삭제된 경우
        //TAG_ALREADY_DELETED
        //TAG_NEVER_EXISTED

        // const ContentRows = await ootdProvider.tagExistCheck(userIdx, Clothes, PWW, Content);
        // console.log(`exist 검사 - status : ${ContentRows}`);

        // if(ContentRows.length == 0)
        //     return errResponse(baseResponse.TAG_NEVER_EXISTED);
        
        // else if(ContentRows == "inactive")
        //     return errResponse(baseResponse.TAG_ALREADY_DELETED);



        const connection = await pool.getConnection(async (conn) => conn);

        if(PWW == -1){
            var flag;//undefined
            if(Clothes == 0) 
                flag = "Top";
            
            else if(Clothes == 1) 
                flag = "Bottom";

            else if(Clothes == 2) 
                flag = "Shoes";
            else if(Clothes == 3) 
                flag = "Etc"; 

            console.log(`service flag : ${flag}`);
            const deleteNewBlockParams = [userIdx, flag, Content];
            const clothesResult = await ootdDao.deleteAddedClothes(connection, deleteNewBlockParams);
            connection.release();
        
            console.log(`삭제된 블럭 :`, clothesResult );            
            return response(baseResponse.SUCCESS_DELETE_BLOCK, {'deleted Place' : Content});
            
        }        
        else if(PWW == 0){
            const deleteNewBlockParams = [userIdx, Content];
            const placeResult = await ootdDao.deleteAddedPlace(connection, deleteNewBlockParams);
            connection.release();
        
            console.log(`삭제된 블럭 :`, placeResult );            
            return response(baseResponse.SUCCESS_DELETE_BLOCK, {'deleted Place' : Content});
        }
        else if(PWW == 1){
            const deleteNewBlockParams = [userIdx, Content];
            const weatherResult = await ootdDao.deleteAddedWeather(connection, deleteNewBlockParams);
            connection.release();
            
        
            console.log(`삭제된 블럭 :`, weatherResult );            
            return response(baseResponse.SUCCESS_DELETE_BLOCK, {'deleted Place' : Content});
      
        }
        else if(PWW == 2){
            const deleteNewBlockParams = [userIdx, Content];
            const whoResult = await ootdDao.deleteAddedWho(connection, deleteNewBlockParams);
            connection.release();
            
        
            console.log(`삭제된 블럭 :`, whoResult );            
            return response(baseResponse.SUCCESS_DELETE_BLOCK, {'deleted Place' : Content});
        }


    }catch (err) {
        logger.error(`App - deleteBlock Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};