angular.module('CryptoCrunch.mainController', [])
	.controller('MainController', function($scope, main) {

	$scope.tagline = 'To the moon and back!';
	$scope.isFeedUrl = false;
	$scope.isFeedDetails = false;

	$scope.getUrl = function () {
        main.getFeeds().then(function (feeds) {
            $scope.isFeedUrl = true;
            $scope.isFeedDetails = false;
            $scope.feedData = feeds.data
            if(feeds.data.length>0){
                $scope.feedsUrl = [];
                for(i=0; i< feeds.data.length; i++){
                    $scope.feedsUrl.push(feeds.data[i].url)
                }
            }
        })
    }
        $scope.getUrl();
    $scope.getFeed= function(value) {
    	main.getFeedsByUrl(value).then( function (feedData) {
    		$scope.isFeedUrl=false;
    		$scope.isFeedDetails= true;
			$scope.feedNews = feedData.data;
		})
		}
		$scope.getNewsData=function (value) {
            main.getNewsData(value.link).then( function (feedNews) {
              $scope.news = feedNews.data[0];

            })
    }
        $scope.postNewsData=function (feedSource) {
            main.postNewsData(feedSource).then( function (feedSource) {
                $scope.getUrl();
            })
        }
        $scope.putNewsData=function (feedSource,id) {
        debugger;
            main.putNewsData(feedSource,id).then( function (feedSource) {
                $scope.getUrl();
            })
        }

        $scope.addImage=function (feedImage) {
        console.log(feedImage);
            feedImage.push('');
        }
        $scope.editFeedSource = function (value) {
        $scope.isEditFeedSource =true;
            for(i=0; i< $scope.feedData.length; i++){
                if($scope.feedData[i].url === value){
                    $scope.editableFeed = $scope.feedData[i];
                }

            }

        }
        $scope.cancel = function(value){
            $scope.isEditFeedSource =false;

        }
});