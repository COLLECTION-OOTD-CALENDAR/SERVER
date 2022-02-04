const jwtMiddleware = require("../../../config/jwtMiddleware");
const ootdProvider = require("./ootdProvider");
const ootdService = require("./ootdService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

/**
 * API No. 1
 * API Name : 사용자 추가 블럭 API
 * [POST] /app/ootd/new-block/:userIdx?Clothes=?&PWW=?
 */
exports.postNewBlock = async function (req, res) {

      // 1. jwt token 검증 

      const IDFromJWT = req.verifiedToken.userIdx;

      const userIdx = req.params.userIdx;

    if (IDFromJWT != userIdx) {
        console.log(`userIdx : ${IDFromJWT}`)
        res.send(errResponse(baseResponse.USERID_NOT_MATCH))
    } 
    else {
        /**jwt token 검증 성공한 다음*/

        // 2. content - 형식 체크 
        /** 
         * 2-1) 공백문자로만 이루어져 있는지 => 3029
         * 2-2) 6글자가 안넘는지 길이 체크  => 3049
         */ 
        
        const content = req.body.content;

        var Content = content.toString();
        var blank_pattern = /^\s+|\s+$/g;

        if(Content.replace(blank_pattern, '' ) == "" ){
            return res.send(errResponse(baseResponse.PWWC_BLANK_TEXT));  
        }

        Content = content.toString();
        Content.trim(); //앞과 뒤의 공백 제거

        if(Content.length > 6){            
            return res.send(errResponse(baseResponse.TAG_LENGTH));
        }


        // 3. Clothes, PWW flag Null number형 형식 체크 
        const Clothes = req.query.Clothes;  //0: Top, 1: Bottom, 2: Shoes, 3: etc
        const PWW = req.query.PWW;          //0: Place, 1: Weather, 2: Who

        if(!isNaN(Clothes) || !isNaN(PWW) ){ //둘 중 하나가 숫자가 아님
            console.log(`Clothes : ${Clothes}, PWW : ${PWW}`);
            return res.send(errResponse(baseResponse.QUERY_STRING_ERROR_TYPE));
        }

        
        // 4. Clothes, PWW flag 값 체크 
        /**     Clothes PWW
         *  4-0) 유효한 값의 범위인지 체크 => PWWC_INVALID_VALUE
         *  4-1) -1   -1   => 3028 (QUERY_STRING_EMPTY) 
         *  4-2) number number    => 3042 (QUERY_STRING_OVERFLOW)
         *  4-3) number    -1   => clothes 블럭 추가
         *  4-4) -1   number    => PWW 블럭 추가
        */

        if( (Clothes < -1) || (3 < Clothes) || (PWW < -1) || (2 < PWW) ) {  //유효하지 않은 값
            return res.send(errResponse(baseResponse.PWWC_INVALID_VALUE)); 
        }

        if((Clothes == -1) && (PWW == -1)){
            return res.send(errResponse(baseResponse.FLAG_EMPTY));
        }
        if((Clothes != -1) && (PWW != -1)){
            return res.send(errResponse(baseResponse.QUERY_STRING_OVERFLOW));
        }
                

        var flag = "";

        if(PWW==-1){
            switch (Clothes) {
                case 0:
                    flag = "Top"
                    break;
                case 1:
                    flag = "Bottom"
                    break;
                case 2:
                    flag = "Shoes"
                    break;
                case 3:
                    flag = "Etc"
                    break;
            }


        }
        else if(Clothes==-1){
            switch (PWW) {
                case 0:
                    flag = "Place"
                    break;
                case 1:
                    flag = "Weather"
                    break;
                case 2:
                    flag= "Who"
                    break;
            }            
        }

        const newBlockResponse = await ootdService.createNewBlock(
            userIdx,
            flag,
            Content
        );
        
        //Service : 중복확인 -> 20개 개수 확인 -> post
        

        // newBlockResponse 값을 json으로 전달
        return res.send(newBlockResponse);
    }

};

