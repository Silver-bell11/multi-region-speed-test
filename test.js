const fs = require('fs');
const { exec } = require('child_process');
const AWS = require('aws-sdk');


const generatePresignedUrl = (objectName, expiration) => {
  let bucketName;
  let s3;

  if(objectName.includes('40199105')) {
    bucketName = 'chektdev-service-event-record'
    s3 = new AWS.S3({region : 'ap-northeast-2'})
  } else if (objectName.includes('40286252')) {
    bucketName = 'chektdev-event-storage-paris'
    s3 = new AWS.S3({region : 'eu-west-3'})
  } else {
    bucketName = 'chektdev-event-storage-virginia'
    s3 = new AWS.S3({region : 'us-east-1'})
  }


  const params = {
    Bucket: bucketName,
    Key: objectName,
    Expires: expiration,
  };
  return s3.getSignedUrl('getObject', params);
};

const downloadFile = (url, fileName) => {
  return new Promise((resolve, reject) => {
    exec(`wget -O "${fileName}" "${url}"`, (error) => {
      if (error) {
        reject(error);
      } else {
        exec(`rm -f ${fileName}`, (deleteError)=>{
          if (deleteError) {
            reject(deleteError)
          } else {
            resolve()
          }
        })
        resolve();
      }
    });
  });
};

const writeCsv = (data, filename) => {
  const csv = data.map((entry) => entry.join(',')).join('\n')

  if (fs.existsSync(filename)) {
    fs.appendFileSync(filename, '\n'+csv)
  } else {
    fs.writeFileSync(filename, csv);
  }
};

const objectNames = {
  seoul : [
  '174623/26-09-2023/40199105-0.jpg',
  '174623/26-09-2023/40199105-1.jpg',
  '174623/26-09-2023/40199105-2.jpg',
  '174623/26-09-2023/40199105-3.jpg',
  '174623/26-09-2023/40199105-4.jpg',
  '174623/26-09-2023/40199105-5.jpg',
  '174623/26-09-2023/40199105-6.jpg',
  '174623/26-09-2023/40199105-7.jpg',
  '174623/26-09-2023/40199105-8.mp4'],
  paris : [
  '174655/10-10-2023/40286252-0.jpg',
  '174655/10-10-2023/40286252-1.jpg',
  '174655/10-10-2023/40286252-2.jpg',
  '174655/10-10-2023/40286252-3.jpg',
  '174655/10-10-2023/40286252-4.jpg',
  '174655/10-10-2023/40286252-5.jpg',
  '174655/10-10-2023/40286252-6.jpg',
  '174655/10-10-2023/40286252-7.jpg',
  '174655/10-10-2023/40286252-8.mp4'],

  virgi : [
  '174655/27-09-2023/40214984-0.jpg',
  '174655/27-09-2023/40214984-1.jpg',
  '174655/27-09-2023/40214984-2.jpg',
  '174655/27-09-2023/40214984-3.jpg',
  '174655/27-09-2023/40214984-4.jpg',
  '174655/27-09-2023/40214984-5.jpg',
  '174655/27-09-2023/40214984-6.jpg',
  '174655/27-09-2023/40214984-7.jpg',
  '174655/27-09-2023/40214984-8.mp4']
}





const downloadAndRecord = async () => {
  try {  
    const results = [];
    // Record start and end times
    await Promise.all(
      Object.entries(objectNames).map(async ([region, names]) => {
        const start = new Date()
          names.map(async (objectName) => {
          const url = generatePresignedUrl(objectName, 24 * 60 * 60, region);
          const index = objectName.indexOf('/40', 1);
          const fileName = objectName.substring(index + 1);
          await downloadFile(url, fileName);
        })
        const end = new Date()
        const fileInfo = region
        const ElapsedTime = end - start 
        results.push([ fileInfo ,start, end, ElapsedTime]);
      })
    );

      if (firstRun) {
        writeCsv([['fileInfo', 'Start Time', 'End Time', 'Spending Time']], 'records.csv');
        firstRun = false;
      }
      writeCsv([['----'],...results], 'records.csv');
      
  } catch (error) {
      console.error('Error:', error);
    }
}

let firstRun = true;

downloadAndRecord();
    
// Run the downloadAndRecord function every 3 hours
setInterval(downloadAndRecord, 1 * 60 * 1000);
