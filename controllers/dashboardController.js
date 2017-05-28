app.controller("dashboardCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', '$timeout', '$mdDialog', function($rootScope, $scope, $http, $cookies, $location, $timeout, $mdDialog){
	if (!$rootScope.user || !$rootScope.user.loggedIn) {
		$location.path('/login');
	}
	else if (!$rootScope.flat) {
		$location.path('/flat');
	};

	$scope.dashboardStyle = {'background-image': 'url(../backend/web/uploads/'+$rootScope.user.flat.flat_token+'/'+$rootScope.flat.background_image+')'};
	$scope.widgetStyle = {'background-color': $rootScope.user.flat.widget_color, 'color': $rootScope.flat.font_color};
	$scope.headerStyle = {'background-color': $rootScope.user.flat.header_color, 'color': $rootScope.flat.font_color};

	$(".nav").find(".activePage").removeClass("activePage");
   	$("#dashboardLink").addClass("activePage");

	$scope.showWidgetDialog = function(ev) {
		$mdDialog.show({
		controller: () => this,
		controllerAs: 'ctrl',
		templateUrl: 'fragments/widgetDialog.html',
      	parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose: true
		})
		.then(function() {
		 //show answer or something
		}, function() {
		$scope.widgetForm = [];
   		});
	};

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
				$mdDialog.cancel();
				$rootScope.flat.widgets.push(response.data);
				$scope.widgetForm = {};
				if($scope.allWidgets){
					$rootScope.packery.layout();
				}
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
					$rootScope.flat.widgets.push(response.data);
					$scope.widgetDeleted = false;
				} else {
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
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].size = $size;
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
		var sUrl = "../backend/web/api/widgets/"+$widgetId+"/polls";
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
		var sUrl = "../backend/web/api/polloptions/"+$optionId+"/vote";
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
}]);