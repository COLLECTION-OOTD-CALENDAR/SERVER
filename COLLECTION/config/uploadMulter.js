const upload = require('./Multer');

exports.getImageUrl = async (req, res, next) =>
{   
    try{
        upload.single('image');    
        const Img = req.file;
        console.log('uploaded iamge : ', Img.location);
        return response(baseResponse.SUCCESS_IMAGE_URL, {'image url' : Img.location });  
    }
    catch{
        logger.error(`App - getImageUrl uploadmulter error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }                
};


// app.post('/app/ootd/s3test', upload.single('image'), function(req, res)
    // {   
    //     const Img = req.file;
    //     console.log('uploaded iamge : ', Img.location);
    //     res.send(Img.location);                    
    // });

