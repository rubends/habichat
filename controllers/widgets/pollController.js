app.controller("pollCtrl", ['$rootScope', '$scope', '$http', '$location', "$filter", function($rootScope, $scope, $http, $location, $filter){
    $scope.getChecked = function($option){
		$voters = $option.voters;
		$hasVoted = false;
        for($voter in $voters){
            if($voters[$voter].id === $rootScope.user.id){
                $hasVoted = true;
				break;
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
				 $rootScope.error = $filter('translate')(response.data.error);
			}
			else{
				$rootScope.error = "";
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$options = JSON.parse(response.data);
						for(option in $options){
							$rootScope.flat.widgets[widget].items[0].options[option].voters = $options[option].voters;
						}
						$scope.fixStyle($widgetId);
					}
				}
			}
		}, function errorCallback(response) {
		    $location.path('/login');
		});
	}
}]);
