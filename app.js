var app = angular.module('habichat', ['ngRoute', 'ngCookies', 'ngMaterial', 'mdColorPicker', 'mdPickers', 'gridstack-angular', 'ui.calendar', 'pascalprecht.translate']);

(function() {

    app.config(function($routeProvider, $locationProvider, $mdThemingProvider, $translateProvider, $qProvider) {
    	$locationProvider.hashPrefix('');
    	$routeProvider
		.when("/", {
			templateUrl : "templates/home.html",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
		})
		.when("/login", {
			templateUrl : "templates/login.html",
			controller : "loginCtrl",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
		})
		.when("/register", {
			templateUrl : "templates/register.html",
			controller : "registerCtrl",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
		})
		.when("/dashboard", {
			templateUrl : "templates/dashboard.html",
			controller : "dashboardCtrl",
			resolve: {
                userService: ['$q', 'getUserService', 'getFlatService', function($q, getUserService, getFlatService){
					return $q.all({
						user: getUserService.getUser(),
						flat: getFlatService.getFlat()
					});
                }]
            }
		})
		.when("/settings", {
			templateUrl : "templates/settings.html",
			controller : "settingsCtrl",
			resolve: {
                userService: ['$q', 'getUserService', 'getFlatService', function($q, getUserService, getFlatService){
					return $q.all({
						user: getUserService.getUser(),
						flat: getFlatService.getFlat()
					});
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
		$translateProvider.useSanitizeValueStrategy('escape');

		$qProvider.errorOnUnhandledRejections(false);

	});

    app.controller("mainCtrl", ['$rootScope', '$route', '$translate', '$timeout',  function($rootScope, $route, $translate, $timeout){
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

		$(document).on('click',function(){
			$('.collapse').collapse('hide');
		});

		$rootScope.showNotification = function(text, id) {
			$rootScope.flat.notification = text;
			if(id) {
				$('#'+id+" .widget").addClass("recentlyAdded");
			}
			$audio = new Audio('/audio/pop_drip.wav');
			$audio.play();
			$timeout(function () { $rootScope.flat.notification = null; $(".recentlyAdded").removeClass("recentlyAdded"); }, 4000);   
		}
    }]);

})();