app.controller("flatCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	if (!$rootScope.user) {
		$location.path('/login');
	};
	$scope.createFlat = function(){
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
				console.log(response.data);
			}
			else{
				console.log(response.data);
				$token = $rootScope.user.token;
				$rootScope.flat = response.data.flat;
				$rootScope.user = response.data.user;
				$rootScope.user.loggedIn = true;
				$rootScope.user.token = $token;
				$scope.sendInvites();
				$location.path('/dashboard');
			}
		}, function errorCallback(response) {
		    console.log("error on create flat");
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
				console.log(response.data);
			}
			else{
				$scope.inviteList.invites = [{email: ''}];
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }
}]);