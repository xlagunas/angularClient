(function() {
    'use strict';

    angular.module('angularClientApp')
        .controller('Conference2Ctrl', ['$scope', '$log', '$stateParams', 'WebsocketService', 'UserService', '$modal','$state',
        function ($scope, $log, $stateParams, WebsocketService, UserService, $modal, $state) {
            $log.log('Carrego el controller');
        }]);

}());
