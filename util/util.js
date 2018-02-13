function response(data,err, callback) {
    var resObj = new Object();
    if(err){
        resObj['success'] = false;
        resObj['error'] = err.message;
    } else{
        resObj['success'] = true;
        resObj['data'] = data;
    }
    callback(resObj);
}

module.exports = {response};