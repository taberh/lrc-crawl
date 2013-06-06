
var http = require('http');
var url = require('url');

exports.query = function(song, singer, callback) {

    var host = 'http://music.baidu.com';
    var search = host + '/search?key='+song+'+'+singer;

    crawl(search, searchCallback);

    function searchCallback(err, html) {
        if (err) {
            return callback(err);
        }

        var songs = parseSearch(html);

        if (!songs) {
            return callback({message: 'not found song'});
        }

        var song = host + '/song/' + songs[0];

        crawl(song, songCallback); 
    }

    function songCallback(err, html) {
        if (err) {
            return callback(err);
        }

        var lyric = parseSong(html);
        
        if (!lyric) {
            return callback({message: 'not found lyric url'});
        }
        
        lyric = host + lyric;

        crawl(lyric, lyricCallback);
    }

    function lyricCallback(err, lyric) {
        if (err) {
            return callback(err);
        }

        if (!lyric) {
            return callback({message: 'not found lyric'});
        }

        callback(null, lyric);
    }
};

/**
 * 抓取uri html
 * @param uri {String}
 * @param callback {Function}
 */
function crawl(uri, callback) {
    var uri = url.parse(uri, true, true);
    var options = {
            host: uri.host,
            path: uri.path,
            port: 80
        };

    http.get(options, function(res) {

        var data = '';

        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function() {
            callback(null, data);
        });

    }).on('error', function(err) {
        callback(err);
    });
}

/**
 * 解析搜索结果页
 * @param html {String} 页面html
 * @return {Array} 歌曲id
 */
function parseSearch(html) {
    var songs = html.match(/sid&quot;\:(\d)*\,/gm);

    if (!songs) {
        return null;
    }

    for (var i = 0, l = songs.length; i < l; i++) { 
        songs[i] = songs[i].match(/(\d)+/gi)[0]; 
    }

    return songs;
}

/* 解析歌曲详细页
 * @param html {String} 页面html
 * @return {String} 歌词url
 */
function parseSong(html) {
    var lyric = html.match(/\/(.*)\.lrc/g);

    if (!lyric) {
        return null;
    }

    return lyric[0];
}
