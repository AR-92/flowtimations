const fs = require('fs');

exports.writeJsonFileData = (dataFilePath,data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
