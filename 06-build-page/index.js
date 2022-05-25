const fs = require('fs');
const path = require('path');
let template;
let prom = fs.promises.readFile(path.join(__dirname, 'template.html'));
let promDir = fs.promises.readdir(path.join(__dirname, 'components'));

fs.mkdir(path.join(__dirname, 'project-dist'), () => {
  fs.promises.readdir(path.join(__dirname, 'project-dist'), { withFileTypes: true })
    .then((result) => {
      for (let file of result) {
        if (file.isFile()) {
          fs.unlink(path.join(__dirname, 'project-dist', file.name), (err) => { if (err) throw err })
        }
      }
    })
  prom.then((result, err) => {
    if (err) throw err;
    template = result.toString();
    promDir.then((result, err) => {
      if (err) throw err;
      let length = result.length;
      let step = 0;
      for (let file of result) {
        let tag = path.parse(file).name;
        fs.promises.readFile(path.join(__dirname, 'components', file))
          .then((result, err) => {
            if (err) throw err;
            step = step + 1;
            template = template.replace(`{{${tag}}}`, result.toString());
            if (step === length) {
              fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, () => { });
            };
          })
      }
    });
  })
  fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
    if (err) throw err;
    for (let file of files) {
      fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
        if (err) throw err;
        if (stats.isFile() === true && path.extname(`${file}`) === '.css') {
          fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8')
            .on('data', (chunk) => {
              fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), chunk, (err) => {
                if (err) throw err;
                console.log('Данные добавлены!');
              });
            });
        }
      });
    }
  })
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), () => {
    fs.promises.readdir(path.join(__dirname, 'assets'))
      .then((result) => {
        for (let dir of result) {
          fs.mkdir(path.join(__dirname, 'project-dist', 'assets', `${dir}`), () => {
            fs.readdir(path.join(__dirname, 'project-dist', 'assets', `${dir}`), (err, result) => {
              if (err) throw err;
              for (let dir3 of result) {
                fs.unlink(path.join(__dirname, 'project-dist', 'assets', `${dir}`, `${dir3}`), (err) => { if (err) throw err })
              };
            })
            fs.promises.readdir(path.join(__dirname, 'assets', `${dir}`))
              .then((result) => {
                for (let dir2 of result) {
                  fs.copyFile(
                    path.join(__dirname, 'assets', `${dir}`, `${dir2}`),
                    path.join(__dirname, 'project-dist', 'assets', `${dir}`, `${dir2}`),
                    () => { });
                }
              })
          });
        }
      });
  });
});