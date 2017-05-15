app.factory('getUserService', ['$rootScope','$http', '$cookies', function($rootScope, $http, $cookies) {
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
                        $rootScope.user = response.data;
                        $rootScope.user.token = $cookies.get('token');
                        $rootScope.loggedIn = true;
                        $rootScope.user.loggedIn = true;
                    }
                }, function errorCallback(response) {
                    console.log("error on login");
                });
            }
            else{
                console.log("no cookie");
            }
            return promise;
        }
	};
}]);