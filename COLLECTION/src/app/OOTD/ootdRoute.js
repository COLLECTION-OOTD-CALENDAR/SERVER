module.exports = function(app){
    const ootd = require('./ootdController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const upload = require('../../../config/Multer');

    // 1. 사용자 블럭 추가 API (JWT 검증 및 Validation )
    app.post('/app/ootd/new-block', jwtMiddleware, ootd.postNewBlock); //, jwtMiddleware, ootd.postNewBlock);
    
    
    //2. 사용자 블럭 삭제 API (JWT 검증 및 Validation)
    app.patch('/app/ootd/delete-block',jwtMiddleware, ootd.patchBlock);


    //3. OOTD 삭제 API
    app.patch('/app/ootd/deletion',jwtMiddleware, ootd.patchOotd);


    //4. S3 test 이미지 업로드 API
    app.post('/app/ootd/s3test', upload.single('image'), (req, res) =>
    {        
        try{
            const Img = req.file;

            console.log("image req file : ", Img)

            let payload = { url :Img.location };
            res.send(payload); 
        }
        catch(err){
            console.log(err);
            return errResponse(baseResponse.SERVER_ERROR);
        }
    });
};