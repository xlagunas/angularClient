(function() {
    'use strict';

    angular.module('angularClientApp')
        .controller('ConferenceCtrl', function ($scope, $log, $stateParams, WebsocketService, UserService) {
            $scope.speakers = [];
            $scope.localSpeaker = UserService.getSession();
            $scope.conference = {id: $stateParams.id};
            $log.info($scope.conference);

            $scope.onSuccess = function(localStream) {
                $log.info('Entro al onSuccess!!!!');
                UserService.setLocalStream(localStream);

                WebsocketService.emit('call:register', {id: $stateParams.id});

            };

            $scope.onError = function() {
                $log.info('Entro al onError :(:(:(');
            };

            WebsocketService.on('call:addUser', function (user){
                $log.info('new User added to conference');
                $log.info(user);
                WebsocketService.emit('call:userDetails', {idCall: $stateParams.id, idUser: user.id});

                //In the directive will look at this field to create an offer or wait for one
                user.createOffer = true;
                $scope.speakers.push(user);

            });

            WebsocketService.on('call:userDetails', function (user){
                $log.info('call to userDetails');
                $log.info(user);
                user.createOffer = false;
                $scope.speakers.push(user);
            });

        });

}());
