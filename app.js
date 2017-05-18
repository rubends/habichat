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
			controller : "settingsCtrl",
			resolve: {
                userService: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
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

    app.directive('packery', ['$rootScope', '$http', '$timeout', function($rootScope, $http, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            if ($rootScope.packery === undefined || $rootScope.packery === null) {
              scope.element = element;
              $rootScope.packery = new Packery(element[0].parentElement, {
                isResizeBound: true,
                columnWidth: 1,
                itemSelector: '.moveWidget'
              });
              $rootScope.packery.bindResize();
              var draggable1 = new Draggabilly(element[0]);
              $rootScope.packery.bindDraggabillyEvents(draggable1);

              draggable1.on('dragEnd', function(instance, event, pointer) {
                savePlace();
                $timeout(function() {
                  $rootScope.packery.layout();
                }, 200);
              });

              	var orderItems = function() {
					var itemElems = $rootScope.packery.getItemElements();
				};

              $rootScope.packery.on('layoutComplete', orderItems);
              $rootScope.packery.on('dragItemPositioned', orderItems);

            } else {
              var draggable2 = new Draggabilly(element[0]);
              $rootScope.packery.bindDraggabillyEvents(draggable2);

              draggable2.on('dragEnd', function(instance, event, pointer) {
                savePlace();
                $timeout(function() {
                  $rootScope.packery.layout();
                }, 200);
              });

            }

            function savePlace(){
                var itemElems = $rootScope.packery.getItemElements();
                for (var i = 0; i < itemElems.length; i++) {
                    var sUrl = "../backend/web/api/widgets/"+itemElems[i].id+"/places/"+i;
                    var oConfig = {
                        url: sUrl,
                        method: "PUT",
                        params: {callback: "JSON_CALLBACK"},
                        headers: {Authorization: 'Bearer ' + $rootScope.user.token}
                    };
                    $http(oConfig).then(function successCallback(response) {
                        // console.log(response.data);
                    }, function errorCallback(response) {
                         console.log("error");
                    });
                };
            }

            $timeout(function() {
              $rootScope.packery.reloadItems();
              $rootScope.packery.layout();
            }, 100);

            scope.$on('$destroy', function(event) {
				if($rootScope.packery && $rootScope.packery.remove) {
					if(event.targetScope.widget){
						$rootScope.packery.remove(event.targetScope);
						scope.packery.layout();
					} else {
						$rootScope.packery.remove(scope.element[0]);
						scope.packery.layout();
						$rootScope.packery = null;
					}
				}
			});
          }
        };

      }
    ]);

    
    app.directive('reloadPackery', ['$rootScope', function($rootScope) {
      return function(scope) {
        if (scope.$last){ //The last item in ng-repeat will relead packery
          $rootScope.packery.layout();
        }
      };
    }])

    app.directive('imageLoad', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() { //When the image is loaded, than reload packery
                    $rootScope.packery.layout();
                });
            }
        };
    }]);
    
})();