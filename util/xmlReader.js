const Parser = require('rss-parser');
const parser = new Parser();

function getXML(url, callback) {
    parser.parseURL(url, function(err, feed) {
        callback(feed)
    })
}

module.exports = {getXML};