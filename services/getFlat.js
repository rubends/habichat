app.factory('getFlatService', ['$rootScope','$http', '$cookies', function($rootScope, $http, $cookies) {
	return {
		getFlat: function(){
            var sUrl = "../backend/web/api/user/flat";
            var oConfig = {
                url: sUrl,
                method: "GET",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $cookies.get('token')}
            };
            var promise = $http(oConfig).then(function successCallback(response) {
                if (response.data.hasOwnProperty('error')){
                    $rootScope.error = response.data.error;
                }
                else{
                    $rootScope.error = "";
                    $rootScope.flat = response.data;
                }
            }, function errorCallback(response) {
                console.log(response);
            });
            return promise;
        }
	};
}]);