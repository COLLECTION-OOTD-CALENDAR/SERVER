module.exports = function(app){
    const calendar = require('./calendarController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. Monthly 달력 OOTD 부르기 API
    app.get('/app/calendar/monthly/:userIdx', jwtMiddleware, calendar.getMonth)

    // 1. 유저 생성 (회원가입) API
    //app.post('/app/users', calendar.postUsers);

    // 2. Weekly 달력 OOTD 부르기 API
    app.get('/app/calendar/weekly/:userIdx', jwtMiddleware, calendar.getWeek); 

    // 3. 특정 유저 조회 API
    //app.get('/app/users/:userId', calendar.getUserById);


    // 아래 부분은 7주차에서 다룸.
    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    //app.post('/app/login', calendar.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    //app.patch('/app/users/:userId', jwtMiddleware, calendar.patchUsers)



};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API