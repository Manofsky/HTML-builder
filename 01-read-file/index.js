const fs = require('fs');
const path = require('path');
const stdout = process.stdout;


const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

readableStream.on('data', chunk => stdout.write(chunk));