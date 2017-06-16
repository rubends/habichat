app.controller("billCtrl", ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout){
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
				$rootScope.error = "";
				$scope.addBillForm = {};
				console.log(response.data);
				for(widget in $rootScope.flat.widgets){
					if($rootScope.flat.widgets[widget].id === $widgetId){
						$rootScope.flat.widgets[widget].items[0] = JSON.parse(response.data);
						$scope.fixStyle($widgetId);
                        break;
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	$scope.setBillAmount= function ($type){
		if($type === 'total'){
			$timeout(function() {
				$divided = $('.billsplitCheck.md-checked').length;
				if($divided >= 1){
					$amount = Number(($scope.addBillForm.amount / $divided).toFixed(2));
					for($user in $rootScope.flat.users){
						$id = $rootScope.flat.users[$user].id;
						if($scope.addBillForm.user[$id]){
							if($scope.addBillForm.user[$id].pay){
								$scope.addBillForm.user[$id].amount = $amount;
							} else {
								$scope.addBillForm.user[$id].amount = 0;
							}
						}
					}
				}
			});
		} else {
			$amount = 0;
			for($user in $rootScope.flat.users){
				$id = $rootScope.flat.users[$user].id;
				if($scope.addBillForm.user[$id]){
					if($scope.addBillForm.user[$id].pay){
						$amount = $amount + $scope.addBillForm.user[$id].amount;
					}
				}
			}
			$scope.addBillForm.amount = $amount;
		}
	}

	$scope.billPaid = function ($widgetId, $billId, $payerId){
		var sUrl = $rootScope.apiPath + "/bills/"+$billId+"/payers/"+$payerId;
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
						$rootScope.flat.widgets[widget].items[0] = JSON.parse(response.data);
						$scope.fixStyle($widgetId);
						break;
					}
				}
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}
}]);
