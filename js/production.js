var connect = require('connect');
connect.createServer(
    connect.static('..')
).listen(10000);
