(function() {
    'use strict';

    angular.module('angularClientApp')
        .controller('SearchListCtrl', ['$scope', '$log', 'WebsocketService','SERVER_URL',
        function ($scope, $log, WebsocketService, SERVER_URL) {

            $scope.serverUrl = SERVER_URL;
            $scope.sendRequest = function (contact) {
                WebsocketService.emit('contacts:propose', {_id: contact._id});
            };
        }]);
}());
