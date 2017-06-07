app.factory('getUserService', ['$rootScope','$http', '$cookies', '$location', function($rootScope, $http, $cookies, $location) {
	return {
		getUser: function(){
            if ($cookies.get('token')) {
                if(!$rootScope.user || !$rootScope.flat || $rootScope.flat.length == '0') {
                    var sUrl = "../backend/web/api/user";
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
                            console.log(response.data);
                            $rootScope.error = "";
                            $rootScope.user = response.data.user;
                            $rootScope.flat = response.data.flat;
                            $rootScope.calKey = response.data.calKey;
                            $rootScope.user.token = $cookies.get('token');
                            $rootScope.user.loggedIn = true;
                        }
                    }, function errorCallback(response) {
                        console.log("error on login");
                    });
                }
            }
            else{
                $location.path('/login');
            }
            return promise;
        }
	};
}]);