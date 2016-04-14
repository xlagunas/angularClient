(function(){
    'use strict';


    angular.module('angularClientApp')
        .directive('chat', function () {
            return {
                templateUrl: 'views/directives/chat.html',
                restrict: 'E',
                scope: {
                    user : '=',
                    messages: '=',
                    onNewMessage: '&onNewMessage'
                },
                link: function postLink(scope, element, attrs) {
                    console.log(scope.user);
                    scope.sendMessage = function () {
                        console.log('sending ' + scope.message);
                        scope.onNewMessage({message: scope.message});
                        scope.message = '';
                    };
                    function addSelfMessage (message) {
                        scope.msg.push(
                            {text: 'message',
                             user: attrs.user,
                             own: true
                            }
                        );
                    }
                },
                controller: ['$scope', function($scope) {
                    $scope.show = false;
                    $scope.toggleChat = function () {
                        $scope.show = !$scope.show;
                    };
                }]
            };
        });

})();
