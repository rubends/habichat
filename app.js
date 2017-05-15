var app = angular.module('habichat', ['ngRoute', 'ngCookies']);

(function() {
    
    app.config(function($routeProvider, $locationProvider) {
    	$locationProvider.hashPrefix('');
    	$routeProvider
		.when("/login", {
			templateUrl : "templates/login.html",
			controller : "loginCtrl"
		})
		.when("/register", {
			templateUrl : "templates/register.html",
			controller : "registerCtrl"
		})
		.when("/dashboard", {
			templateUrl : "templates/dashboard.html",
			controller : "dashboardCtrl",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
		})
		.when("/settings", {
			templateUrl : "templates/settings.html",
			controller : "settingsCtrl"
		})
		.when("/flat", {
			templateUrl : "templates/flat.html",
			controller : "flatCtrl"
		})
		.when("/logout", {
			templateUrl : "templates/home.html",
			controller : "logoutCtrl"
		})
		.otherwise({
	        templateUrl : "templates/home.html"
	    });
	});

    app.controller("mainCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location','getUserService', 'getFlatService', function($rootScope, $scope, $http, $cookies, $location, getUserService, getFlatService){
 		getUserService.getUser();
		//  getFlatService.getFlat();
    }]);

})();