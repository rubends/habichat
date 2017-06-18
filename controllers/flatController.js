app.controller("flatCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	if (!$rootScope.user) {
		$location.path('/login');
	};
	$scope.createFlat = function(){
		$rootScope.loadScreen = true;
        var sUrl = $rootScope.apiPath + "/flats";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: $scope.registerFlat,
            params: {callback: "JSON_CALLBACK"},
            headers: {Authorization: 'Bearer ' + $rootScope.user.token}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = response.data.error;
				$rootScope.loadScreen = false;
			}
			else{
				$rootScope.error = "";
				$token = $rootScope.user.token;
				$rootScope.flat = response.data.flat;
				$rootScope.user = response.data.user;
				$rootScope.user.loggedIn = true;
				$rootScope.user.token = $token;
				$scope.sendInvites();
				$location.path('/dashboard');
				$rootScope.loadScreen = false;
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
    }

	$scope.sendInvites = function(){
        var sUrl = $rootScope.apiPath + "/invites";
        var oConfig = {
            url: sUrl,
            method: "POST",
			data: $scope.inviteList,
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = response.data.error;
			}
			else{
				$rootScope.error = "";
				$scope.inviteList.invites = [{email: ''}];
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
    }
}]);