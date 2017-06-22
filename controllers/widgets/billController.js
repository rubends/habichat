app.controller("billCtrl", ['$rootScope', '$scope', '$http', '$timeout', '$location', function($rootScope, $scope, $http, $timeout, $location){
	$scope.billPaid = function ($widgetId, $billId, $payerId){
		var sUrl = $rootScope.apiPath + "/bills/"+$billId+"/payers/"+$payerId;
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
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items[0] = JSON.parse(response.data);
						$scope.fixStyle($widgetId);
						break;
					}
				}
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
	}
}]);
