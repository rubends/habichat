app.controller("weatherCtrl", ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http){
	$scope.getWeather = function ($id, $title) {
		var sUrl = "http://api.openweathermap.org/data/2.5/weather?q="+$title+"&units=metric&appid=ad5bf1181d1ab5166d19757241c1511e&lang="+localStorage.language;
		var oConfig = {
			url: sUrl,
			method: "GET"
		};
		$http(oConfig).then(function successCallback(response) {
			$scope.weather = $scope.weather ? $scope.weather : [];
			$scope.weather[$id] = response.data;
			$scope.fixStyle($id);
		}, function errorCallback(response) {
			$location.path('/login');
		});
	}
}]);
