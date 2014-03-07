/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('SecondaryCtrl', function ($scope, $log, WebsocketService,UserService) {
            $log.info('Aquesta és el segon fill');

            $scope.createEvent = function (){
                $log.info('entra al createDate');
                WebsocketService.emit('calendar:createEvent', {
                    users: UserService.getSession().id,
                    start: Date.now(),
                    end: new Date(2014, 3, 7),
                    title: 'Primer Test',
                    confirmed: false
                });
            }
        });
}());