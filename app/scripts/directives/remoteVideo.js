(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('remoteVideo', function () {
            return {
                scope:  {
                    'height'        :   '@',
                    'width'         :   '@',
                    'user'          :   '=',
                    'constraints'   :   '=',
                    'conference'    :   '@'
                },
                templateUrl : 'views/directives/remote-video.html',
                restrict: 'E',
                link: function postLink(scope, element) {
                    scope.initPeer();
                    scope.videoElement = element.find('video')[0];

                },
                controller: function ($scope, $sce, $log, WebsocketService, UserService) {
                    var servers = {
                        'iceServers' : [
                            {'url' : 'stun:stun.l.google.com:19302'},
                            {'url' : 'stun:stun1.l.google.com:19302'},
                            {'url' : 'stun:stun2.l.google.com:19302'},
                            {'url' : 'stun:stun3.l.google.com:19302'},
                            {'url' : 'stun:stun4.l.google.com:19302'}
                        ]
                    };

                    $scope.debug = function() {
                        $log.info($scope.peer);
                    } ;
                    $scope.initPeer = function () {

                        $scope.peer = new RTCPeerConnection(servers,
                        { optional:[
                            {
                                DtlsSrtpKeyAgreement: true
                            },
                            {
                                RtpDataChannels: false
                            }
                        ]});

                        $scope.peer.onicecandidate = function(event){
                            if (!$scope.peer || !event || !event.candidate) return;
                            $log.info('Sending Ice Candidate to '+$scope.user.id);
                            WebsocketService
                                .emit('webrtc:iceCandidate', {idCall: $scope.conference, idUser: $scope.user.id, candidate: event.candidate});

                        };
                        $scope.peer.onaddstream = function(stream){
                            $scope.$apply(function(){
//                                window.URL = window.URL || window.webkitURL;
                                stream = URL.createObjectURL(stream.stream);
                                $log.info(stream);
                                $scope.user.stream = {};
                                $scope.user.stream = $scope.trustSrc(stream);
                            });
                        };
                        $log.info('localStream in directive');
                        $log.info(UserService.getLocalStream());

                        $scope.peer.addStream(UserService.getLocalStream());

                        if ($scope.user.createOffer){
                            $scope.peer.createOffer(function(sessionDescription) {
                                $log.info('creating offer..');
                                $scope.peer.setLocalDescription(sessionDescription);
                                WebsocketService
                                    .emit('webrtc:offer', {idCall: $scope.conference, idUser: $scope.user.id, offer: sessionDescription});
                            }, function(offerFailure){
                                $log.error(offerFailure);
                            }, {'mandatory': { 'OfferToReceiveAudio':true, 'OfferToReceiveVideo': true }});
                        }
                    };

                    WebsocketService.on($scope.user.id+':offer', function(msg){
                        console.log($scope.peer);
                        $log.info($scope.user.id+':offer incoming message');
                        $log.debug(msg);
                        $log.info('Setting remote description...');
                        $scope.peer.setRemoteDescription(new RTCSessionDescription(msg));
                        $log.info('creating answer...');
                        $scope.peer.createAnswer(function(sessionDescription){
                            $log.info('Setting local description...');
                            $scope.peer.setLocalDescription(sessionDescription);
                            WebsocketService
                                .emit('webrtc:answer', {idCall: $scope.conference, idUser: $scope.user.id, answer: sessionDescription});
                        }, function (callbackFailure) {
                            $log.error(callbackFailure);
                        }, {'mandatory': { 'OfferToReceiveAudio':true, 'OfferToReceiveVideo': true }});
                    });

                    WebsocketService.on($scope.user.id+':answer', function(msg){
                        $log.info($scope.user.id+':response incoming message');
                        $log.debug(msg);
                        $log.info('Setting remote description...');
                        $scope.peer.setRemoteDescription(new RTCSessionDescription(msg));
                    });

                    WebsocketService.on($scope.user.id+':iceCandidate', function(msg){
                        $log.info($scope.user.id+':iceCandidate incoming message');
                        $log.debug(msg);
                        $scope.peer.addIceCandidate(new RTCIceCandidate({
                            'spdMLineIndex' : msg.sdpMLineIndex,
                            'candidate': msg.candidate
                        }));

                    });


                    $scope.trustSrc = function(src) {
                        return $sce.trustAsResourceUrl(src);
                    };

                    $scope.resume = function () {
                        $scope.videoElement.play();
                    };
                }
            };
        });

}());
