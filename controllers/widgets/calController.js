app.controller("calCtrl", ['$rootScope', '$scope', '$http', '$mdDialog', '$location', function($rootScope, $scope, $http, $mdDialog, $location){
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
				$rootScope.error = "";
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
						break;
					}
				}
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
	}

	function editCalItemController($scope, $mdDialog, calItem, moment, $http){
		$scope.calItem = calItem;
		$scope.moment = moment;

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.saveCalItem = function() {
			$data = {'title': $scope.calItem.title, 'allDay': $scope.calItem.allDay, 'start': {'date':  $scope.calItem.start.date, 'time': $scope.calItem.start.time}}
			if(!$scope.calItem.allDay){
				$data['end'] = {'date':  $scope.calItem.end.date, 'time': $scope.calItem.end.time}
			}
			var sUrl = $rootScope.apiPath + "/calenders/"+$scope.calItem.itemId;
			var oConfig = {
				url: sUrl,
				method: "PUT",
				data: $data,
				headers: {Authorization: 'Bearer ' + $rootScope.user.token},
				params: {callback: "JSON_CALLBACK"}
			};
			$http(oConfig).then(function successCallback(response) {
				if (response.data.hasOwnProperty('error')){
					$rootScope.error = response.data.error;
				}
				else{
					$rootScope.error = "";
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
				$location.path('/login');
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
					$rootScope.error = "";
					$mdDialog.cancel();
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === response.data){
							if($scope.calItem.type === 'feed'){
								for(item in $rootScope.flat.widgets[widget].calItems){
									if($rootScope.flat.widgets[widget].calItems[item].itemId === $scope.calItem.itemId){
										$rootScope.flat.widgets[widget].calItems.splice(item,1);
										break;
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
				$location.path('/login');
			});
		}
	}

	$scope.uiConfig = {
      calendar:{
		locale: localStorage.language,
		lang: localStorage.language,
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
}]);
