const fs = require('fs');
const path = require('path');
const scripts = require('./scripts');
const { doSign } = require('./handler/jwt-handler');

let objects = Object.keys(scripts).map((key) => {
  console.log({ repo_name: key });
  return {
    [key]: doSign({ repo_name: key }),
  };
});

fs.writeFileSync(
  path.join(__dirname, './tokens.json'),
  JSON.stringify(objects, null, 2),
  'utf8',
);
