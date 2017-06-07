app.controller("dashboardCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', '$timeout', '$mdDialog', '$mdToast', function($rootScope, $scope, $http, $cookies, $location, $timeout, $mdDialog, $mdToast){
	if (!$rootScope.user || !$rootScope.user.loggedIn) {
		$location.path('/login');
	}
	else if (!$rootScope.flat) {
		$location.path('/flat');
	} else {
		$("#dashboardLink").addClass("activePage");
		$scope.dashboardStyle = {'background-image': 'url(../backend/web/uploads/'+$rootScope.user.flat.flat_token+'/'+$rootScope.user.flat.background_image+')'};
		$scope.widgetStyle = {'background-color': $rootScope.user.flat.widget_color, 'color': $rootScope.user.flat.font_color};
		$scope.headerStyle = {'background-color': $rootScope.user.flat.header_color, 'color': $rootScope.user.flat.font_color};
	}

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

	$scope.onCalItemClick = function (date, jsEvent, view){
		if(date.url){
			date.type = 'feed';
		} else {
			date.type = 'event';
		}
		if(date.start) {
			$d = moment(date.start).toDate();
			date.start.date = $d;
			date.start.time = $d;
		}
		if(date.end) {
			$d = moment(date.end).toDate();
			date.end.date = $d;
			date.end.time = $d;
		}
		$mdDialog.show({
			controller: editCalItemController,
			templateUrl: 'widgets/forms/calenderDialogEdit.html',
			parent: angular.element(document.body),
			targetEvent: jsEvent,
			clickOutsideToClose: true,
			locals: {
				calItem: date,
				moment: window.moment
			},
		})
		.then(function(answer) {
		 //show answer or something
		}, function() {
			$scope.calItemForm = {};
   		});

		if (date.url) {
            return false;
        }
	}

	function editCalItemController($scope, $mdDialog, calItem, moment, $http){
		$scope.calItem = calItem;
		$scope.moment = moment;

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.saveCalItem = function() {
			var sUrl = $rootScope.apiPath + "/calenders/"+$scope.calItem.itemId;
			var oConfig = {
				url: sUrl,
				method: "PUT",
				data: {'title': $scope.calItem.title, 'allDay': $scope.calItem.allDay, 'start': {'date':  $scope.calItem.start.date, 'time': $scope.calItem.start.time}, 'end': {'date':  $scope.calItem.end.date, 'time': $scope.calItem.end.time}},
				headers: {Authorization: 'Bearer ' + $rootScope.user.token},
				params: {callback: "JSON_CALLBACK"}
			};
			$http(oConfig).then(function successCallback(response) {
				if (response.data.hasOwnProperty('error')){
					$rootScope.error = response.data.error;
				}
				else{
					$mdDialog.cancel();
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === response.data.widget){
							for(item in $rootScope.flat.widgets[widget].calItems[0].events){
								if($rootScope.flat.widgets[widget].calItems[0].events[item].itemId === response.data.id){
									$rootScope.flat.widgets[widget].calItems[0].events.splice(item,1);
									response.data.className = ['newCalItem'];
									response.data.itemId = response.data.id;
									response.data.allDay = response.data.all_day;
									$rootScope.flat.widgets[widget].calItems[0].events.push(response.data);
									break;
								}
							}
						}
					}
				}
			}, function errorCallback(response) {
				console.log(response);
			});
		}

		$scope.deleteCalItem = function() {
			if(!$scope.calItem.itemId){
				$scope.calItem.itemId = $scope.calItem.source.itemId
			}
			var sUrl = $rootScope.apiPath + "/calenders/"+$scope.calItem.itemId;
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
					$mdDialog.cancel();
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === response.data){
							if($scope.calItem.type === 'feed'){
								for(item in $rootScope.flat.widgets[widget].calItems){
									if($rootScope.flat.widgets[widget].calItems[item].itemId === $scope.calItem.itemId){
										$rootScope.flat.widgets[widget].calItems.splice(item,1);
									}
								}
							} else {
								for(item in $rootScope.flat.widgets[widget].calItems[0].events){
									if($rootScope.flat.widgets[widget].calItems[0].events[item].itemId === $scope.calItem.itemId){
										$rootScope.flat.widgets[widget].calItems[0].events.splice(item,1);
										break;
									}
								}
							}
						}
					}
				}
			}, function errorCallback(response) {
				console.log(response);
			});
		}
	}

	 $scope.uiConfig = {
      calendar:{
        height: "auto",
        editable: true,
		timeFormat: 'H(:mm)',
		ignoreTimezone: false,
		fixedWeekCount: false,
		googleCalendarApiKey: $rootScope.calKey,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.onCalItemClick
      }
    };
	
	$scope.toCalItems = function($widget){
		$widget.calItems = [{events: [], color:'black', textColor: 'white'}];
		for($item in $widget.items){
			if(!$widget.items[$item].url) {
				$event = {
					title: $widget.items[$item].title,
					start: $widget.items[$item].start,
					end: $widget.items[$item].end,
					allDay: $widget.items[$item].all_day,
					itemId: $widget.items[$item].id
				}
				$widget.calItems[0].events.push($event);
			} else {
				$widget.calItems.push({url: $widget.items[$item].url, dataType : 'jsonp', className: 'newCalItem', itemId: $widget.items[$item].id});
			}
		}
	};

	$scope.showCalendertDialog = function(ev, $widgetId) {
		$scope.calItemForm = {};
		$scope.calWidgetId = $widgetId;
		$mdDialog.show({
			controller: () => this,
			controllerAs: 'ctrl',
			templateUrl: 'widgets/forms/calenderDialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true
		})
		.then(function(answer) {
		 //show answer or something
		}, function() {
			$scope.calItemForm = {};
   		});
	};

	$scope.showChoreDialog = function(ev, $widgetId) {
		$scope.choreForm = {};
		$scope.choreWidgetId = $widgetId;
		$mdDialog.show({
			controller: () => this,
			controllerAs: 'ctrl',
			templateUrl: 'widgets/forms/choreDialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true
		})
		.then(function(answer) {
		 //show answer or something
		}, function() {
			$scope.choreForm = {};
   		});
	};

	$scope.showDeleteDialog = function(ev, $widgetId, $widgetTitle) {
		$scope.deleteWidgetId = $widgetId;
		$scope.deleteWidgetTitle = $widgetTitle;
		$mdDialog.show({
			controller: () => this,
			controllerAs: 'ctrl',
			templateUrl: 'widgets/forms/deleteDialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true
		})
		.then(function(answer) {
		 //show answer or something
		}, function() {
   		});
	};


	$scope.addWidget = function(){
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
				$rootScope.error = response.data.error;
			}
			else{
				$mdDialog.cancel();
				$rootScope.flat.widgets = $rootScope.flat.widgets ? $rootScope.flat.widgets : [];
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
				$rootScope.error = response.data.error;
			}
			else{
				$mdDialog.cancel();
				if(response.data.visible) {
					$rootScope.flat.widgets.push(response.data);
				} else {
					deletedToast($widgetId);
					for(widget in $scope.flat.widgets){
						if($scope.flat.widgets[widget].id === $widgetId){
							$scope.flat.widgets.splice(widget, 1);
						}
					}
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
				$rootScope.error = response.data.error;
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
				$rootScope.error = response.data.error;
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
				$rootScope.error = response.data.error;
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
				$rootScope.error = response.data.error;
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
				$rootScope.error = response.data.error;
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
				$rootScope.error = response.data.error;
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
					$rootScope.error = response.data.error;
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

	$scope.getWeather = function ($id, $title) {
		var sUrl = "http://api.openweathermap.org/data/2.5/weather?q="+$title+"&units=metric&appid=ad5bf1181d1ab5166d19757241c1511e";
		var oConfig = {
			url: sUrl,
			method: "GET"
		};
		$http(oConfig).then(function successCallback(response) {
			$scope.weather = $scope.weather ? $scope.weather : [];
			$scope.weather[$id] = response.data;
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
				$rootScope.error = response.data.error;
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
				$rootScope.error = response.data.error;
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
				$rootScope.error = response.data.error;
			}
			else{
				$scope.addPollForm = [];
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
				$rootScope.error = response.data.error;
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

	$scope.addCalItem = function ($widgetId){
		var sUrl = $rootScope.apiPath + "/widgets/"+$widgetId+"/calenders";
        var oConfig = {
            url: sUrl,
            method: "POST",
			data: $scope.calItemForm,
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = response.data.error;
			}
			else{
				$mdDialog.cancel();
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items.push(response.data);
						response.data.className = ['newCalItem'];
						response.data.itemId = response.data.id;
						if(!response.data.url){
							response.data.allDay = response.data.all_day;
							$rootScope.flat.widgets[widget].calItems[0].events.push(response.data);
						} else {
							$rootScope.flat.widgets[widget].calItems.push(response.data);
						}
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	$scope.addChore = function ($widgetId){
		var sUrl = $rootScope.apiPath + "/widgets/"+$widgetId+"/chores";
        var oConfig = {
            url: sUrl,
            method: "POST",
			data: $scope.choreForm,
			headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
			if (response.data.hasOwnProperty('error')){
				$rootScope.error = response.data.error;
			}
			else{
				$mdDialog.cancel();
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


	// GRID STACK
	$scope.gridOptions = {
		cellHeight: 50,
		verticalMargin: 20,
		animate: true
	};

	$scope.onGridChange = function(event, items) {
	};

	$scope.onGridDragStop = function(event, ui) {
		$scope.widgetPlaces = [];
		for($w in $scope.flat.widgets){
			$scope.widgetPlaces.push({'id': $scope.flat.widgets[$w].id, 'x': $scope.flat.widgets[$w].x, 'y': $scope.flat.widgets[$w].y});
		}
		saveWidgetPlaces();
	};

	$scope.onGridResizeStop = function(event, ui) {
		changeWidgetSize(ui.element[0].id, ui.element[0].dataset.gsWidth, ui.element[0].dataset.gsHeight);
	};
}]);

app.filter('choreDay', function() {
  return function(item, userId, day){
	  $validItems = [];
	  for(chore in item){
		if(item[chore].user.id === userId){
			$date = moment(item[chore].last);

			if($date.diff(moment()) < 0){
				$date.add(item[chore].occurance, 'd');
			};
			
			if($date.isoWeekday() === day || $date.isoWeekday() === (day - item[chore].occurance) || $date.isoWeekday() === (day + item[chore].occurance)){
				$validItems.push(item[chore]);
			};
		}
	  }
	  return $validItems;
  }
});