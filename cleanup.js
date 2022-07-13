let list = [];

var fs = require('fs');
var readline = require('readline');

readline
  .createInterface({
    input: fs.createReadStream('./with_headers.log'),
    terminal: false,
  })
  .on('line', function (line) {
    line = String(line).replaceAll('\\x22', '"').replaceAll('\\x5C', '\\').replace(`,"CF-Visitor":"{\\"scheme\\":\\"https\\"}"`, '');
    console.log(line);
    line = line.split('\t');
    line = JSON.parse(line[4]);
    try {
      list.push(line);
    } catch {
      console.log(line);
    }
  })
  .on('close', function (cb) {
    fs.writeFileSync('./sample.json', JSON.stringify(list, null, 2));
  });
