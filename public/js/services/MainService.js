angular.module('CryptoCrunch.Service', [])

    .factory('main', ['$q','$http', function($q, $http) {
    return {
        findPopularDeals: function(id, latitude, longitude) {
            return $http({
                url: POPULAR_DEALS,
                method: 'POST',
                data:   'user_id='     +id+
                '&user_lat='   +Number(latitude)+
                '&user_lng='   +Number(longitude),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

        },
        getFeeds: function() {
            var deferred = $q.defer();
            deferred.resolve($http.get('http://localhost:3000/feed/getFeedList?skip=0&limit=30&sort=-1'));
            return deferred.promise;

        },

        getFeedsByUrl:function (url) {
            var deferred = $q.defer();
            deferred.resolve($http.get('http://localhost:3000/feed?skip=0&limit=30&sort=-1'));
            return deferred.promise;
        },

        getNewsData:function (id) {
            var deferred = $q.defer();
            deferred.resolve($http.get('http://localhost:3000/feed/getFeedDescription/' + id))
            return deferred.promise;
        },
        postNewsData:function (data) {
        return $http({
                url: 'http://localhost:3000/feed/addFeedList',
                method: 'POST',
                data: data

            });
        },
        putNewsData:function (data,id) {
            return $http({
                url: 'http://localhost:3000/feed/updateFeedList/'+ id,
                method: 'PUT',
                data: data
            });
        }
        
        
    };

}]);