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
				$rootScope.user.flat = response.data;
				$location.path('/login');
			}
		}, function errorCallback(response) {
		    console.log("error on create flat");
		});
    }
}]);