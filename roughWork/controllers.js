const uuid = require('../helper/idGenerator.js');
const readJson = require('../helper/readJsonFile.js');
const writeJson = require('../helper/writeJsonFile.js');

const dataFilePath = './chatbotData.json';

exports.getMessages = (res) => {
  const data = readJson.readJsonFileData(dataFilePath);
  res.statusCode = 200;
  res.end(JSON.stringify(data));
};

exports.createMessage = (req, res) => {
  let body = '';
  req.on('data', chunk => (body += chunk));

  req.on('end', () => {
    try {
      const newMessage = JSON.parse(body);
      if (!newMessage.message || !newMessage.sender) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Both "message" and "sender" fields are required' }));
      }
      newMessage.id = uuid.uuid4(); // Assign a unique ID
      const data = readJson.readJsonFileData(dataFilePath);
      data.push(newMessage);
      writeJson.writeJsonFileData(dataFilePath,data);
      res.statusCode = 201;
      res.end(JSON.stringify(newMessage));
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON format' }));
    }
  });
};

exports.updateMessage = (req, res, id) => {
  let body = '';
  req.on('data', chunk => (body += chunk));

  req.on('end', () => {
    try {
      const updatedMessage = JSON.parse(body);
      const data = readJson.readJsonFileData(dataFilePath);
      const index = data.findIndex(msg => msg.id === id);

      if (index === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Message not found' }));
      }

      data[index] = { ...data[index], ...updatedMessage };
      writeJson.writeJsonFileData(dataFilePath,data);
      res.statusCode = 200;
      res.end(JSON.stringify(data[index]));
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON format' }));
    }
  });
};

exports.deleteMessage = (res, id) => {
  const data = readJson.readJsonFileData(dataFilePath);
  const index = data.findIndex(msg => msg.id === id);

  if (index === -1) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'Message not found' }));
  }

  const deletedMessage = data.splice(index, 1);
  writeJson.writeJsonFileData(dataFilePath,data);
  res.statusCode = 200;
  res.end(JSON.stringify(deletedMessage));
};
