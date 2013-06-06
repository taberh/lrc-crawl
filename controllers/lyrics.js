
var baidu = require('./baidu');

exports.search = function(req, res, next) {
    baidu.query(req.query.song, req.query.singer, function(err, lyric) {
        if (err) {
            console.log(err && err.message || 'error.');
            res.end();
            return;
        }

        console.log(lyric);
        res.end(lyric);
    });
};


