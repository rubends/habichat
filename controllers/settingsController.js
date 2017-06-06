app.controller("settingsCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	if (!$rootScope.user) {
		$location.path('/login');
	}
	else if (!$rootScope.flat) {
		$location.path('/flat');
	};

	$("#settingsLink").addClass("activePage");
	$scope.changeFlatSettings = function(){
		$rootScope.user.flat = $rootScope.flat;
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
				console.log(response.data);
			}
			else{
				console.log(response);
			}
		}, function errorCallback(response) {
		    console.log(response);
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
				console.log(response.data);
			}
			else{
				$rootScope.flat = response.data;
				if(!response.data){
					$location.path('/flat');
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
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
				console.log(response.data);
			}
			else{
				$rootScope.user = response.data;
				$rootScope.user.loggedIn = true;
				$location.path('/flat');
			}
		}, function errorCallback(response) {
		    console.log(response);
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
				console.log(response.data);
			}
			else{
				for(flatmate in $rootScope.flat.users){
					if($rootScope.flat.users[flatmate].id === response.data.id){
						$rootScope.flat.users[flatmate] = response.data;
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
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