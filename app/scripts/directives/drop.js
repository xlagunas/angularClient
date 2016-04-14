(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('drop', ['$modal', '$stateParams', 'WebsocketService', '$log',
        function ($modal, $stateParams, WebsocketService, $log) {
            return {
                scope: {onDropFile : '&'},
                link: function (scope, element, attrs) {
                    element.bind('drop', function(event){
                        event.preventDefault();
                        if (event.dataTransfer.files.length >0){
                            var files = event.dataTransfer.files;
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

                                            scope.$apply(function() {
                                                scope.onDropFile({file: sendObject});
                                            });
                                        }
                                    };
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

                }

            };
        }]);
}());
