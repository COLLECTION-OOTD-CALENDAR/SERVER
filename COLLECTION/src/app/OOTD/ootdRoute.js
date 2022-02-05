module.exports = function(app){
    const ootd = require('./ootdController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 1. 사용자 블럭 추가 API (JWT 검증 및 Validation )
    app.post('/app/ootd/new-block/:userIdx', jwtMiddleware, ootd.postNewBlock); //, jwtMiddleware, ootd.postNewBlock);
    //app.patch('/app/ootd/delete-block/:userIdx',jwtMiddleware, ootd.patchBlock);
};