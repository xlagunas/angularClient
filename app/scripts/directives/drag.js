(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('drag', function () {
            return {
                restrict: 'A',
                require: 'contact-item',
                scope: false,
                link: function postLink(scope, element) {
                    element.attr('draggable',true);

                    element.bind('dragstart', function(event){
                        console.log('sending a dragStartEvent');
                        console.log(scope.contact);
                        event.originalEvent.dataTransfer.setData('Text', JSON.stringify(scope.contact));

                    });
                }
            };
        });
}());
