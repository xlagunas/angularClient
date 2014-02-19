(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('NewUserCtrl', function ($scope, $log, $sce, WebsocketService, $state, UserService) {

            $scope.form = {invalidUser: false};
            $scope.checkUsernameAvailable = function() {
                $log.debug($scope.form);
                WebsocketService.emit('user:existing', {username: $scope.newUser.username}, function(data){
                    $scope.form = {invalidUser: data};
                    $log.debug($scope.form);
                });
            };

            $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };

            $scope.createUser = function () {
                $log.info($scope.newUser);
                WebsocketService.emit('user:create', $scope.newUser, function(data){
                    $log.info(data);
                    UserService.setSession(data);
                    $state.transitionTo('main.landing');
                });
            };

        });

}());
