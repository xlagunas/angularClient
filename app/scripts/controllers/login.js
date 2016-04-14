/*global angular*/
(function () {
    'use strict';


    angular.module('angularClientApp')
        .controller('LoginCtrl', ['$scope', '$log', '$state', '$sessionStorage', 'WebsocketService', 'UserService',
        function ($scope, $log, $state, $sessionStorage, WebsocketService, UserService) {
            //if LDAP user is logged, no password is returned. It is needed afterwards on a reconnect event, so it is
            //retrieved only to save it in session
            var password;
            $scope.$storage = $sessionStorage;

            if ($scope.$storage.user){
                $log.info('entro al storage!');
                $log.info($scope.$storage.user);
                password = $scope.$storage.user.password;
                WebsocketService.emit('login', {username:$scope.$storage.user.username, password: $scope.$storage.user.password });
            }

            $scope.loginButton = function () {
                $log.info('Logging in with user and pass');
                password = $scope.user.password;
                WebsocketService.emit('login', $scope.user);
            };

            WebsocketService.on('login', function(retVal){
                $log.info('Entra al onLogin');
                if (retVal.status === 'error'){
                    $log.info(retVal);
                }
                else if (retVal.status === 'success'){
                    if (retVal.user.isLdap){
                        retVal.user.password = password;
                        $log.info(retVal.user);
                    }
                    $scope.$storage.user = retVal.user;
                    UserService.setSession(retVal.user);
                    $state.go('main.landing');
                }
            });

        }]);

}());