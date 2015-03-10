var connect = require('connect'),
    serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic(".."));
app.listen(process.argv[2] || 4000);
