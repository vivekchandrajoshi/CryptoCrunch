angular.module('geekService', []).factory('Geek', ['$http', function($http) {

    return {
        findPopularDeals: function(id, latitude, longitude) {
            var promise = $http({
                url: POPULAR_DEALS,
                method: 'POST',
                data:   'user_id='     +id+
                '&user_lat='   +Number(latitude)+
                '&user_lng='   +Number(longitude),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data, status, headers, config) {
                return data;
            });
            return promise;

        },
        getFeeds: function() {
            var deferred = $q.defer();
            deferred.resolve($http.get('http://localhost:3000/feed/'));
            return deferred.promise;

        }
    };

}]);