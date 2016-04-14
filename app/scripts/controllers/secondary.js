/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('SecondaryCtrl', ['$scope', '$log','WebsocketService','UserService',
        function ($scope, $log, WebsocketService,UserService) {
            $log.info('Aquesta és el segon fill');
            $scope.size = {width: '640', height: '480'};
            $scope.user = UserService.getSession();
            $scope.msg = {user: $scope.user, text: 'Hola que tal!'};


            $scope.createEvent = function (){
                $log.info('entra al createDate');
                WebsocketService.emit('calendar:createEvent', {
                    users: UserService.getSession().id,
                    start: Date.now(),
                    end: new Date(2014, 3, 7),
                    title: 'Primer Test',
                    confirmed: false
                });
            };
        }]);
}());