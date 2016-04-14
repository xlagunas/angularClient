(function() {
    'use strict';

    angular.module('angularClientApp')
      .service('RoomService', function RoomService() {
        var room = {};

        function createRoom () {

        }

        function isRoomPlaying () {

        }

        function addUserToCurrentRoom (user) {

        }

        function joinRoom (idRoom) {

        }

        function leaveRoom () {

        }

        function removeUserFromCurrentRoom (user) {

        }

        return {
            createRoom:createRoom,
            isRoomPlaying: isRoomPlaying,
            addUserToCurrentRoom: addUserToCurrentRoom,
            joinRoom: joinRoom,
            leaveRoom: leaveRoom,
            removeUserFromCurrentRoom: removeUserFromCurrentRoom
        };
    });
}());