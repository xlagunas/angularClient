(function() {
    'use strict';

    angular.module('angularClientApp')
        .service('EventService', ['$log', '_', function EventService($log, _) {
            var events = [];
            var d = new Date();

            function getEvents(){
                return events;
            }

            function addEvents(ev){
                $log.info('Adding User Events: '+ev.length);

                angular.copy(ev, events);
            }

            //day => 0 today, 1 tomorrow, -1 yesterday
            function getConcreteEvents(day) {
                $log.info('requesting concrete Events');

                var ev = _.filter(events, function(event){
                    var date = new Date(event.start);
                    $log.log(date.getDate()+' '+(date.getMonth()+1)+' '+date.getFullYear());

                    return ( date.getDate() === (d.getDate()+day) && (date.getMonth()+1) === (d.getMonth()+1) && date.getFullYear() === d.getFullYear() );
                });
                $log.info(ev);
                return ev;
            }

            return { getEvents: getEvents, addEvents: addEvents, getConcreteEvents: getConcreteEvents};
        }]);
}());
