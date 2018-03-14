angular.module('CryptoCrunch', ['ngRoute', 'CryptoCrunch.Service','CryptoCrunch.SignupController','CryptoCrunch.signController','CryptoCrunch.mainController','CryptoCrunch.Service'])
.config(function ($routeProvider, $httpProvider) {

    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    }) 
    .when('/signin', {
        templateUrl: 'views/auth/login.html',
        controller: 'SigninController'
    })  
    .when('/signup', {
        templateUrl: 'views/auth/register.html',
        controller: 'SignupController'
    }) 
    .when('/forgotPassword', {
        templateUrl: 'views/auth/forgotPassword.html',
        controller: 'ForgotPasswordController'
    })  
    .otherwise({
        redirectTo: "/"
    });
});