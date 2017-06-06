app.controller("dialogCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', '$mdDialog', function($rootScope, $scope, $http, $cookies, $location, $mdDialog){
	console.log('dialogCtrl');
    $scope.test = "testeeeet";
    $scope.closeDialog = function() {
        console.log('cancel');
		$mdDialog.cancel();
	};
}]);