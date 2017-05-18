app.controller("settingsCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	if (!$rootScope.user) {
		$location.path('/login');
	}
	else if (!$rootScope.user.flat) {
		$location.path('/flat');
	};

	$scope.changeFlatSettings = function(){
        var sUrl = "../backend/web/api/flats/" + $rootScope.user.flat.id;
        var oConfig = {
            url: sUrl,
            method: "PUT",
            data: $rootScope.user.flat,
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				console.log(response);
				$rootScope.user.flat = response.data;
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }

	$scope.moveOutFlat = function($userId){
        var sUrl = "../backend/web/api/users/" + $userId + "/flat";
        var oConfig = {
            url: sUrl,
            method: "DELETE",
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				$rootScope.user.flat = response.data;
				if(!response.data){
					$location.path('/flat');
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }

	$scope.toggleUserRole = function($userId){
        var sUrl = "../backend/web/api/users/" + $userId + "/role";
        var oConfig = {
            url: sUrl,
            method: "PUT",
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				for(flatmate in $rootScope.user.flat.users){
					if($rootScope.user.flat.users[flatmate].id === response.data.id){
						$rootScope.user.flat.users[flatmate] = response.data;
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }

	$scope.sendInvites = function(){
        var sUrl = "../backend/web/api/flats/adds";
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
				console.log(response.data);
			}
		}, function errorCallback(response) {
		    console.log(response);
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
					var sUrl = "../backend/web/api/flats/" + $rootScope.user.flat.id + "/image";
					var oConfig = {
						url: sUrl,
						method: "PUT",
						data: {image: img},
						headers: {Authorization: 'Bearer ' + $rootScope.user.token},
						params: {callback: "JSON_CALLBACK"}
					};
					$http(oConfig).then(function successCallback(response) {
						if (response.data.hasOwnProperty('error')){
							console.log(response.data);
						}
						else{
							console.log(response);
							$rootScope.user.flat = response.data;
						}
					}, function errorCallback(response) {
						console.log(response);
					});
				}
            });
        }
    }
}]);