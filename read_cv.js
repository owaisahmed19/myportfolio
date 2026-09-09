import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const dataBuffer = fs.readFileSync('cv_khan.pdf');
pdf(dataBuffer).then(function(data) {
  console.log('--- CV TEXT START ---');
  console.log(data.text);
  console.log('--- CV TEXT END ---');
}).catch(console.error);
