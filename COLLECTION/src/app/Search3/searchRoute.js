module.exports = function(app){
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. [PWWC] 검색 초기화면 보여주기 API
    app.get('/app/search/mainpage/:PWWC', jwtMiddleware, searchMain);

    // 2. [PWWC] 매칭 페이지 검색 키워드 제안
    //app.get('/app/search/suggestion/:PWWC', jwtMiddleware, suggestSearchKeyword);

};
