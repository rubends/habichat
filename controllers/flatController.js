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
				$rootScope.user.flat = response.data;
				$scope.sendInvites();
				$location.path('/dashboard');
			}
		}, function errorCallback(response) {
		    console.log("error on create flat");
		});
    }

	$scope.sendInvites = function(){
        var sUrl = "../backend/web/api/invites";
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