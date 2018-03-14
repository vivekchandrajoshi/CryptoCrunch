angular.module('CryptoCrunch.SignupController', [])
	.controller('SignupController', function($scope, $http, $location, $rootScope) {
        $scope.signup = function(user) {
            if(user.password != user.confirmpwd || !user.password || !user.confirmpwd)
            {
                $rootScope.message = "passwords didn't match";
            }
            else if(user.userName == "" || user.userName == undefined)
            {
                $scope.message = "Please enter userName";
            }
            else if(user.email == "" || user.email == undefined)
            {
                $scope.message = "Please enter Email";
            }
            else
            {
                $http.post("auth/auth/register", user)
                .success(function(response){
                    console.log("res",response);
                    // if(response.status == 'error')
                    // {
                    //     $scope.message = "Username Already Exist";
                    // }
                    // else
                    // {
                    //     $rootScope.currentUser = response;
                    //     $location.url("/");
                    //     $scope.message = "User Registered Successfully";
                    // }
                    });
            }
        }
    });