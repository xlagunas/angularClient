/*global io*/
(function(){
    'use strict';

    angular.module('angularClientApp')
        .service('WebsocketService', ['$log', '$rootScope', 'SERVER_URL',function WebsocketService($log, $rootScope, SERVER_URL) {

            var socket = io.connect(SERVER_URL);

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
                },
                removeListener: function(eventName, callback) {
                    if (socket.$events && socket.$events[eventName]){
                        delete socket.$events[eventName];
                    }
                }
            };
        }]);

}());
