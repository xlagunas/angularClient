/*global angular*/
(function () {
    'use strict';


    angular.module('angularClientApp')
        .controller('LoginCtrl', function ($scope, $log, $state, WebsocketService, UserService) {
            $scope.loginButton = function () {
                $log.info('Logging in with user and pass');
                $log.info($scope.user);
                WebsocketService.emit('login', $scope.user);

                WebsocketService.on('login', function(retVal){
                    $log.info('Entra al onLogin');
                    if (retVal.status === 'error'){
                        $log.info(retVal);
                    }
                    else if (retVal.status === 'success'){
                        UserService.setSession(retVal.user);
                        $state.go('main.landing');
                    }
                });
//
            };

        });

}());