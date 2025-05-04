const url = require('url');
const controllers = require('./controllers');

module.exports = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && pathname === '/messages') {
    controllers.getMessages(res);
  } else if (method === 'POST' && pathname === '/message') {
    controllers.createMessage(req, res);
  } else if (method === 'PUT' && pathname.startsWith('/message/')) {
    const id = pathname.split('/')[2];
    controllers.updateMessage(req, res, id);
  } else if (method === 'DELETE' && pathname.startsWith('/message/')) {
    const id = pathname.split('/')[2];
    controllers.deleteMessage(res, id);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
};
