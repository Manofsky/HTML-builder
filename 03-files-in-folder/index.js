const path = require('path');
const fs = require('fs');

fs.promises.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then(filenames => {
    for (let filename of filenames) {
      fs.stat(path.join(__dirname, 'secret-folder', `${filename.name}`), (err, stats) => {
        if (err) throw err;
        if (filename.isFile() === true && stats.isFile() === true) {
          console.log(`${path.parse(`${filename.name}`).name} - ${path.extname(`${filename.name}`).substring(1)} - ${stats.size}bytes`);
        }
      });
    }
  })
  .catch(err => {
    console.log(err)
  })