app.controller("registerCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	$scope.registerUser = function(){
        var sUrl = "../backend/web/api/users";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: $scope.registerUser,
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
				$location.path('/flat');
			}
		}, function errorCallback(response) {
		    console.log("error on register");
		});
    }
}]);