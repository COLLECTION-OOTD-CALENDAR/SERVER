const aws = require('aws-sdk');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { promisify } = require('util')
const randomBytes = promisify(crypto.randomBytes)
dotenv.config();


aws.config.loadFromPath(__dirname + '/awsconfig.json'); 


const s3 = new aws.S3(); 

async function getPreSignUrl() {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex')
  
    const params = ({
      Bucket: bucketName,
      Key: imageName,
      Expires: 60
    })
  
    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
  }
  
  module.exports = {
    getPreSignUrl,
  }