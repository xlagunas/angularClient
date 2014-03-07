(function() {
    'use strict';

    angular.module('angularClientApp')
        .service('EventService', function EventService($log) {
            var events = [];

            function getEvents(){
                return events;
            }

            function addEvents(ev){
                $log.info('Adding User Events: '+ev.length);

                angular.copy(ev, events);
            }

            return { getEvents: getEvents, addEvents: addEvents};
        });
}());
