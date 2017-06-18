app.controller("textCtrl", ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http){
	$scope.saveText = function ($widgetId, $textId) {
		for(widget in $rootScope.flat.widgets){
			if($rootScope.flat.widgets[widget].id === $widgetId){
				$textForm = $rootScope.flat.widgets[widget].items[0]
			}
		}
		var sUrl = $rootScope.apiPath + "/texts/"+$textId;
		var oConfig = {
			url: sUrl,
			method: "PUT",
			data: $textForm,
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
		};
		$http(oConfig).then(function successCallback(response) {
			for(widget in $rootScope.flat.widgets){
				if($rootScope.flat.widgets[widget].id === $widgetId){
					$rootScope.flat.widgets[widget].items[0] = response.data;
				}
			}
			$scope.fixStyle($widgetId);
		}, function errorCallback(response) {
			$location.path('/login');
		});
	}
}]);
