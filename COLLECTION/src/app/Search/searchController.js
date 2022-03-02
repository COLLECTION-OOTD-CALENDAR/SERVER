const jwtMiddleware = require("../../../config/jwtMiddleware");
const searchProvider = require("./searchProvider");
const searchService = require("./searchService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 17
 * API Name : 검색 결과 조회 API
 * [GET] /app/search/:PWWC?keyword1=?&keyword2=?&color1=?&color2=?          //&startAt=?&endAt=?
 */
exports.getSearchResult = async function (req, res) {

    // color 배열
    const colorArr = [ "#d60f0f", "#f59a9a", "#ffb203", "#fde6b1", "#71a238", "#b7de89",
    "#ea7831", "#273e88", "#4168e8", "#a5b9fa", "#894ac7", "#dcacff",
    "#ffffff", "#888888", "#191919", "#e8dcd5", "#c3b5ac", "#74461f"]

    let datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;

    //1. jwt token검증
    const userIdx = req.verifiedToken.userIdx;

    
    var PWWC = req.params.PWWC;  
    console.log(`PWWC value : `, PWWC, `PWWC type : `, typeof(PWWC) );
    // PWWC 빈값 검사
    if(!PWWC){
        return res.send(errResponse(baseResponse.PWWC_EMPTY));
    }

    PWWC = parseInt(PWWC);

    //PWWC 형식 검사
    if(isNaN(PWWC)){
        return res.send(errResponse(baseResponse.PWWC_ERROR_TYPE));
    }
    //PWWW 값 유효성 검사 - 0: place, 1: weather, 2: who, 3: color
    if(PWWC < 0 || PWWC > 3){
        return res.send(errResponse(baseResponse.PWWC_INVALID_VALUE));
    }



    /**
     * Query String: keyword1, keyword2, color1, color2             //startAt, endAt 
     */
    
    let keyword1 = req.query.keyword1;
    let keyword2 = req.query.keyword2;

    var color1 = null;
    var color2 = null;

    var startAt = req.query.startAt;
    var endAt = req.query.endAt;


    if (!keyword1) {
        return res.send(errResponse(baseResponse.KEYWORD1_EMPTY));
    }
    

    if(PWWC == 3){ // color 검색일 경우
        color1 = req.query.color1;
        color2 = req.query.color2;
        //color1 빈값 검사 
        if(!color1){    
            return res.send(errResponse(baseResponse.COLOR1_EMPTY));
        }
        //color1 값 유효성 검사                         ㅌ -> color 선택안할시 다른 string으로 보내주시술?
        else if(colorArr.indexOf(color1) == -1){        //정해진 color 값들 이외의 값이 들어온 경우
            return res.send(errResponse(baseResponse.COLOR_INVALID_VALUE));
        }
        else if(keyword2){//검색어가 2개인 경우 
            if(!color2){                                // keyword2에 해당하는 color2가 입력되지 않은 경우
                return res.send(errResponse(baseResponse.COLOR2_EMPTY));
            }
            if(colorArr.indexOf(color2) == -1){          //정해진 color 값들 이외의 값이 들어온 경우
                return res.send(errResponse(baseResponse.COLOR2_INVALID_VALUE));
            }
        }
        else if(color2 && (!keyword2)){                 //검색어가 2개인 경우 - color2에 해당하는 keyword2가 입력되지 않은 경우
            return res.send(errResponse(baseResponse.KEYWORD2_EMPTY));
        }   
    }




    if(startAt && (!endAt)){ //startAt만 입력
        return res.send(errResponse(baseResponse.ENDAT_EMPTY));
    }
    else if(endAt && (!startAt)){  //endAt만 입력했을 경우
        return res.send(errResponse(baseResponse.STARTAT_EMPTY));
    }
    else if (startAt && endAt) {
        startAt = new Date(startAt);
        endAt = new Date(endAt);
        if(datePattern.test(startAt)){     //yyyy-MM-dd 형식 검사
            return res.send(errResponse(baseResponse.STARTAT_ERROR_TYPE));  
        }
        if(datePattern.test(endAt)){     //yyyy-MM-dd 형식 검사
            return res.send(errResponse(baseResponse.ENDAT_ERROR_TYPE));  
        }
        
        const dateRangeStart = new Date('2010-01-01');
        const dateRangeEnd = new Date('2099-12-31');

        if( startAt < dateRangeStart || startAt > dateRangeEnd){
            return res.send(errResponse(baseResponse.STARTAT_INVALID_VALUE));  
        }
        if( endAt < dateRangeStart || endAt > dateRangeEnd){
            return res.send(errResponse(baseResponse.ENDAT_INVALID_VALUE));
        }
    }
    else{                               // ((!startAt) && (!endAt))
        startAt = null;
        endAt = null;
    }
    
    
    if(!keyword2){
        keyword2 = null;
    }


    //1. history 처리 @searchService - 개수 조회, 자동삭제, history추가
    const historyResponse = await searchService.postNewHistory(
        userIdx, PWWC, keyword1, keyword2, color1, color2, 
    );


    //2. 검색 결과 보여지기 @searchProvider - keyword1로 가져온 결과에서 keyword2가 null이 아니면 keyword2 포함하지 않는 것 제외하기
    const searchResultResponse = await searchProvider.getSearchResult(
        userIdx, PWWC, keyword1, keyword2, color1, color2, startAt, endAt
    );
    return res.send(searchResultResponse);

};
