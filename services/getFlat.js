app.factory('getFlatService', ['$rootScope','$http', '$cookies', "$location", function($rootScope, $http, $cookies, $location) {
	return {
		getFlat: function(){
            $token = $cookies.get('token');
            var decoded = jwt_decode($token);
            if(!decoded.flat){
                if(!$rootScope.user || !$rootScope.user.flat){
                    var sUrl = "../backend/web/api/flats";
                } else {
                    var sUrl = "../backend/web/api/flats/"+ $rootScope.user.flat.id;
                }
            } else {
                var sUrl = "../backend/web/api/flats/"+ decoded.flat;
            }
            if(!$rootScope.flat){
                var oConfig = {
                    url: sUrl,
                    method: "GET",
                    params: {callback: "JSON_CALLBACK"},
                    headers: {Authorization: 'Bearer ' + $token}
                };
                var promise = $http(oConfig).then(function successCallback(response) {
                    if (response.data.hasOwnProperty('error')){
                        $rootScope.error = response.data.error;
                    }
                    else{
                        $rootScope.error = "";
                        if(!response.data){
                            $location.path('/flat');
                        } else {
                            $rootScope.flat = JSON.parse(response.data);
                        }
                    }
                }, function errorCallback(response) {
                    $location.path('/login');
                });
            }
            return promise;
        }
	};
}]);