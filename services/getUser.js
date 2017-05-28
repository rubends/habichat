app.factory('getUserService', ['$rootScope','$http', '$cookies', '$location', function($rootScope, $http, $cookies, $location) {
	return {
		getUser: function(){
            if ($cookies.get('token')) {
                var sUrl = "../backend/web/api/user";
                var oConfig = {
                    url: sUrl,
                    method: "GET",
                    params: {callback: "JSON_CALLBACK"},
                    headers: {Authorization: 'Bearer ' + $cookies.get('token')}
                };
                var promise = $http(oConfig).then(function successCallback(response) {
                    if (response.data.hasOwnProperty('error')){
                        console.log(response.data);
                    }
                    else{
                        console.log(response.data);
                        $rootScope.user = response.data.user;
                        $rootScope.flat = response.data.flat;
                        $rootScope.user.token = $cookies.get('token');
                        $rootScope.loggedIn = true;
                        $rootScope.user.loggedIn = true;
                    }
                }, function errorCallback(response) {
                    console.log("error on login");
                });
            }
            else{
                $location.path('/login');
            }
            return promise;
        }
	};
}]);