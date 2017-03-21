var problemset = require('./built/index.js');

var source = new problemset.RandStringSource(new problemset.RandStream());
source.on('data', (data) => {
  console.log(data);
});