app.controller("loginCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	$("#loginLink").addClass("activePage");
	$scope.loginUser = function(){
		$rootScope.loadScreen = true;
        var sUrl = $rootScope.apiPath + "/users/logins";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: $scope.userLogin,
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.loadScreen = false;
				$rootScope.error = response.data.error;
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

	$scope.resetPassword = function(){
        var sUrl = $rootScope.apiPath + "/users/passwords/resets";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: $scope.resetForm,
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = response.data.error;
			}
			else{
				$rootScope.error = "";
				
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }
}]);