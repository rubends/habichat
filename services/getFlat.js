app.factory('getFlatService', ['$rootScope','$http', '$cookies', "$location", function($rootScope, $http, $cookies, $location) {
	return {
		getFlat: function(){
            var decoded = jwt_decode($cookies.get('token'));
            if(!decoded.flat){
                decoded.flat = $rootScope.user.flat.id;
            }
            if(!$rootScope.flat){
                var sUrl = "../backend/web/api/flats/"+ decoded.flat;
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
                        $rootScope.flat = JSON.parse(response.data);
                    }
                }, function errorCallback(response) {
                    $location.path('/login');
                });
            }
            return promise;
        }
	};
}]);