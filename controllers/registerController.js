app.controller("registerCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
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
				$rootScope.error = response.data.error;
			}
			else{
				console.log(response.data);
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
				$rootScope.loadScreen = false;
			}
		}, function errorCallback(response) {
		    console.log("error on register");
		});
    }
}]);