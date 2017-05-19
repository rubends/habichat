app.controller("inviteCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){
	$scope.joinFlat = function(){
		$invite = {"email": $rootScope.invitation.invite.recipient, "flat": $rootScope.invitation.invite.flat.id, "invitation": $rootScope.invitation.invite.id};
		if($rootScope.invitation.user){
			$location.path('/login');
			$rootScope.userLogin = $invite;
		} else {
			$location.path('/register');
			$rootScope.registerFormUser = $invite;
		}
    }
}]);