app.controller("flatCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	if (!$rootScope.user) {
		$location.path('/login');
	};
	$scope.createFlat = function(){
        var sUrl = "../backend/web/api/flats";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: $scope.registerFlat,
            params: {callback: "JSON_CALLBACK"},
            headers: {Authorization: 'Bearer ' + $rootScope.user.token}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				console.log(response.data);
				$scope.assignFlat(response.data.id, "ROLE_ADMIN");
			}
		}, function errorCallback(response) {
		    console.log("error on create flat");
		});
    }

    $scope.assignFlat = function($flatId, $role){
        var sUrl = "../backend/web/api/users/"+$flatId+"/flats/"+$role;
        var oConfig = {
            url: sUrl,
            method: "PATCH",
            params: {callback: "JSON_CALLBACK"},
            headers: {Authorization: 'Bearer ' + $rootScope.user.token}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				console.log(response.data);
				$location.path('/dashboard');
			}
		}, function errorCallback(response) {
		    console.log("error on create flat");
		});
    }
}]);