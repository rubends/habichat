var app = angular.module('habichat', ['ngRoute', 'ngCookies', 'ngMaterial', 'mdColorPicker', 'mdPickers', 'gridstack-angular', 'ui.calendar', 'pascalprecht.translate']);

(function() {

    app.config(function($routeProvider, $locationProvider, $mdThemingProvider, $translateProvider) {
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
		.when("/profile", {
			templateUrl : "templates/profile.html",
			controller : "profileCtrl",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
		})
		.when("/passwordreset/:resetKey", {
			templateUrl : "templates/reset.html",
			controller : "resetCtrl"
		})
		.otherwise({
	        templateUrl : "templates/home.html",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
	    });

		$mdThemingProvider.theme('default')
    		.primaryPalette('teal')
			.accentPalette('grey')
			.warnPalette('red')
			.backgroundPalette('grey', {'default': '50'});

		$translateProvider.useStaticFilesLoader({   
			prefix: '/translations/',             
			suffix: '.json'                           
		});                                         
		$translateProvider.preferredLanguage(localStorage.language ? localStorage.language : 'en');

	});

    app.controller("mainCtrl", ['$rootScope', '$route', '$translate' , function($rootScope, $route, $translate){
 		$rootScope.apiPath = "../backend/web/api";

		 var supportedLangs = ['nl', 'en', 'fr'];
		if(! localStorage.language) localStorage.language = 'en';
		$rootScope.setLanguage = function(lang) {
			if(supportedLangs.indexOf(lang) > -1) {
				localStorage.language = lang;
				$rootScope.language = lang;
				$translate.use(lang);
				$route.reload();
			}
		}
		 
		$(document).on("click", ".navbar a", function() {
			$(".nav").find(".activePage").removeClass("activePage");
			$(this).addClass("activePage");
		});
    }]);

})();