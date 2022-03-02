const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

const searchProvider = require("./searchProvider");
const searchDao = require("./searchDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");


exports.postNewHistory = async function (userIdx, PWWC, keyword1, keyword2, color1, color2) {
    try {
        
        const connection = await pool.getConnection(async (conn) => conn);

        try {//history 관련 과정 - transaction 처리
            await connection.beginTransaction();

            
            //0. active 한 것중에 keyword1과 같은 history가 있는지 검사 -> 있으면 이전에 검색한것 inactive, 바로 새로 추가

            let oldHistory1 = await searchProvider.historyRedudantCheck(userIdx, PWWC, keyword1, color1);
            console.log(`oldHistory1 검사 - index :`, oldHistory1);

            if(typeof(oldHistory1) != 'undefined'){ //존재하는 경우
                //예전 것 삭제 
                oldRedunHistory1 = oldHistory1.index;                                                                               
                const deleteRedunHistoryResult = await searchDao.deleteOneHistory(connection, userIdx, PWWC, oldRedunHistory1);
                console.log(`deleted old redundant history - historyIdx `, oldHistory1 );            
            }
            else{
                const historyRows = await searchProvider.historyNumCheck(userIdx, PWWC);  
                if(historyRows.length >= 20){
                    //가장 오래된 것 1개 삭제
                    const oldestIdx = historyRows[0];
                    const deleteOldHistoryResult = await searchDao.deleteOneHistory(connection, userIdx, PWWC, oldestIdx);
                    console.log(`auto-deleted old history - historyIdx `, oldestIdx );                
                }
            }
            //keyword1 History에 추가
            const insertNewHistoryParams = [userIdx, PWWC, keyword1, color1];
            const keyword1Result = await searchDao.insertHistory(connection, insertNewHistoryParams);


            
            if(keyword2 != null) {         //검색어 1개 일 경우 - history 20개 이상이면 1개 삭제, 미만이면 추가
                let oldHistory2 = await searchProvider.historyRedudantCheck(userIdx, PWWC, keyword2, color2);
                console.log(`oldHistory2 검사 - index :`, oldHistory2);
    
                if(typeof(oldHistory2) != 'undefined'){ //존재하는 경우
                    //예전 것 삭제 
                    oldRedunHistory2 = oldHistory2.index;                                                                               
                    const deleteRedunHistoryResult2 = await searchDao.deleteOneHistory(connection, userIdx, PWWC, oldRedunHistory2);
                    console.log(`deleted old redundant history 2 - historyIdx `, oldHistory2 );            
                }
                else{
                    const historyRows2 = await searchProvider.historyNumCheck(userIdx, PWWC);  
                    if(historyRows.length >= 20){
                        //가장 오래된 것 1개 삭제
                        const oldestIdx2 = historyRows2[0];
                        const deleteOldHistoryResult2 = await searchDao.deleteOneHistory(connection, userIdx, PWWC, oldestIdx2);
                        console.log(`auto-deleted old history - historyIdx `, oldestIdx2 );                
                    }
                }
                //keyword2 History에 추가
                const insertNewHistoryParams2 = [userIdx, PWWC, keyword2, color2];
                const keyword2Result = await searchDao.insertHistory(connection, insertNewHistoryParams2);

                
            }
            
            await connection.commit();
            console.log(`searchService - postNewHistory 처리 완료`);
            return response(baseResponse.SUCCESS_SEARCH_ADDITION, {'userId': userIdx, 'keyword1': keyword1, 'keyword2' : keyword2});
            
        } catch (err) {
            logger.error(`App - history Transaction error @ searchService\n: ${err.message} \n${JSON.stringify(err)}`);
            return errResponse(baseResponse.HISTORY_HANDLING_ERROR);
        }       

    } catch (err) {
        logger.error(`App - postNewHistory Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

