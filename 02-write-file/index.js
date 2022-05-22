const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path').join(__dirname, 'text.txt');

fs.open(path, 'w', (err) => {
  if (err) throw err;
  stdout.write('Запись в файл text.txt началась. Введите данные!\n');
});

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  fs.appendFile(path, data, (err) => {
    if (err) throw err;
    console.log('Данные добавлены! Можете продолжить ввод.');
  });
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Ввод данных завершен!'));