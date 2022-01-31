module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    // app.get('/app/test', user.getTest)

    // 1. 회원가입API
    app.post('/app/user/register', user.postUsers);

    // 2. 중복 ID 확인 
    app.get('/app/user/duplicate-id',user.duplicateID);

    // 3. 중복 닉네임 확인
    app.get('/app/user/duplicate-nickname',user.duplicateNickname);

    //4. 로그인 
    app.post('/app/user/login',user.login);

    //5. 회원정보 수정 (닉네임)
    app.patch('app/user/modi/:userIdx',jwtMiddleware, user.modiNickname);

    //6. 회원정보 수정 (비밀번호, 전화번호)
    // app.patch('app/user/modi/:userIdx',jwtMiddleware, user.modiPWPhone);

    // // 2. 유저 조회 API (+ 검색)
    // app.get('/app/users',user.getUsers); 

    // // 3. 특정 유저 조회 API
    // app.get('/app/users/:userId', user.getUserById);


    // // 아래 부분은 7주차에서 다룸.
    // // TODO: After 로그인 인증 방법 (JWT)
    // // 로그인 하기 API (JWT 생성)
    // app.post('/app/login', user.login);

    // // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)



};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API