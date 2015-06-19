var connect = require('connect'),
    serveStatic = require('serve-static');

var app = connect();
app.use(serveStatic(".."));

module.exports = function(port) {
  app.listen(port);
};
