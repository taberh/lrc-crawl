
var lyrics = require('./controllers/lyrics');

module.exports = function(app) {
    app.get('/lyrics/search', lyrics.search);
};
