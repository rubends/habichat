app.controller("dashboardCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', '$timeout', '$mdDialog', '$mdToast', function($rootScope, $scope, $http, $cookies, $location, $timeout, $mdDialog, $mdToast){
	if (!$rootScope.user || !$rootScope.user.loggedIn) {
		$location.path('/login');
	}
	else if (!$rootScope.flat) {
		$location.path('/flat');
	};

	$("#dashboardLink").addClass("activePage");
	$scope.dashboardStyle = {'background-image': 'url(../backend/web/uploads/'+$rootScope.user.flat.flat_token+'/'+$rootScope.user.flat.background_image+')'};
	$scope.widgetStyle = {'background-color': $rootScope.user.flat.widget_color, 'color': $rootScope.user.flat.font_color};
	$scope.headerStyle = {'background-color': $rootScope.user.flat.header_color, 'color': $rootScope.user.flat.font_color};

	$scope.showWidgetDialog = function(ev) {
		$mdDialog.show({
		controller: () => this,
		controllerAs: 'ctrl',
		templateUrl: 'fragments/widgetDialog.html',
      	parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose: true
		})
		.then(function(answer) {
		 //show answer or something
		}, function() {
			$scope.widgetForm = {};
   		});
	};
	$scope.closeDialog = function() {
		$mdDialog.cancel();
	};

	$scope.addWidget = function(){
		console.log($scope.widgetForm);
        var sUrl = $rootScope.apiPath + "/widgets";
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
				$mdDialog.cancel();
				$rootScope.flat.widgets.push(response.data);
				if(response.data.widget_type === 'Picture'){
					postPicture(response.data.id);
				} else if(response.data.widget_type === 'Bill'){
					postBill(response.data.id);
				} else if(response.data.widget_type === 'Poll'){
					postPoll(response.data.id);
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }

	$scope.deleteWidget = function($widgetId){
        var sUrl = $rootScope.apiPath + "/widgets/" + $widgetId + "/toggle";
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
					$rootScope.flat.widgets.push(response.data);
					$scope.widgetDeleted = false;
				} else {
					deletedToast($widgetId);
					$scope.widgetDeleted = $widgetId;
					for(widget in $scope.flat.widgets){
						if($scope.flat.widgets[widget].id === $widgetId){
							$scope.flat.widgets[widget] = response.data;
						}
					}
					$timeout(function() {$scope.widgetDeleted = false}, 2000);
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
    }

	function deletedToast($widgetId) {
		$mdToast.show($mdToast.simple().textContent('You deleted a widget').action('Undo').position('bottom center'))
			.then(function(response) {
				if ( response == 'ok' ) {
					$scope.deleteWidget($widgetId);
				}
			});
	};

	function changeWidgetSize($widgetId, $width, $height){
        var sUrl = $rootScope.apiPath + "/widgets/"+$widgetId+"/size";
        var oConfig = {
            url: sUrl,
            method: "PUT",
			data: {'width': $width, 'height': $height},
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

	function saveWidgetPlaces(){
		var sUrl = $rootScope.apiPath + "/widgets/place";
		var oConfig = {
			url: sUrl,
			method: "PUT",
			data: {'widgets': $scope.widgetPlaces},
			params: {callback: "JSON_CALLBACK"},
			headers: {Authorization: 'Bearer ' + $rootScope.user.token}
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
				console.log(response.data);
			}
			else{
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items.push(response.data);
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
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
				console.log(response.data);
			}
			else{
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						for(item in $rootScope.flat.widgets[widget].items){
							if($rootScope.flat.widgets[widget].items[item].id === $todoId){
								$rootScope.flat.widgets[widget].items[item] = response.data;
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
		var sUrl = $rootScope.apiPath + "/todos/"+$todoId;
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
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						for(item in $rootScope.flat.widgets[widget].items){
							if($rootScope.flat.widgets[widget].items[item].id === $todoId){
								$rootScope.flat.widgets[widget].items.splice(item, 1);
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
				console.log(response.data);
			}
			else{
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items.push(response.data);
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
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
				console.log(response.data);
			}
			else{
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						for(item in $rootScope.flat.widgets[widget].items){
							if($rootScope.flat.widgets[widget].items[item].id === $groceryId){
								$rootScope.flat.widgets[widget].items.splice(item, 1);
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
			var sUrl = $rootScope.apiPath + "/widgets/"+$widgetId+"/pictures";
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
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === $widgetId){
							$rootScope.flat.widgets[widget].items.push(response.data);
						}
					}
				}
			}, function errorCallback(response) {
				console.log(response);
			});
		}
	}

	$scope.getWeather = function () {
		var sUrl = "http://api.openweathermap.org/data/2.5/weather?q="+$rootScope.flat.city+"&units=metric&appid=ad5bf1181d1ab5166d19757241c1511e";
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
		var sUrl = $rootScope.apiPath + "/widgets/"+$widgetId+"/bills";
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
				$scope.addBillForm = [];
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items.push(response.data);
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	$scope.billPaid = function ($widgetId, $billId, $userId){
		var sUrl = $rootScope.apiPath + "/bills/"+$billId+"/paids/"+$userId;
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
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items[0] = response.data;
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	function postPoll($widgetId){
		var sUrl = $rootScope.apiPath + "/widgets/"+$widgetId+"/polls";
        var oConfig = {
            url: sUrl,
            method: "POST",
			data: $scope.addPollForm,
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				console.log(response.data);
			}
			else{
				$scope.addPollForm = [];
				console.log(response.data);
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items.push(response.data);
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	$scope.getChecked = function($option){
		$voters = $option.voters;
		$hasVoted = false;
		if($voters.length > 0){
			for($i = $voters.length-1; $i === 0; $i--){
				if($voters[$i].id === $rootScope.user.id){
					$hasVoted = true;
					break;
				}
			}
		}
		return $hasVoted;
	}

	$scope.getSelected = function($options){
		$selected = 'none';
		for ($option in $options) {
			for ($voter in $options[$option].voters) {
				if($options[$option].voters[$voter].id === $rootScope.user.id){
					$selected = $options[$option].id;
				}
			}
		}
		return $selected;
	}

	$scope.getPassed = function($date){
		$now = new Date();
		if(new Date($date) >= $now){
			$isValid = true;
		} else {
			$isValid = false;
		}
		return $isValid;
	}

	$scope.votePoll = function ($widgetId, $optionId){
		var sUrl = $rootScope.apiPath + "/polloptions/"+$optionId+"/vote";
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
				console.log(response.data);
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items[0] = response.data;
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}




	// GRID STACK
	$scope.gridOptions = {
		cellHeight: 50,
		verticalMargin: 10
	};

	$scope.onGridChange = function(event, items) {
	};

	$scope.onGridDragStop = function(event, ui) {
		$scope.widgetPlaces = [];
		for($w in $scope.flat.widgets){
			$scope.widgetPlaces.push({'id': $scope.flat.widgets[$w].id, 'x': $scope.flat.widgets[$w].x, 'y': $scope.flat.widgets[$w].y});
		}
		console.log($scope.widgetPlaces);
		saveWidgetPlaces();
	};

	$scope.onGridResizeStop = function(event, ui) {
		changeWidgetSize(ui.element[0].id, ui.element[0].dataset.gsWidth, ui.element[0].dataset.gsHeight);
	};
}]);