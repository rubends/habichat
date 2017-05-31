var app = angular.module('habichat', ['ngRoute', 'ngCookies', 'ngMaterial', 'mdColorPicker', 'mdPickers', 'gridstack-angular']);

(function() {

    app.config(function($routeProvider, $locationProvider, $mdThemingProvider) {
    	$locationProvider.hashPrefix('');
    	$routeProvider
		.when("/", {
			templateUrl : "templates/home.html"
		})
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
			controller : "settingsCtrl",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
		})
		.when("/flat", {
			templateUrl : "templates/flat.html",
			controller : "flatCtrl",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
		})
		.when("/logout", {
			templateUrl : "templates/home.html",
			controller : "logoutCtrl",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
		})
		.when("/invite/:key", {
			templateUrl : "templates/invite.html",
			controller : "inviteCtrl",
			resolve: {
                inviteService: ['getInviteService', '$route', function(getInviteService, $route){
                    return getInviteService.getInvite($route.current.params.key);
                }]
            }
		})
		.otherwise({
	        templateUrl : "templates/home.html"
	    });

		$mdThemingProvider.theme('default')
    		.primaryPalette('teal')
			.accentPalette('deep-orange')
			.warnPalette('red')
			.backgroundPalette('grey', {'default': '50'});

	});

    app.controller("mainCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
 		$rootScope.apiPath = "../backend/web/api";
		 
		$(document).on("click", ".navbar a", function() {
			$(".nav").find(".activePage").removeClass("activePage");
			$(this).addClass("activePage");
		});
    }]);

})();