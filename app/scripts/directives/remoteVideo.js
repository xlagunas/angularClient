/* global URL, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate */
(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('remoteVideo', function () {
            return {
                scope:  {
                    'height'            :   '@',
                    'width'             :   '@',
                    'user'              :   '=',
                    'conference'        :   '@',
                    'onClose'           :   '=',
                    'onMessageReceived' :   '&'
                },
                transclude: true,
                templateUrl : 'views/directives/remote-video.html',
                restrict: 'E',
                link: function postLink(scope, element) {
                    scope.initPeer();
                    scope.videoElement = element.find('video')[0];

                },
                controller: ['$scope', '$sce', '$log', 'WebsocketService', 'UserService',
                function ($scope, $sce, $log, WebsocketService, UserService) {
                    var dataChannel = {};
                    var servers = {
                        'iceServers': [
                            {'url': 'stun:stun.l.google.com:19302'},
                            {'url': 'stun:stun1.l.google.com:19302'},
                            {'url': 'stun:stun2.l.google.com:19302'},
                            {'url': 'stun:stun3.l.google.com:19302'},
                            {'url': 'stun:stun4.l.google.com:19302'}
                        ]
                    };
                    $scope.files = {};
                    $scope.localUser = UserService.getSession();
                    $scope.isVideo = true;
                    $scope.chat = {msg: ''};
                    $scope.messages = [];

                    $scope.toggleView = function () {
                        $scope.isVideo = !$scope.isVideo;
                    };

                    $scope.initPeer = function () {
                        $scope.peer = new RTCPeerConnection(servers,
                            { optional: [
                                {
                                    DtlsSrtpKeyAgreement: true
                                }
                            ]});

                        $scope.peer.oniceconnectionstatechange = function (){
                            $log.log('iceConnectionState Change');
                            $log.log($scope.peer.iceConnectionState);
                            if ($scope.peer.iceConnectionState === 'disconnected' || $scope.peer.iceConnectionState === 'closed' ){
                                $log.log('finished, notifying parent');
                                $scope.onClose($scope.user.username);
                            }
                        };

                        $scope.peer.onicecandidate = function (event) {
                            if (!$scope.peer || !event || !event.candidate) {
                                return event;
                            }
                            $log.info('Sending Ice Candidate to ' + $scope.user.id);
                            WebsocketService
                                .emit('webrtc:iceCandidate', {idCall: $scope.conference, idUser: $scope.user.id, candidate: event.candidate});

                        };
                        $scope.peer.onsignalingstatechange = function (event) {
                            $log.info('signaling state change');
                            $log.info(event);
                        };

                        $scope.peer.onaddstream = function (stream) {
                            $scope.$apply(function () {
//                                window.URL = window.URL || window.webkitURL;

                                stream = URL.createObjectURL(stream.stream);
                                $log.info(stream);
                                $scope.user.stream = {};
                                $scope.user.stream = $scope.trustSrc(stream);
                            });
                        };
                        $log.info('localStream in directive');
                        $log.info(UserService.getLocalStream());

                        /* Creation of data channel for messaging and file sharing*/

                        dataChannel = $scope.peer.createDataChannel($scope.user.id, {reliable: false});
                        dataChannel.onmessage = handleMessage;

                        dataChannel.onopen = function (event) {
                            $log.log('dataChannel for user ' + $scope.user.id + ' opened');
                        };

                        dataChannel.onclose = function (event) {
                            $log.log('dataChannel for user ' + $scope.user.id + ' closed');
                        };

                        dataChannel.onerror = function (event) {
                            $log.log('dataChannel for user ' + $scope.user.id + ' error');
                        };


                        $scope.peer.ondatachannel = function (event) {
                            $log.log('ondatachannel received');
                            var rcvDataChannel = event.channel;
                            rcvDataChannel.onmessage = handleMessage;

                            rcvDataChannel.onopen = function (event) {
                                $log.log('rcvDataChannel for user ' + $scope.user.id + ' opened');
                            };

                            rcvDataChannel.onerror = function (event) {
                                $log.log('rcvDataChannel for user ' + $scope.user.id + ' error');
                            };

                            dataChannel = rcvDataChannel;
                        };


                        $scope.peer.addStream(UserService.getLocalStream());

                        if ($scope.user.createOffer) {

                            $scope.peer.createOffer(function (sessionDescription) {
                                $log.info('creating offer..');
                                $scope.peer.setLocalDescription(sessionDescription);
                                WebsocketService.emit('webrtc:offer', {idCall: $scope.conference, idUser: $scope.user.id, offer: sessionDescription});
                            }, function (offerFailure) {
                                $log.log(offerFailure);
                            }, {'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true }});
                        }

                        WebsocketService.on($scope.user.id + ':offer', function (msg) {
                            console.log($scope.peer);
                            $log.info($scope.user.id + ':offer incoming message');
                            $log.debug(msg);
                            $log.info('Setting remote description...');
                            $scope.peer.setRemoteDescription(new RTCSessionDescription(msg));
                            $log.info('creating answer...');
                            $scope.peer.createAnswer(function (sessionDescription) {
                                $log.info('Setting local description...');
                                $scope.peer.setLocalDescription(sessionDescription);
                                WebsocketService
                                    .emit('webrtc:answer', {idCall: $scope.conference, idUser: $scope.user.id, answer: sessionDescription});
                            }, function (callbackFailure) {
                                $log.log(callbackFailure);
                            }, {'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true }});
                        });

                        WebsocketService.on($scope.user.id + ':answer', function (msg) {
                            $log.info($scope.user.id + ':response incoming message');
                            $log.debug('----------------------------------');
                            $log.debug('----------------------------------');
                            $log.debug('----------------------------------');
                            $log.debug(msg);
                            $log.debug('----------------------------------');
                            $log.debug('----------------------------------');
                            $log.debug('----------------------------------');
                            $log.info('Setting remote description...');
                            $scope.peer.setRemoteDescription(new RTCSessionDescription(msg));
                        });

                        WebsocketService.on($scope.user.id + ':iceCandidate', function (msg) {
                            $log.info($scope.user.id + ':iceCandidate incoming message');
                            $log.debug(msg);

                            $scope.peer.addIceCandidate(new RTCIceCandidate({
                                'spdMLineIndex': msg.sdpMLineIndex,
                                'candidate': msg.candidate
                            }));

                        });

                    };


                    $scope.trustSrc = function(src) {
                        return $sce.trustAsResourceUrl(src);
                    };

                    $scope.resume = function () {
                        $scope.videoElement.play();
                    };

                    $scope.sendChatMsg = function () {
                        $log.log('sending chat '+$scope.chat.msg);
                        dataChannel.send(JSON.stringify({type: 'chat', msg: $scope.chat.msg}));
                        $scope.messages.push({user: $scope.localUser, text: $scope.chat.msg, imagePos: 'pull-right', textAlign: 'text-right'});
                        $scope.chat = {msg: ''};
                    };

                    function handleMessage (event) {
                        $log.log(event);
                        var msg = JSON.parse(event.data);
                        $log.log(msg);

                        if (msg.type === 'chat'){
                            msg.textAlign = 'text-left';
                            msg.imagePos = 'pull-left';
                            $scope.onMessageReceived({message: msg});
                        }

                        else if (msg.type === 'file') {


                            if (msg.data !== null ){
                                if ($scope.files[msg.file] instanceof Array === false){
                                    $scope.files[msg.file] = [];
                                }
                                $scope.files[msg.file].push(msg.data);
                            }

                            if (msg.complete){
                                $log.log('missatge complet!');
                                var file = $scope.files[msg.file].join('');
                                $log.log(file);
                                $scope.onMessageReceived(
                                    {
                                        message:
                                        {
                                            user:$scope.user,
                                            image: $scope.user.thumbnail,
                                            text: msg.file,
                                            fileType: msg.fileType,
                                            data: file,
                                            imagePos: 'pull-left',
                                            textAlign: 'pull-left'
                                        }
                                    });
                                $log.log($scope.messages);
                            }
                        }
                    }

                    $scope.$on('chatMessage', function(event, data){
                        dataChannel.send(JSON.stringify(data));
                    });

                    $scope.$on('fileMessage', function(event, data){
                        $log.log('fileMessageEvent al remote');
                        chunkify(data);
                    });

                    $scope.debug = function() {
                        $log.log($scope.peer);
                        $scope.peer.close();
                    } ;

                    $scope.$on('exit', function(event, data){
                        $log.log('exit on remoteVideo');

                        if (data._id === $scope.user._id){
                            cleanUp();
                        }
                    });

                    $scope.$on('finish', function(){
                        $log.log('finish event');
                        cleanUp();

                    });

                    function cleanUp() {
                        $scope.peer.close();
                        URL.revokeObjectURL($scope.user.stream);
                        $log.info($scope.user.stream);
                        WebsocketService.removeListener($scope.user.id+':iceCandidate', log);
                        WebsocketService.removeListener($scope.user.id+':offer', log);
                        WebsocketService.removeListener($scope.user.id+':answer', log);
                    }

                    function log (data) {
                        $log.log(data);
                    }

                    function chunkify (data){
                        var chunkSize = 63500;

                        var send = {};
                        send.type = 'file';
                        send.data = data.data;
                        send.file = data.file.name;
                        send.fileType = data.file.type;

                        if (send.data.length < chunkSize){
                            send.complete = true;
                        }
                        else{
                            send.complete = false;
                            send.data = send.data.slice(0, chunkSize);

                        }
                        dataChannel.send(JSON.stringify(send));
                        data.data = data.data.slice(chunkSize);

                        if (data.data.length){
                            setTimeout(function(){
                                chunkify(data);
                            }, 500);
                        }
                    }
                }]
            };

        });


}());
