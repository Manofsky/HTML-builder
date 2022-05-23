const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) throw err;
  fs.readdir(path.join(__dirname, 'project-dist'), (err, files) => {
    if (err) throw err;
    if (files.length > 1) {
      fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), (err) => { if (err) throw err })
    }
  })
  for (let file of files) {
    fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
      if (err) throw err;
      if (stats.isFile() === true && path.extname(`${file}`) === '.css') {
        fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8')
          .on('data', (chunk) => {
            fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), chunk, (err) => {
              if (err) throw err;
              console.log('Данные добавлены!');
            });
          });
      }
    });
  }
})