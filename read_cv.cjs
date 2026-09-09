const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('cv_khan.pdf');
pdf(dataBuffer).then(function(data) {
  console.log('=== CV KHAN CONTENT ===');
  console.log(data.text);
  console.log('=======================');
}).catch(err => {
  console.error(err);
});
