
const fs = require('fs');
const https = require('https');

const url = "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api/v1/province_with_amphure_tambon.json";
const file = fs.createWriteStream("services/thai_province_data.json");

https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close(() => {
        console.log("Download completed. File size: " + fs.statSync("services/thai_province_data.json").size);
    });
  });
}).on('error', function(err) {
  fs.unlink("services/thai_province_data.json");
  console.error("Error downloading: " + err.message);
});
