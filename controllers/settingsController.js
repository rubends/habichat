app.controller("settingsCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', "$filter", function($rootScope, $scope, $http, $cookies, $location, $filter){
	if (!$rootScope.user) {
		$location.path('/login');
	}
	else if (!$rootScope.flat) {
		$location.path('/flat');
	};

	$("#settingsLink").addClass("activePage");
	$scope.changeFlatSettings = function(){
        var sUrl = $rootScope.apiPath + "/flats/" + $rootScope.flat.id;
        var oConfig = {
            url: sUrl,
            method: "PUT",
            data: $rootScope.flat,
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = response.data.error;
			}
			else{
				$rootScope.error = "";
				$rootScope.showNotification($filter('translate')('FLAT_CHANGED'), null);
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
    }

	$scope.moveOutFlat = function($userId){
        var sUrl = $rootScope.apiPath + "/users/" + $userId + "/flat";
        var oConfig = {
            url: sUrl,
            method: "DELETE",
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = $filter('translate')(response.data.error);
			}
			else{
				$location.path('/flat');
				$rootScope.error = "";
				$rootScope.flat = {};
				$rootScope.user.flat = {};
				$cookies.remove('token');
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
    }

	$scope.deleteFlat = function($flatId){
        var sUrl = $rootScope.apiPath + "/flats/" + $flatId;
        var oConfig = {
            url: sUrl,
            method: "DELETE",
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = $filter('translate')(response.data.error);
			}
			else{
				$location.path('/flat');
				$rootScope.error = "";
				$rootScope.flat = {};
				$rootScope.user.flat = {};
				$cookies.remove('token');
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
    }

	$scope.toggleUserRole = function($userId){
        var sUrl = $rootScope.apiPath + "/users/" + $userId + "/role";
        var oConfig = {
            url: sUrl,
            method: "PUT",
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = response.data.error;
			}
			else{
				$rootScope.error = "";
				for(flatmate in $rootScope.flat.users){
					if($rootScope.flat.users[flatmate].id === response.data.id){
						$rootScope.flat.users[flatmate] = response.data;
						break;
					}
				}
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
				$rootScope.showNotification($filter('translate')('INVITES_SEND'), null);
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
    }
}]);

app.directive('backgroundChange', ['$rootScope', '$http', function ($rootScope, $http) {
    return {
        link: function (scope, element, attrs) {
            element.on('change', function  (evt) {
                var file = evt.target.files[0];
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function () {
					var img = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
					var sUrl = $rootScope.apiPath + "/flats/" + $rootScope.flat.id + "/image";
					var oConfig = {
						url: sUrl,
						method: "PUT",
						data: {image: img},
						headers: {Authorization: 'Bearer ' + $rootScope.user.token},
						params: {callback: "JSON_CALLBACK"}
					};
					$http(oConfig).then(function successCallback(response) {
						if (response.data.hasOwnProperty('error')){
							$rootScope.error = response.data.error;
						}
						else{
							$rootScope.error = "";
							$rootScope.flat.background_image = response.data.background_image;
						}
					}, function errorCallback(response) {
						$location.path('/login');
					});
				}
            });
        }
    }
}]);