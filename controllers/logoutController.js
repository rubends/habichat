app.controller("logoutCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	$rootScope.user = [];
	$rootScope.user.loggedIn = false;
	$cookies.remove('token');
	$location.path('/');
}]);