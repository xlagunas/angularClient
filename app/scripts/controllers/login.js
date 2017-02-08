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

            WebsocketService.on('login', function(user){
                $scope.$storage.user = user;
                UserService.setSession(user);
                $state.go('main.landing');
            });

            WebsocketService.on('loginError', function(data){
                $log.info(data);
                $scope.user.username = '';
                $scope.user.password = '';
            });

        }]);

}());
