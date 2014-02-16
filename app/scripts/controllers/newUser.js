(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('NewUserCtrl', function ($scope, $log, $sce, UserService) {
            $scope.checkUsernameAvailable = function() {
                getMedia();
            };

            function getMedia () {
                getUserMedia({video: true, audio: false}, function(localStream) {
                    $scope.$apply(function(){
                        localStream = URL.createObjectURL(localStream);
                        $scope.localStream = $scope.trustSrc(localStream);
                    });

                }, error);
            }

            function error (err) {
                $log.error('webrtc error');
                $log.error(err);
            }

            $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };

        });



}());
