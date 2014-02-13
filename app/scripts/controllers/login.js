/*global angular*/
(function () {
    'use strict';


    angular.module('angularClientApp')
        .controller('LoginCtrl', function ($scope, $log, $state, WebsocketService, UserService) {
            $scope.loginButton = function () {
                $log.info('Logging in with user and pass');
                $log.info($scope.user);
                WebsocketService.emit('login', $scope.user, function(data){
                    $log.info(data);
                    UserService.setSession(data);
                    $state.go('main.landing');
                });
//
            };
            $scope.registerButton = function () {
            };
        });

}());