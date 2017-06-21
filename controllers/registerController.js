app.controller("registerCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', "$filter", function($rootScope, $scope, $http, $cookies, $location, $filter){
	$("#registerLink").addClass("activePage");
	$scope.registerUser = function(){
		$rootScope.loadScreen = true;
        var sUrl = $rootScope.apiPath + "/users";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: $scope.registerFormUser,
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = $filter('translate')(response.data.error);
				$rootScope.loadScreen = false;
			}
			else{
				$rootScope.error = "";
				$cookies.put('token', response.data.token);
				$rootScope.user = response.data;
				$rootScope.loggedIn = true;
				if (response.data.flat) {
					$location.path('/dashboard');
				}
				else{
					$location.path('/flat');
				}
				$rootScope.loadScreen = false;
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }
}]);