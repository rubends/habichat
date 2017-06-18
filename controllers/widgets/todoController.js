app.controller("todoCtrl", ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location){
	$scope.postTodo = function($widgetId, $todoTitle){
		var sUrl = $rootScope.apiPath + "/widgets/"+$widgetId+"/todos";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: {"title": $todoTitle},
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

	$scope.toggleTodoDone = function($widgetId, $todoId){
		var sUrl = $rootScope.apiPath + "/todos/" + $todoId + "/toggle";
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
						for(item in $rootScope.flat.widgets[widget].items){
							if($rootScope.flat.widgets[widget].items[item].id === $todoId){
								$rootScope.flat.widgets[widget].items[item] = response.data;
                                break;
							}
						}
						$scope.fixStyle($widgetId);
					}
				}
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
	}

	$scope.deleteTodo = function($widgetId, $todoId){
		var sUrl = $rootScope.apiPath + "/todos/"+$todoId;
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
							if($rootScope.flat.widgets[widget].items[item].id === $todoId){
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
