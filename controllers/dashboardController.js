app.controller("dashboardCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', '$timeout', '$mdDialog', '$mdToast', '$filter', function($rootScope, $scope, $http, $cookies, $location, $timeout, $mdDialog, $mdToast, $filter){
	if (!$rootScope.user || !$rootScope.loggedIn) {
		$location.path('/login');
	}
	else if (!$rootScope.flat) {
		$location.path('/flat');
	} else {
		if($rootScope.flat.chats) {
			$rootScope.flat.chats.new = 0;
			for($i = $rootScope.flat.chats.length-1; $i >= 0; $i--){
				if(moment($rootScope.flat.chats[$i].send).isAfter($rootScope.user.last_login)){
					$rootScope.flat.chats.new++;
				} else { break; }
			}
		}
		$("#dashboardLink").addClass("activePage");
		$scope.dashboardStyle = {'background-image': 'url(../backend/web/uploads/'+$rootScope.flat.flat_token+'/'+$rootScope.flat.background_image+')'};
		$scope.widgetStyle = {'background-color': $rootScope.flat.widget_color, 'color': $rootScope.flat.font_color};
		$scope.headerStyle = {'background-color': $rootScope.flat.header_color, 'color': $rootScope.flat.header_font_color};
		$scope.inputTextStyle = {"border-bottom-color": $rootScope.flat.header_color, "color": $rootScope.flat.font_color};
		$scope.inputBtnStyle = {"border-color": $rootScope.flat.header_color, "color": $rootScope.flat.header_color};


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

		$scope.showDeleteDialog = function(ev, $widgetId, $widgetTitle) {
			$scope.deleteWidgetId = $widgetId;
			$scope.deleteWidgetTitle = $widgetTitle;
			$mdDialog.show({
				controller: () => this,
				controllerAs: 'ctrl',
				templateUrl: 'templates/widgets/forms/deleteDialog.html',
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
					$rootScope.error = "";
					$mdDialog.cancel();
					$rootScope.flat.widgets = $rootScope.flat.widgets ? $rootScope.flat.widgets : [];
					$response = JSON.parse(response.data);
					$rootScope.flat.widgets.push($response);
					if($response.widget_type === 'Picture'){
						$scope.postPicture($response.id);
					} else if($response.widget_type === 'Bill'){
						$scope.postBill($response.id);
					} else if($response.widget_type === 'Poll'){
						$scope.postPoll($response.id);
					}
				}
			}, function errorCallback(response) {
				$location.path('/login');
			});
		}

		$scope.deleteWidget = function($widgetId){
			for(widget in $rootScope.flat.widgets){
				if($rootScope.flat.widgets[widget].id === $widgetId){
					$rootScope.flat.widgets[widget].visible = !$rootScope.flat.widgets[widget].visible;
					$mdDialog.cancel();
					break;
				}
			}
			var sUrl = $rootScope.apiPath + "/widgets/" + $widgetId + "/toggle";
			var oConfig = {
				url: sUrl,
				method: "PUT",
				headers: {Authorization: 'Bearer ' + $rootScope.user.token},
				params: {callback: "JSON_CALLBACK"}
			};
			$http(oConfig).then(function successCallback(response) {
				if (response.data.hasOwnProperty('error')){
					$rootScope.error = $filter('translate')(response.data.error);
				}
				else{
					$rootScope.error = "";
					response.data = JSON.parse(response.data);
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === $widgetId){
							$rootScope.flat.widgets[widget].visible = response.data.visible;
							break;
						}
					}
					if (!response.data.visible){
						deletedToast($widgetId);
					}
				}
			}, function errorCallback(response) {
				$location.path('/login');
			});
		}

		function deletedToast($widgetId) {
			$mdToast.show($mdToast.simple().textContent($filter('translate')('WIDGET_DELETE')).action($filter('translate')('UNDO')).position('bottom center'))
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
					$rootScope.error = "";
				}
			}, function errorCallback(response) {
				$location.path('/login');
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
					$rootScope.error = "";
				}
			}, function errorCallback(response) {
				$location.path('/login');
			});
		}

		$scope.postPicture = function($widgetId){
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
						$rootScope.error = $filter('translate')(response.data.error);
					}
					else{
						$rootScope.error = "";
						for(widget in $rootScope.flat.widgets){
							if($rootScope.flat.widgets[widget].id === $widgetId){
								$rootScope.flat.widgets[widget].items.push(response.data);
							}
						}
					}
				}, function errorCallback(response) {
					$location.path('/login');
				});
			}
		}

		$scope.postPoll = function($widgetId){
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
					$rootScope.error = "";
					$scope.addPollForm = {};
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

		$scope.postBill = function($widgetId){
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
					$rootScope.error = "";
					$scope.addBillForm = {};
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

		$scope.sendMsg = function (){
			if($scope.chatForm.message){
				$scope.chat = angular.copy($scope.chatForm);
				$scope.chatForm.message= '';
				var sUrl = $rootScope.apiPath + "/chats/"+$rootScope.user.id+"/messages";
				var oConfig = {
					url: sUrl,
					method: "POST",
					data: $scope.chat,
					headers: {Authorization: 'Bearer ' + $rootScope.user.token},
					params: {callback: "JSON_CALLBACK"}
				};
				$http(oConfig).then(function successCallback(response) {
					if (response.data.hasOwnProperty('error')){
						$rootScope.error = $filter('translate')(response.data.error);
					}
					else{
						$rootScope.flat.chats.push(JSON.parse(response.data));
						$scope.scrollChat();
					}
				}, function errorCallback(response) {
					$location.path('/login');
				});
			}
		}

		$scope.scrollChat = function() {
			$timeout(function() {
				$('.msgs .simplebar-scroll-content').scrollTop($('.msgs .simplebar-scroll-content')[0].scrollHeight);
			});
		}

		$scope.postLastLogin = function (){
			var sUrl = $rootScope.apiPath + "/users/lastlogins";
			var oConfig = {
				url: sUrl,
				method: "POST",
				headers: {Authorization: 'Bearer ' + $rootScope.user.token},
				params: {callback: "JSON_CALLBACK"}
			};
			$http(oConfig).then(function successCallback(response) {
				if (response.data.hasOwnProperty('error')){
					$rootScope.error = response.data.error;
				}
				else{
					$rootScope.user.last_login = moment(response.data);
				}
			}, function errorCallback(response) {
				$location.path('/login');
			});
		}

		$scope.fixStyle = function ($id) {
			$timeout(function() {
				$('.checkboxColor .md-icon').css('background-color', 'transparent');
				$('.checkboxColor.md-checked .md-icon').css('background-color', $rootScope.flat.header_color);
				$('.checkboxColor .md-icon').css('border-color', $rootScope.flat.header_color);
				$('.selectColor .md-on').css('background-color', $rootScope.flat.header_color);
				$('.selectColor .md-off').css('border-color', $rootScope.flat.header_color);
				$('.widgetBtn').css('color', $rootScope.flat.header_color);
				$('.paid .icon').css('color', $rootScope.flat.header_color);
				$widget = $('#'+$id);
				$headerHeight = $widget.find('.grid-stack-item-content .widgetHeader').outerHeight();
				$bodyHeight = $widget.find('.grid-stack-item-content .widgetBody').outerHeight();
				$height = Math.ceil(($headerHeight + $bodyHeight)/70);
				$grid = $('.grid-stack').data('gridstack');
				if($height <= 3) {
					$height = 4;
				}
				$grid.update($widget, null, null, null, $height);
				$grid.minHeight($widget, $height);
			}, 50);
		}

		// AFTER BUILDUP
		$scope.fixGrid = function() {
			$timeout(function() {
				$('.checkboxColor .md-icon').css('background-color', 'transparent');
				$('.checkboxColor.md-checked .md-icon').css('background-color', $rootScope.flat.header_color);
				$('.checkboxColor .md-icon').css('border-color', $rootScope.flat.header_color);
				$('.selectColor .md-on').css('background-color', $rootScope.flat.header_color);
				$('.selectColor .md-off').css('border-color', $rootScope.flat.header_color);
				$('.widgetBtn').css('color', $rootScope.flat.header_color);
				$('.paid .icon').css('color', $rootScope.flat.header_color);
				$grid = $('.grid-stack').data('gridstack');
				$('.grid-stack-item').each(function(){
					$headerHeight = $(this).find('.grid-stack-item-content .widgetHeader').outerHeight();
					$bodyHeight = $(this).find('.grid-stack-item-content .widgetBody').outerHeight();
					$height = Math.ceil(($headerHeight + $bodyHeight)/70);
					if($height <= 3) {
						$height = 4;
					}
					if($(this).attr('data-gs-height') < $height){
						$grid.update($(this), null, null, null, $height);
					}
					$grid.minHeight($(this), $height);
				});
			}, 500);
		}
		$scope.fixGrid();

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
			for($w in $rootScope.flat.widgets){
				$scope.widgetPlaces.push({'id': $rootScope.flat.widgets[$w].id, 'x': $rootScope.flat.widgets[$w].x, 'y': $rootScope.flat.widgets[$w].y});
			}
			saveWidgetPlaces();
		};

		$scope.onGridResizeStop = function(event, ui) {
			changeWidgetSize(ui.element[0].id, ui.element[0].dataset.gsWidth, ui.element[0].dataset.gsHeight);
		};

		// PUSHER
		Pusher.logToConsole = false;
		var pusher = new Pusher('9da7e6891a9c5a3c8896', {
			cluster: 'eu',
			encrypted: true
		});
		
		var channel = pusher.subscribe('habichannel');
		channel.bind('flat-'+$rootScope.flat.flat_token, function(data) {
			if(data.user.id != $rootScope.user.id){
				if(data.reason === 'place'){
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === data.widgets[widget].id) {
							if($rootScope.flat.widgets[widget].x != data.widgets[widget].x || $rootScope.flat.widgets[widget].y != data.widgets[widget].y){
								$rootScope.flat.widgets[widget].x = data.widgets[widget].x;
								$rootScope.flat.widgets[widget].y = data.widgets[widget].y;
								$widget = $('.grid-stack #'+$rootScope.flat.widgets[widget].id);
								$grid = $('.grid-stack').data('gridstack');
								$grid.update($widget, data.widgets[widget].x, data.widgets[widget].y);
							}
						}
					}
				} else if (data.reason === 'size') {
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === data.widget.id){
							$rootScope.flat.widgets[widget].width = data.widget.width;
							$rootScope.flat.widgets[widget].height = data.widget.height;
							$widget = $('.grid-stack #'+data.widget.id);
							$grid = $('.grid-stack').data('gridstack');
							$grid.update($widget, null, null, data.widget.width, data.widget.height);
							break;
						}
					}
				} else if(data.reason === 'toggle') {
					data.widget = JSON.parse(data.widget);
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === data.widget.id){
							$rootScope.flat.widgets[widget].visible = data.widget.visible;
							break;
						}
					}
				} else if(data.reason === 'postWidget') {
					$rootScope.flat.widgets = $rootScope.flat.widgets ? $rootScope.flat.widgets : [];
					data.widget = JSON.parse(data.widget);
					$rootScope.flat.widgets.push(data.widget);
					$rootScope.showNotification(data.user.username + " " + $filter('translate')('ADDED') + " " + $filter('translate')(data.widget.widget_type.toUpperCase())+" widget '"+data.widget.title+"'"+$filter('translate')('ADDED_2')+".", data.widget.id);
					$scope.postLastLogin();
					$scope.fixStyle(data.widget.id);

				} else if(data.reason === 'addItem') {
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === data.item.widget.id){
							$rootScope.flat.widgets[widget].items.push(data.item);
							if(!data.item.title){
								data.item.title = data.item.item;
							}
							$rootScope.showNotification(data.user.username + " " + $filter('translate')('ITEM_ADDED') + " " + $filter('translate')($rootScope.flat.widgets[widget].widget_type.toUpperCase())+" widget '"+$rootScope.flat.widgets[widget].title+"'"+$filter('translate')('ADDED_2')+".", data.item.widget.id);
							$scope.postLastLogin();
							$scope.fixStyle(data.item.widget.id);
							break;
						}
					}
				} else if(data.reason === 'updateItem') {
					data.item = JSON.parse(data.item);
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === data.item.widget){
							if($rootScope.flat.widgets[widget].items.length <= 0){
								for($property in data.item){
									$rootScope.flat.widgets[widget].items[0][$property] = data.item[$property];
								}
							} else {
								for(item in $rootScope.flat.widgets[widget].items){
									if($rootScope.flat.widgets[widget].items[item].id === data.item.id){
										for($property in data.item){
											$rootScope.flat.widgets[widget].items[item][$property] = data.item[$property];
										}
										break;
									}
								}
							}
							break;
						}
					}
					$scope.fixStyle(data.item.widget);
				} else if(data.reason === 'deleteItem') {
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === data.item.widget){
							for(item in $rootScope.flat.widgets[widget].items){
								if($rootScope.flat.widgets[widget].items[item].id === data.item.id){
									$rootScope.flat.widgets[widget].items.splice(item, 1);
									break;
								}
							}
						}
					}
					$scope.fixStyle(data.item.widget);
				}else if(data.reason === 'addCalItem') {
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === data.item.widget.id){
							$rootScope.flat.widgets[widget].items.push(data.item);
							data.item.className = ['newCalItem'];
							data.item.itemId = data.item.id;
							if(!data.item.url){
								data.item.allDay = data.item.all_day;
								$rootScope.flat.widgets[widget].calItems[0].events.push(data.item);
							} else {
								$rootScope.flat.widgets[widget].calItems.push(data.item);
							}
							$rootScope.showNotification(data.user.username + " " + $filter('translate')('ADDED') + " " + $filter('translate')($rootScope.flat.widgets[widget].widget_type.toUpperCase())+" item '"+data.item.title+"'"+$filter('translate')('ADDED_2')+".", data.item.widget.id);
							break;
						}
					}
				} else if(data.reason === 'updateCalItem') {
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === data.item.widget.id){
							for(item in $rootScope.flat.widgets[widget].calItems[0].events){
								if($rootScope.flat.widgets[widget].calItems[0].events[item].itemId === data.item.id){
									$rootScope.flat.widgets[widget].calItems[0].events.splice(item,1);
									data.item.className = ['newCalItem'];
									data.item.itemId = data.item.id;
									data.item.allDay = data.item.all_day;
									data.item.start = moment(data.item.start);
									data.item.end = moment(data.item.end);
									$rootScope.flat.widgets[widget].calItems[0].events.push(data.item);
									break;
								}
							}
						}
					}
				} else if(data.reason === 'deleteCalItem') {
					for(widget in $rootScope.flat.widgets){
						if($rootScope.flat.widgets[widget].id === data.item.widget.id){
							if(data.item.type === 'feed'){
								for(item in $rootScope.flat.widgets[widget].calItems){
									if($rootScope.flat.widgets[widget].calItems[item].itemId === data.item.id){
										$rootScope.flat.widgets[widget].calItems.splice(item,1);
										break;
									}
								}
							} else {
								for(item in $rootScope.flat.widgets[widget].calItems[0].events){
									if($rootScope.flat.widgets[widget].calItems[0].events[item].itemId === data.item.id){
										$rootScope.flat.widgets[widget].calItems[0].events.splice(item,1);
										break;
									}
								}
							}
						}
					}
				} else if(data.reason === 'flatUpdate') {
					for($property in data.flat){
						$rootScope.flat[$property] = data.flat[$property];
					}
					$scope.widgetStyle = {'background-color': data.flat.widget_color, 'color': data.flat.font_color};
					$scope.headerStyle = {'background-color': data.flat.header_color, 'color': data.flat.header_font_color};
				} else if(data.reason === 'backgroundUpdate') {
					$rootScope.flat.background_image = data.background_image;
					$scope.dashboardStyle = {'background-image': 'url(../backend/web/uploads/'+$rootScope.flat.flat_token+'/'+data.background_image+')'};
				} else if(data.reason === 'chat') {
					data.chat = JSON.parse(data.chat);
					data.chat.send = moment(data.chat.send).format('HH:mm DD/MM/YY');
					if($rootScope.flat.chats[$rootScope.flat.chats.length-1].id !== data.chat.id){
						$rootScope.flat.chats.push(data.chat);
						if(!$scope.chat || $location.path() !== '/dasboard'){
							$audio = new Audio('/audio/music_marimba_chord.wav');
							$audio.play();
							$rootScope.flat.chats.new++;
						} else {
							$scope.scrollChat();
							$scope.postLastLogin();
						}
					}
				}
				$scope.$apply();
			}
		});
	}
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

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown", function(e) {
            if(e.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'e': e});
                });
                e.preventDefault();
            }
        });
    };
});

app.directive('recentlyAdded', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    return function(scope, element, attrs) {
		if(moment(attrs.added).isAfter($rootScope.user.last_login)){
			element.addClass("recentlyAdded");
		}
		$timeout(function () { $('.recentlyAdded').css("border", "none") }, 4000);  
    };
}]);

app.directive('imagePreview', ['$rootScope', '$timeout', '$filter', function ($rootScope, $timeout, $filter) {
    return {
        link: function (scope, element, attrs) {
            element.on('change', function  (evt) {
                var file = evt.target.files[0];
				if (file.type.match('image.*')) {
					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function () {
						var img = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
						$("#imgPreview").attr({src: reader.result});
					}
				}
            });
        }
    }
}]);