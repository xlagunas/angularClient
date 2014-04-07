(function (){
    'use strict';

    angular.module('angularClientApp')
        .controller('ManagementCtrl', ['$scope', 'UserService', '$log', 'WebsocketService',
        function ($scope, UserService, $log, WebsocketService) {
            $scope.mngCategories = [
                {category: 'ALL', name: 'all'},
                {category: 'ACCEPTED', name: 'accepted'},
                {category: 'REQUESTED', name: 'requested'},
                {category: 'PENDING', name: 'pending'},
                {category: 'BLOCKED', name: 'blocked'}
            ];
            $scope.mngedContacts = UserService.getUsers();

            $scope.updateContact = function (_id, current, future) {
                var msg = {_id: _id, current: current, future: future};
                $log.info(msg);
                WebsocketService.emit('contacts:update_list',msg);
            };
        }]);

}());
