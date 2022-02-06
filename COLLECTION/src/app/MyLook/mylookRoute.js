module.exports = function(app){
    const mylook = require('./mylookController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. myLook 메인페이지 API
    app.get('/app/mylook/mainpage/:userIdx/:lookpoint', jwtMiddleware , mylook.getMyLookMain);

    // 2. myLook 상세페이지 API
    app.get('/app/mylook/detail/:userIdx/:lookpoint', jwtMiddleware , mylook.getMyLookDetail); 


};


