app.controller("dashboardCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', '$timeout', function($rootScope, $scope, $http, $cookies, $location, $timeout){
	if (!$rootScope.user || !$rootScope.user.loggedIn) {
		$location.path('/login');
	}
	else if (!$rootScope.user.flat) {
		$location.path('/flat');
	};

	function colorConvert(color, a) {
        var r = parseInt(color.substring(1,3),16);
        var g = parseInt(color.substring(3,5),16);
        var b = parseInt(color.substring(5,7),16);
        return ('rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
	};

	$scope.dashboardStyle = {'background-image': 'url(../backend/web/uploads/'+$rootScope.user.flat.flat_token+'/'+$rootScope.user.flat.background_image+')'};
	$scope.widgetStyle = {'background-color': colorConvert($rootScope.user.flat.widget_color, 0.7), 'color': $rootScope.user.flat.font_color};
	$scope.headerStyle = {'background-color': colorConvert($rootScope.user.flat.header_color,0.7), 'color': $rootScope.user.flat.font_color};

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
				if(response.data.widget_type === 'Picture'){
					postPicture(response.data.id);
				}
				if(response.data.widget_type === 'Bill'){
					postBill(response.data.id);
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

	function postPicture($widgetId){
		var file = $('#addPictureImage')[0].files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			var img = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
			var sUrl = "../backend/web/api/widgets/"+$widgetId+"/pictures";
			var oConfig = {
				url: sUrl,
				method: "POST",
				data: {image: img},
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
	}

	$scope.getWeather = function () {
		var sUrl = "http://api.openweathermap.org/data/2.5/weather?q="+$rootScope.user.flat.city+"&units=metric&appid=ad5bf1181d1ab5166d19757241c1511e";
		var oConfig = {
			url: sUrl,
			method: "GET"
		};
		$http(oConfig).then(function successCallback(response) {
			$scope.weather = response.data;
		}, function errorCallback(response) {
			console.log(response);
		});
	}


	function postBill($widgetId){
		var sUrl = "../backend/web/api/widgets/"+$widgetId+"/bills";
        var oConfig = {
            url: sUrl,
            method: "POST",
			data: $scope.addBillForm,
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

	$scope.billPaid = function ($widgetId, $billId, $userId){
		var sUrl = "../backend/web/api/bills/"+$billId+"/paids/"+$userId;
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
						$rootScope.user.flat.widgets[widget].items[0] = response.data;
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}
}]);