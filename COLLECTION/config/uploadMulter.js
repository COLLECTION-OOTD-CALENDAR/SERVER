const upload = require('./Multer');

exports.getImageUrl = async function (req, res)
{   
    try{
        this.one = function(){
            upload.single('image').then(
                res => two(req, res)
            );
            console.log('after upload');
            //two(req, res);
        }   
        function two(req, res){
            const Img = req.file;
            console.log('uploaded image : ', Img);
            
            return res.send(Img.location);        
        }       
    }
    catch(err){
        logger.error(`App - uploadMulter.getImageUrl error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
               
};

//return response(baseResponse.SUCCESS_IMAGE_URL, {'ImgUrl' : Img.location});


// @ ootdRoute
//const upload = require('../../../config/Multer');

// app.post('/app/ootd/s3test', upload.single('image'), function(req, res)
    // {   
    //     const Img = req.file;
    //     console.log('uploaded iamge : ', Img.location);
    //     res.send(Img.location);                    
    // });

