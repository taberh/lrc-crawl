
var express = require('express'),
    http = require('http'),
    routes = require('./routes');

var app = express(), server;

app.configure(function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.set('port', process.env.PORT || 5001);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

routes(app);

server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
