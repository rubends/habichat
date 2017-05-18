app.controller("dashboardCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', '$timeout', function($rootScope, $scope, $http, $cookies, $location, $timeout){
	if (!$rootScope.user || !$rootScope.user.loggedIn) {
		$location.path('/login');
	}
	else if (!$rootScope.user.flat) {
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
				$rootScope.user.flat.widgets.push(response.data);
				$scope.addWidgets = false;
				$scope.widgetForm = {};
				if($scope.allWidgets){
					$rootScope.packery.layout();
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }

	$scope.deleteWidget = function($widgetId){
        var sUrl = "../backend/web/api/widgets/" + $widgetId + "/toggle";
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
				if(response.data.visible) {
					$rootScope.user.flat.widgets.push(response.data);
					$scope.widgetDeleted = false;
				} else {
					$scope.widgetDeleted = $widgetId;
					for(widget in $scope.user.flat.widgets){
						if($scope.user.flat.widgets[widget].id === $widgetId){
							$scope.user.flat.widgets[widget] = response.data;
						}
					}
					$timeout(function() {$scope.widgetDeleted = false}, 2000);
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }

	$scope.changeWidgetSize = function($widgetId, $size){
		if ($size < 6) {
			$size++;
		}
		else {
			$size = 2;
		}
        var sUrl = "../backend/web/api/widgets/"+$widgetId+"/sizes/"+$size;
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
				for(widget in $rootScope.user.flat.widgets){
					if($rootScope.user.flat.widgets[widget].id === $widgetId){
						$rootScope.user.flat.widgets[widget].size = $size;
					}
				}
				setTimeout(function(){ $rootScope.packery.layout(); }, 5);
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }


	$scope.postTodo = function($widgetId, $todoTitle){
		var sUrl = "../backend/web/api/widgets/"+$widgetId+"/todos";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: {"title": $todoTitle},
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				for(widget in $rootScope.user.flat.widgets){
					if($rootScope.user.flat.widgets[widget].id === $widgetId){
						$rootScope.user.flat.widgets[widget].items.push(response.data);
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	$scope.toggleTodoDone = function($widgetId, $todoId){
		var sUrl = "../backend/web/api/todos/" + $todoId + "/toggle";
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
				for(widget in $rootScope.user.flat.widgets){
					if($rootScope.user.flat.widgets[widget].id === $widgetId){
						for(item in $rootScope.user.flat.widgets[widget].items){
							if($rootScope.user.flat.widgets[widget].items[item].id === $todoId){
								$rootScope.user.flat.widgets[widget].items[item] = response.data;
							}
						}
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	$scope.deleteTodo = function($widgetId, $todoId){
		var sUrl = "../backend/web/api/todos/"+$todoId;
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
				for(widget in $rootScope.user.flat.widgets){
					if($rootScope.user.flat.widgets[widget].id === $widgetId){
						for(item in $rootScope.user.flat.widgets[widget].items){
							if($rootScope.user.flat.widgets[widget].items[item].id === $todoId){
								$rootScope.user.flat.widgets[widget].items.splice(item, 1);
							}
						}
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	$scope.postGrocery = function($widgetId, $groceryTitle){
		var sUrl = "../backend/web/api/widgets/"+$widgetId+"/groceries";
        var oConfig = {
            url: sUrl,
            method: "POST",
            data: {"item": $groceryTitle},
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				for(widget in $rootScope.user.flat.widgets){
					if($rootScope.user.flat.widgets[widget].id === $widgetId){
						$rootScope.user.flat.widgets[widget].items.push(response.data);
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	$scope.deleteGrocery = function($widgetId, $groceryId){
		var sUrl = "../backend/web/api/groceries/"+$groceryId;
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
				for(widget in $rootScope.user.flat.widgets){
					if($rootScope.user.flat.widgets[widget].id === $widgetId){
						for(item in $rootScope.user.flat.widgets[widget].items){
							if($rootScope.user.flat.widgets[widget].items[item].id === $groceryId){
								$rootScope.user.flat.widgets[widget].items.splice(item, 1);
							}
						}
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}
}]);