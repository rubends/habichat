app.controller("groceryCtrl", ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location){
   	$scope.postGrocery = function($widgetId, $groceryTitle){
		var sUrl = $rootScope.apiPath + "/widgets/"+$widgetId+"/groceries";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: {"item": $groceryTitle},
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = response.data.error;
			}
			else{
				$rootScope.error = "";
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items.push(response.data);
						$scope.fixStyle($widgetId);
						break;
					}
				}
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
	}

	$scope.deleteGrocery = function($widgetId, $groceryId){
		var sUrl = $rootScope.apiPath + "/groceries/"+$groceryId;
        var oConfig = {
            url: sUrl,
            method: "DELETE",
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = response.data.error;
			}
			else{
				$rootScope.error = "";
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						for(item in $rootScope.flat.widgets[widget].items){
							if($rootScope.flat.widgets[widget].items[item].id === $groceryId){
								$rootScope.flat.widgets[widget].items.splice(item, 1);
								$scope.fixStyle($widgetId);
								break;
							}
						}
					}
				}
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
	}
}]);
