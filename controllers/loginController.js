app.controller("loginCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	$scope.loginUser = function(){
        var sUrl = $rootScope.apiPath + "/users/logins";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: $scope.userLogin,
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				console.log(response.data);
				$cookies.put('token', response.data.token);
				$rootScope.user = response.data;
				$rootScope.user.loggedIn = true;
				if (response.data.flat_id == 0) {
					$location.path('/flat');
				}
				else{
					$location.path('/dashboard');
				}
				
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
    }
}]);