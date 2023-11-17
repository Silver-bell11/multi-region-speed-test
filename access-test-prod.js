const aws = require('aws-sdk');
const fs = require('fs')
//const path = require('path')

const contentType = 'video/mp4'
const body = fs.readFileSync('../../Downloads/test.mp4')


const putObject = (bucketName, region) => {

  const key = `${bucketName}.mp`

  let params = {
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    Body: body
  };

  
  const s3 = new aws.S3({ region });
  

  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(data, " upload 성공!")
        resolve(data);
      }
    });
  });
};

const getSignedUrl = async (bucketName, region) => {
  
  const key = `${bucketName}.mp`

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 3600
  };

  const s3obj = new aws.S3({ region });

  return new Promise((resolve, reject) => {
    s3obj.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        console.log(url, 'getSignedUrl 성공!')
        resolve(url);
      }
    });
  });
};

const getObject = (bucketName, region) => {
  const key = `${bucketName}.mp`
  return new Promise((resolve, reject) => {
    const ss3 = new aws.S3({ region });
    const params = {
      Bucket: bucketName,
      Key: key
    };
    ss3.getObject(params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log(results, 'getObject 성공!')
        resolve(results);
      }
    });
  });
};

const headObject = (bucketName, region) => {
  const key = `${bucketName}.mp`
  const params = {
    Bucket: bucketName,
    Key: key
  };

  
  const s3 = new aws.S3({ region });
  

  return new Promise((resolve, reject) => {
    s3.headObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(data, 'haedObject성공')
        resolve(data);
      }
    });
  });
};

const argumentList = {
  'us-east-1' : 'chekt-dev',
  'us-east-1': 'chekt-event-storage-virginia',
  'ap-northeast-2' : 'chekt-event-storage-seoul',
  'eu-west-3' : 'chekt-event-storage-paris',
  'ap-northeast-3': 'chekt-event-storage-osaka',
  'eu-west-2' : 'chekt-event-storage-london',
  'eu-central-1' : 'chekt-event-storage-frankfurt',
  'af-south-1' : 'chekt-event-storage-cape-town',
  'ca-central-1': 'chekt-event-storage-canada'
}

const start = async() => {
  for (const pr in argumentList ) {
    await putObject(argumentList[pr],pr)
    await getSignedUrl(argumentList[pr],pr)
    await getObject(argumentList[pr],pr)
    await headObject(argumentList[pr],pr)
  }
  console.log('모두 완료')
  return 1
  
}

start()