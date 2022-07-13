let samples = require('./sample.json');

let stat = {};
let dontCheck = ['CF-RAY', 'X-Forwarded-Proto', 'CF-EW-Via', 'X-Forwarded-For', 'X-Requested-With'];
let headers = [];
let challengeBrowser = [];
samples
  .map((sample) => {
    dontCheck.forEach((check) => delete sample[check]);

    return sample;
  })
  .forEach((sample) => {
    if (sample['CF-Connecting-IP'] == '115.87.151.255') return;
    for (var header of Object.keys(sample)) {
      if (dontCheck.map((dontCheckHeader) => dontCheckHeader.toLowerCase()).includes(header.toLowerCase())) return;
      if (!headers.find((_header) => _header.toLowerCase() === header.toLowerCase())) headers.push(header.toLowerCase());
      if (!stat[header.toLowerCase()]) stat[header.toLowerCase()] = {};
      if (!stat[header.toLowerCase()][sample[header]]) {
        if (header.toLowerCase() == 'cf-connecting-ip') challengeBrowser.push(sample);
        stat[header.toLowerCase()][sample[header]] = 0;
      }
      // if (!stat['cf-connecting-ip'][sample[header]] == 0) console.log(sample);
      stat[header.toLowerCase()][sample[header]]++;
    }
  });

// console.log(headers);
// console.log(stat);

let challengeBrowserStat = {};

challengeBrowser.forEach((challengeSample) => {
  let sampleHeader = Object.keys(challengeSample).map((key) => key.toLowerCase());
  let missingHeader = headers.filter((x) => !sampleHeader.includes(x));
  missingHeader.forEach((header) => {
    if (!challengeBrowserStat[header]) challengeBrowserStat[header] = 0;
    challengeBrowserStat[header]++;
  });
});

console.log(stat);

console.log(challengeBrowserStat);
