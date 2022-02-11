const upload = require('../../../config/Multer');

exports.getImageUrl = async (req, res, next) =>
{   
    upload.single('image');    
    const Img = req.file;
    console.log('uploaded iamge : ', Img.location);
    return Img.location;                    
};


// app.post('/app/ootd/s3test', upload.single('image'), function(req, res)
    // {   
    //     const Img = req.file;
    //     console.log('uploaded iamge : ', Img.location);
    //     res.send(Img.location);                    
    // });