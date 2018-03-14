const Parser = require('rss-parser');
const parser = new Parser();

function getFeed(url, callback) {
    parser.parseURL(url, function(err, feed) {
        callback(err,feed)
    })
}



module.exports = {getFeed};
