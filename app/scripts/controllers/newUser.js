(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('NewUserCtrl', ['$scope', '$log', '$sce', 'WebsocketService', '$state', 'UserService',
        function ($scope, $log, $sce, WebsocketService, $state, UserService) {

            $scope.form = {invalidUser: false};

            $scope.checkUsernameAvailable = function() {
                WebsocketService.emit('user:existing', {username: $scope.newUser.username});
            };

            $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };

            $scope.createUser = function () {
                $log.info($scope.newUser);
                WebsocketService.emit('user:create', $scope.newUser);
            };

            WebsocketService.on('user:existing', function(data){
                $scope.form = {invalidUser: data};
                $log.debug($scope.form);
            });

            WebsocketService.on('user:create', function(data){
                $log.info(data);
                UserService.setSession(data);
                $state.transitionTo('main.landing');
                $scope.takeImage = true;
            });

            WebsocketService.on('user:createError', function(data){
                $log.info('Error creating user: '+data);
            });

        }]);

}());
