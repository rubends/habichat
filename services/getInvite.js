app.factory('getInviteService', ['$rootScope','$http', '$cookies', function($rootScope, $http, $cookies) {
	return {
		getInvite: function($key){
            var sUrl = "../backend/web/api/invites/" + $key;
            var oConfig = {
                url: sUrl,
                method: "GET",
                params: {callback: "JSON_CALLBACK"}
            };
            var promise = $http(oConfig).then(function successCallback(response) {
                if (response.data.hasOwnProperty('error')){
                    $rootScope.error = response.data.error;
                }
                else{
                    $rootScope.error = "";
                    $rootScope.invitation = response.data;
                }
            }, function errorCallback(response) {
                console.log(response);
            });
            return promise;
        }
	};
}]);