app.factory('getUserService', ['$rootScope','$http', '$cookies', '$location', '$filter', function($rootScope, $http, $cookies, $location, $filter) {
	return {
		getUser: function(){
            if ($cookies.get('token')) {
                if(!$rootScope.user || !$rootScope.user.username) {
                    $rootScope.loadScreen = true;
                    var decoded = jwt_decode($cookies.get('token'));
                    var sUrl = "../backend/web/api/users/" + decoded.id;
                    var oConfig = {
                        url: sUrl,
                        method: "GET",
                        params: {callback: "JSON_CALLBACK"},
                        headers: {Authorization: 'Bearer ' + $cookies.get('token')}
                    };
                    var promise = $http(oConfig).then(function successCallback(response) {
                        if (response.data.hasOwnProperty('error')){
                            $rootScope.loadScreen = false;
                            $rootScope.error = $filter('translate')(response.data.error);
                        }
                        else{
                            $rootScope.error = "";
                            $rootScope.user = JSON.parse(response.data.user);
                            $rootScope.calKey = response.data.calKey;
                            $rootScope.user.token = $cookies.get('token');
                            $rootScope.user.loggedIn = true;
                            $rootScope.loadScreen = false;
                        }
                    }, function errorCallback(response) {
                        $location.path('/login');
                    });
                }
            }
            else{
                if($location.path() === '/dasboard' || $location.path() === '/settings'){
                    $location.path('/login');
                }
            }
            return promise;
        }
	};
}]);