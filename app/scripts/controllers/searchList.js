(function() {
    'use strict';

    angular.module('angularClientApp')
        .controller('SearchListCtrl', function ($scope, $log, WebsocketService) {

            $scope.sendRequest = function (contact) {
                WebsocketService.emit('contacts:propose', {_id: contact._id});
            };
        });
}());