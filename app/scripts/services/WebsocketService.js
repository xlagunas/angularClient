/*global io*/
(function(){
    'use strict';

    angular.module('angularClientApp')
        .service('WebsocketService', function WebsocketService($log, $rootScope) {

            var socket = io.connect('http://192.168.10.195:3000');

            return {
                on: function (eventName, callback) {
                    socket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                },
                emit: function (eventName, data, callback) {
                    socket.emit(eventName, data, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback.apply(socket, args);
                            }
                        });
                    });
                }
            };
        });

}());
