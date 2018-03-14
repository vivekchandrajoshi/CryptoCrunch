var express = require('express');
var router = express.Router();
var xmlTojson = require('../../../util/xmlReader');
var mongo = require('../../../mongoDb/mongo');
var util = require('../../../util/util');
var feed = require('../schema/feed');
var news = require('../schema/news');
var metaget = require("metaget");
var https = require('https');


router.get('/', function (req, res, next) {
    xmlTojson.getFeed(req.query.url,function(err, data){
        getFeedData(data,req.query.url,function (data) {
            prepareFeedData(data,req.query.url,function (data) {
                 setFeedData('feedData',req.query.url,data,function (err,responseData) {
                     res.send(responseData)
                })
            })
       })
    });
})

function getFeedData (feed, url, callback) {
    const incomeingJSON = feed.items;
    mongo.find('feedData',{'feedUrl':url}, function (err, data) {
        removeDuplicateFeed(incomeingJSON,data,url,function (data) {
            callback(data)
        });

    })
}

function removeDuplicateFeed(incomeingJSON,databaseJSON,url, callback) {
    const newFeed = [];
    //console.log("incomeingJSON",incomeingJSON );
    const newUrl = url.split("/feed");
        for (var i = 0; i < incomeingJSON.length; i++) {
            if (databaseJSON.length ){
                if(databaseJSON[0].feedData.length>0){
                for (var j = 0; j < databaseJSON[0].feedData.length; j++) {
                    if (databaseJSON[0].feedData[j].link !== incomeingJSON[i]['link']) {
                        newFeed.push(incomeingJSON[i]);
                    }
                }
                }else{
                    incomeingJSON[i]['isPublished'] = false;
                    incomeingJSON[i]['url'] = newUrl[0];
                    console.log(incomeingJSON[i], "incomeingJSON[i]");
                    newFeed.push(incomeingJSON[i]);
                }
            }
            if(newFeed[i]) {
                newFeed[i]['isPublished'] = false;
                newFeed[i]['url'] = newUrl[0];
            }

        }
    console.log('newFeed',newFeed);
        callback(newFeed)
}

function prepareFeedData(feeddata,url, callback){
    const feedObj = new Object();
    feedObj['feedUrl']=url;
    feedObj['feedData'] = feeddata;
    feedObj['fatchedOn']= new Date();
    callback(feedObj);
}

function setFeedData(collectionName,url,feedData, callback){

   mongo.find('feedData',{'feedUrl':url}, function (err, data) {
       if(!data.length>0){
       mongo.insertOne(collectionName,feedData,function (err,data) {
         callback(err,data);
     })
       }else if (feedData.feedData.length>0){
           const dbData = data[0].feedData;
           const feedDataNew=dbData.concat(feedData.feedData);
           console.log(feedData.feedData.length,"feedDataNew")
     mongo.updateOne(collectionName,{'feedUrl':url},{'feedData': feedDataNew}, function (err,data) {
        console.log(data, "data");
         callback(err,data);
     })
       } else{
           callback(null,{messae:"no update found !"});
       }
   })

}

router.post('/addFeedList',function(req,res,next){
    console.log("test data", req.body);
    var valid =util.validateModel(feed.feed,req.body);
    if(valid.length>0){
        res.send(valid);
    }else {
        console.log("test data", util.setData(req.body,'create',null));
        mongo.insertOne('feedSource',util.setData(req.body,'create',null), function(err,data){
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


router.put('/updateFeedList/:id',function(req,res,next){
    console.log(req.body,"req.body");
    var valid =util.validateModel(feed.feed,req.body);
    if(valid.length>0){
        res.send(valid);
    }else {
        console.log("test data", util.setData(req.body,'update',null));
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
        console.log("test data", util.setData(req.body,'create',null));
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
router.get('/getFeedList',function(req,res,next){
    console.log({'feedName':{$regex: '/'+ req.query.name +'/'}},"sa");
    mongo.find('feedSource',{},function (err,data) {
        if(!err){
            res.send(data);
        }
        else{
            res.send(err);
        }
    })
    //res.send(valid);
})

router.get('/getFeedDescription', function(req,res,next) {
    metaget.fetch(req.query.url, function (err, meta_response) {
        if(err){
            console.log(err);
        }else{
            getNewsData(meta_response["ia:markup_url"],meta_response,function (data) {
                saveNewsData(data,function (newesData) {
                  res.send(newesData);
                });
            })

        }
    });
});

function getNewsData (url, metaData, callback) {
    https.get(url, function (res) {
        var data="";
        res.on('data', function (d) {
            data = data+d;
        });
        setTimeout(function () {
            const newsObj = new Object();
            newsObj['title'] = metaData["og:title"];
            newsObj['description'] = metaData["og:description"];
            newsObj['image']=[metaData["og:image"]]
            newsObj['url']= metaData["og:url"];
            newsObj['publishedTime']= metaData["article:published_time"];
            newsObj['isPublished']= false;
            newsObj['newsData']= data.toString('utf8')
            callback(newsObj)
        },1000)
    })
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
    console.log(req.query.url,"req.query.url");
   mongo.find('feedData',{'feedUrl':req.query.url},function (err, data) {
       res.send(data);
   })
});

module.exports = router;