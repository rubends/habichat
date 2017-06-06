app.controller("resetCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', '$route', function($rootScope, $scope, $http, $cookies, $location, $route){

	$scope.resetPassword = function(){
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
				console.log(response.data);
			}
			else{
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