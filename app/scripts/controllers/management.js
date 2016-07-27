(function (){
    'use strict';

    angular.module('angularClientApp')
        .controller('ManagementCtrl', ['$scope', 'UserService', '$log', 'WebsocketService','SERVER_URL',
        function ($scope, UserService, $log, WebsocketService, SERVER_URL) {

            $log.info('serverUrl: '+SERVER_URL);
            $scope.serverUrl = SERVER_URL;
            $scope.mngCategories = [
                {category: 'ALL', name: 'all'},
                {category: 'ACCEPTED', name: 'accepted'},
                {category: 'REQUESTED', name: 'requested'},
                {category: 'PENDING', name: 'pending'},
                {category: 'BLOCKED', name: 'blocked'}
            ];
            //AQUESTA mngContacts sha de canviar un cop estigui modificada la vista!
            $scope.mngedContacts = UserService.getUsers();
            $scope.contactList = UserService.getUsers();

            $scope.updateContact = function (_id, current, future) {
                var msg = {_id: _id, current: current, future: future};
                $log.info(msg);
                WebsocketService.emit('contacts:update_list',msg);
            };

            $scope.deleteContact = function(contact){
                WebsocketService.emit('contacts:delete', {_id: contact});
            };

            $scope.rejectContact = function(contact){
                WebsocketService.emit('contacts:reject', {_id: contact});
            };

            $scope.acceptContact = function(contact){
                WebsocketService.emit('contacts:accept', {_id: contact});
            };


        }]);

}());
