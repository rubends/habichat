app.controller("resetCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', '$route', "$filter", function($rootScope, $scope, $http, $cookies, $location, $route, $filter){

	$scope.resetPassword = function(){
		$rootScope.loadScreen = true;
		$scope.resetPassForm.resetKey = $route.current.params.resetKey;
        var sUrl = $rootScope.apiPath + "/users/reset";
        var oConfig = {
            url: sUrl,
            method: "PUT",
            data: $scope.resetPassForm,
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = $filter('translate')(response.data.error);
			}
			else{
				$rootScope.loadScreen = false;
				$rootScope.error = "";
				$cookies.put('token', response.data.token);
				$rootScope.user = response.data;
				$rootScope.user.loggedIn = true;
				if (response.data.flat) {
					$location.path('/dashboard');
				}
				else{
					$location.path('/flat');
				}
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
    };
}]);