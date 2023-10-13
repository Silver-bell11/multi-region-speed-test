const fs = require('fs');
const { exec } = require('child_process')

const downloadFile = (url, fileName, region, resultsArr) => {
  return new Promise((resolve, reject) => {
    const start = new Date()
    const downloadDate = start.toISOString();
    exec(`wget -O ${fileName}  ${url}`, (error) => {
      if (error) {
        reject(error);
      } else {     
        const end = new Date()
        const ElapsedTime = end - start
        resultsArr.push([ region, ':',ElapsedTime,'---',downloadDate])
            resolve()
      }
    });
  });
};

const deleteFile = async(fileName) => {
  try{
    exec(`rm -f ${fileName}`)
  } catch(err) {
    throw new Error(err)
  }

}

const writeCsv = (data, filename) => {
  const csv = data.map((entry) => entry.join(',')).join('\n')

  if (fs.existsSync(filename)) {
    fs.appendFileSync(filename, '\n'+csv)
  } else {
    fs.writeFileSync(filename, csv);
  }
};

const objectNames = [
  ["london___", "https://chektdev-event-storage-london.s3.eu-west-2.amazonaws.com/231012.jpg"],
  ["paris____", "https://chektdev-event-storage-paris.s3.eu-west-3.amazonaws.com/231012.jpg"],
  ["frankfurt", "https://event-record-frankfurt-test.s3.eu-central-1.amazonaws.com/231012.jpg"],
  ["osaka____", "https://event-record-osaka-test.s3.ap-northeast-3.amazonaws.com/231012.jpg"],
  ["tokyo____", "https://event-record-tokyo-test.s3.ap-northeast-1.amazonaws.com/231012.jpg"],
  ["virginia_", "https://chektdev-event-storage-virginia.s3.amazonaws.com/231012.jpg"]
]

const downloadAndRecord = async () => {
  try {  
    const results = [];
    // Record start and end times
    await Promise.all(
      objectNames.map(async ([region, url]) => {
        const index = url.indexOf('/23', 1);
        const fileName = region + url.substring(index + 1)
        await downloadFile(url, fileName,region, results);
        await deleteFile(fileName)
      })
    );

      if (firstRun) {
        writeCsv([['fileInfo', 'Spending Time', ':::','Start Time', 'End Time']], 'records.csv');
        firstRun = false;
      }
      writeCsv([['----'],...results], 'records.csv');
      
  } catch (error) {
      console.error('Error:', error);
    }
}

let firstRun = true;

downloadAndRecord();
    
// Run the downloadAndRecord function every 1 hours
setInterval(downloadAndRecord, 60 * 60 * 1000);
