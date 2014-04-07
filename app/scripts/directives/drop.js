(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('drop', ['$modal', '$stateParams', 'WebsocketService', '$log',
        function ($modal, $stateParams, WebsocketService, $log) {
            return function (scope, element, attrs) {
                element.bind('drop', function(event){
                    event.preventDefault();
                    if (event.dataTransfer.files.length >0){
                        var files = event.dataTransfer.files;
                        console.log('Dropped Files!' +files.length);
                        for(var i=0;i<files.length;i++){
                            var reader = new FileReader();
                            reader.readAsDataURL(files[i]);

                            reader.onprogress = function(event) {
                                console.log('progress'+event);
                            };

                            reader.onload = (function(fileInfo){
                                return function(event){
                                    if (reader.readyState === FileReader.DONE){
                                        console.log(fileInfo);
                                        var dataURL = reader.result;
                                        console.log('file read: '+dataURL);
                                        console.log(reader.result);
                                        var sendObject = {};
                                        sendObject.file = fileInfo;
                                        sendObject.data = dataURL;

                                        download(dataURL, fileInfo.name);
                                    }
                                }
                            }(files[i]));
                        }
                    }
                    else {
                        console.log('Dropped User!');
                        var user = JSON.parse(event.dataTransfer.getData('Text'));
                        $modal.open({
                            templateUrl: 'views/modals/callConfirmation.html',
                            resolve: {
                                user: function() {
                                    return user;
                                }
//                        constraints:
                            },
                            controller: function($scope, $log, user) {
                                $scope.user = user;
                                $scope.confirm = function() {
                                    $scope.$close(true);
                                };
                                $scope.cancel = function() {
                                    $scope.$dismiss();
                                };
                            }
                        })
                        .result.then(function(result){
                            if (result){
                                $log.log(user._id);
                                WebsocketService.emit('call:invite',{id: user._id, call: {type: 'JOIN', id: $stateParams.id}});
                                $log.log('emitted');
                            }
                        });
                    }
                    return false;

                });
                element.bind('dragover', function(event){
                    event.preventDefault();
                });

                function download (data, filename) {
                    var a = document.createElement('a');
                    a.download = filename;
                    a.href = data;
                    a.target = '_blank';

                    var event = document.createEvent('Event');
                    event.initEvent('click', true, true);
                    a.dispatchEvent(event);
                    (window.URL || window.webkitURL).revokeObjectURL(a.href);
                };

                function chunkify (data){
                    var chunkSize = 1000000;

                    var send = {};
                    send.type = 'file';
                    send.data = data.data;
                    send.file = data.file.name;

                    if (send.data.length < chunkSize){
                        send.complete = true;
                    }
                    else{
                        send.complete = false;
                        send.data = send.data.slice(0, chunkSize);

                    }
                    Room.getPeers()[0].dataChannel.send(JSON.stringify(send));
                    data.data = data.data.slice(chunkSize);

                    if (data.data.length){
                        setTimeout(function(){chunkify(data);}, 500);
                    }
                }

            };
        }]);
}());
