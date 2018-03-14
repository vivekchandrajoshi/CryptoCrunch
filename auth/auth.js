const config = require('config');
var jwt = require('jsonwebtoken');


function isAuth (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        console.log("token");
        jwt.verify(token, config.get('Auth.jwt.tokenSecret'), function(err, decoded) {
            if (err) {
                console.log("err",err);
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                console.log("decoded", decoded);
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
};

module.exports = {isAuth};