app.controller("choreCtrl", ['$rootScope', '$scope', '$http', '$mdDialog', function($rootScope, $scope, $http, $mdDialog){
	$scope.showChoreDialog = function(ev, $widgetId) {
		$scope.choreForm = {};
		$scope.choreWidgetId = $widgetId;
		$mdDialog.show({
			controller: () => this,
			controllerAs: 'ctrl',
			templateUrl: 'templates/widgets/forms/choreDialog.html',
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
				$rootScope.error = "";
				$mdDialog.cancel();
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
	
	$scope.deleteChore = function ($widgetId, $choreId){
		var sUrl = $rootScope.apiPath + "/widgets/" + $widgetId + "/chores/" + $choreId;
        var oConfig = {
            url: sUrl,
            method: "DELETE",
			data: $scope.choreForm,
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
							if($rootScope.flat.widgets[widget].items[item].id === $choreId){
								$rootScope.flat.widgets[widget].items.splice(item, 1);
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

	$(".widget").on({
		mouseenter: function () {
			console.log()
			$("."+$(this).attr('class')).css("text-decoration", "line-through");
		},
		mouseleave:function () {
			$("."+$(this).attr('class')).css("text-decoration", "none");
		}
	},'.chore td p');
}]);
