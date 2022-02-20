const fs = require('fs');
const yaml = require('js-yaml');
try {
  let fileContents = fs.readFileSync('./app_conf.yml', 'utf8');
  const data = yaml.load(fileContents);

  var sql = data['mysql'];
  var mgb = data['mongodb'];
} catch (e) {
  console.log(e);
}

console.log(`mongodb://${mgb['user']}:${mgb['password']}@${mgb['hostname']}:${mgb['port']}/`)