const upload = require('./Multer');

exports.getImageUrl = async function (req, res)
{   
    this.one = function(){
        upload.single('image');
        two(req, res);
    }   
    function two(req, res){
        const Img = req.file;
        console.log('uploaded image : ', Img.location);
        res.send(Img.location);      
    }                  
};




// @ ootdRoute
//const upload = require('../../../config/Multer');

// app.post('/app/ootd/s3test', upload.single('image'), function(req, res)
    // {   
    //     const Img = req.file;
    //     console.log('uploaded iamge : ', Img.location);
    //     res.send(Img.location);                    
    // });

