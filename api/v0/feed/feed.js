var express = require('express');
var router = express.Router();
var xmlTojson = require('../../../util/xmlReader');
var mongo = require('../../../mongoDb/mongo');
var util = require('../../../util/util');
var feed = require('../schema/feed');
var news = require('../schema/news');
var metaget = require("metaget");




// get feed data
router.get('/', function (req, res, next) {
    mongo.search('feedData', null, null, null, req.query.skip, req.query.limit, {"isoDate" : parseInt(req.query.sort)},  function (err,data) {
        if(!err){
            res.send(data);
        }
        else{
            res.send(err);
        }
    })
})
// router.get('/', function (req, res, next) {
//     xmlTojson.getFeed(req.query.url,function(err, data){
//       setXmlData(data.items);
//       mongo.find('feedData',"", function (err, data) {
//           res.send(data);
//       })
//     });
// })
//
// function setXmlData(item){
//     item.forEach(function (obj) {
//         mongo.find('feedData', {"link":obj.link }, function (err, data) {
//            if(data.length<1){
//                var newFeed = new Object();
//                getMetaData(obj.link ,function (callbackObj) {
//                    newFeed['isPublished'] = false;
//                    newFeed['DataUrl'] = callbackObj["ia:markup_url"];
//                    newFeed['SourceName'] = callbackObj["og:site_name"];
//                    const setData = Object.assign({},newFeed, obj);
//                    console.log(newFeed,"newFeed");
//                    mongo.insertOne('feedData',setData,function (err, data) {
//                    })
//                })
//
//            }
//         })
//     })
// }

// add feedSource url
router.post('/addFeedList',function(req,res,next){
    var valid =util.validateModel(feed.feed,req.body);
    if(valid.length>0){
        res.send(valid);
    }else {
        mongo.insertOne('feedSource',util.setData(req.body,'create',null), function(err,data){
            if(!err){
                res.send(data);
            }
            else{
                res.send(err);
            }
        })
    }
})

router.put('/updateFeedList/:id',function(req,res,next){
    var valid =util.validateModel(feed.feed,req.body);
    if(valid.length>0){
        res.send(valid);
    }else {
        mongo.updateOne('feedSource',{"_id":req.params.id},util.setData(req.body,'update',null), function(err,data){
            if(!err){
                res.send(data);
            }
            else{
                res.send(err);
            }
        })
    }
    //res.send(valid);
})

router.delete('/addFeedList/:id',function(req,res,next){
    var valid =util.validateModel(feed.feed,req.body);
    if(valid.length>0){
        res.send(valid);
    }else {
        mongo.findAndDelete('feedSource',{"id":req.params.id}, function(err,data){
            if(!err){
                res.send(data);
            }
            else{
                res.send(err);
            }
        })
    }
    //res.send(valid);
})

router.get('/getFeedList', function (req, res, next) {
    mongo.search('feedSource', null, null, null, req.query.skip, req.query.limit, {"createdOn" : parseInt(req.query.sort)},  function (err,data) {
        if(!err){
            res.send(data);
        }
        else{
            res.send(err);
        }
    })
})

















router.get('/getFeedDescription', function(req,res,next) {
    getMetaData(req.query.url, function (metaData) {
        getNewsData(metaData["ia:markup_url"],metaData,function (data) {
            saveNewsData(data,function (newesData) {
                res.send(newesData);
            });
        })
    })
});

function getMetaData(url, callback) {
    metaget.fetch(url, function (err, meta_response) {
        if(err){
            console.log(err);
        }else{
            callback(meta_response);
        }
    })
}

function getNewsData (url, metaData, callback) {
    const newsObj = new Object();
    newsObj['title'] = metaData["og:title"];
    newsObj['description'] = metaData["og:description"];
    newsObj['image']=[metaData["og:image"]]
    newsObj['url']= metaData["og:url"];
    newsObj['publishedTime']= metaData["article:published_time"];
    newsObj['isPublished']= false;
    newsObj['newsData']= "";
    newsObj['DataUrl']= metaData["ia:markup_url"];
    newsObj['SourceName']=metaData["og:site_name"];
    callback(newsObj);
}

function saveNewsData(data,callback) {

    var valid =util.validateModel(news.news,data);
    if(valid.length>0){
        callback(valid);
    }else {
        const newsData = data
        mongo.find('newsData',{'url': data.url}, function (err,data) {
            if(data.length<1 && !err) {
                mongo.insertOne('newsData', util.setData(newsData, 'create', null), function (err, data) {
                    if (!err) {
                        callback(data.ops);
                    }
                    else {
                        callback(err);
                    }
                })
            }else if (!err){
                callback(data);
            }else{
                callback(err);
            }
        })
    }
}

function postNewsData(data,callback) {
    var valid =util.validateModel(news.news,data);
    if(valid.length>0){
        callback(valid);
    }else {
        const updtaeData = data;
       // mongo.updateOne('newsData',{"url":data.url},data, function(err,data){
        mongo.updateOne('newsData', {"url":data.url}, updtaeData, function(err, data){
            if(!err){
                mongo.updateOne('feedData', {"feedData.link":updtaeData.url},{"feedData.$.isPublished" :true}, function(err,data){
                    if(!err){
                        callback(data);
                    }
                    else{
                        callback(err);
                    }
                })
            }
            else{
                callback(err);
            }
        })
    }
}

router.post('/postNews',function (req,res,next) {
    postNewsData(req.body, function (data) {
        res.send(data)
    })
});

router.get('/getFeedsByUrl', function(req,res,next) {
  mongo.find('feedData',"" , function (err, data) {
    console.log(data, "data 457");
    res.send(data);
   })
});



module.exports = router;