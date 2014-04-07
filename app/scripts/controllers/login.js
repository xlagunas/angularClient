/*global angular*/
(function () {
    'use strict';


    angular.module('angularClientApp')
        .controller('LoginCtrl', ['$scope', '$log', '$state', '$sessionStorage', 'WebsocketService', 'UserService',
        function ($scope, $log, $state, $sessionStorage, WebsocketService, UserService) {

            $scope.$storage = $sessionStorage;

            if ($scope.$storage.user){
                $log.info('entro al storage!');
                WebsocketService.emit('login', {username:$scope.$storage.user.username, password: $scope.$storage.user.password })
            }

            $scope.loginButton = function () {
                $log.info('Logging in with user and pass');
                WebsocketService.emit('login', $scope.user);
            };

            WebsocketService.on('login', function(retVal){
                $log.info('Entra al onLogin');
                if (retVal.status === 'error'){
                    $log.info(retVal);
                }
                else if (retVal.status === 'success'){
                    $scope.$storage.user = retVal.user;
                    UserService.setSession(retVal.user);
                    $state.go('main.landing');
                }
            });

        }]);

}());