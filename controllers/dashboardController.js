app.controller("dashboardCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	if (!$rootScope.user.loggedIn) {
		$location.path('/login');
	}
	else if ($rootScope.user.flat_id == 0) {
		$location.path('/flat');
	};
	$scope.dashboardStyle = {'background-image': 'url(../backend/web/uploads/backgrounds/'+$rootScope.user.flat.background_image+')'};
	$scope.widgetStyle = {'background-color': $rootScope.user.flat.widget_color, 'color': $rootScope.user.flat.font_color};
	$scope.headerStyle = {'background-color': $rootScope.user.flat.header_color, 'color': $rootScope.user.flat.font_color};

	$scope.addWidget = function(){
        var sUrl = "../backend/web/api/widgets";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: $scope.widgetForm,
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				console.log(response.data);
				$rootScope.user.flat.widgets.push(response.data);
				$scope.addWidgets = false;
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }
}]);