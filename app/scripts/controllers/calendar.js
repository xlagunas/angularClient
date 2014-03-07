(function() {
    'use strict';


    angular.module('angularClientApp')
        .controller('CalendarCtrl', function ($scope, EventService, $log, $modal, WebsocketService) {

            $scope.alertOnEventClick = function(event){

                $modal.open({
                    templateUrl: 'views/modals/addCalendarEvent.html',
                    controller: 'CreateEventCtrl',
                    resolve: {
                        event: function() {
                            return event;
                        }
                    }
                })
                .result.then(function(result) {
                    if (result) {
//                        Create should never be called in that method!
                        if (result.type === 'create'){
                            result.start = result.start -result.start.getTimezoneOffset()*60000;
                            $log.info(result);
                            WebsocketService.emit('calendar:createEvent', result);
                        }
                        else if (result.type === 'delete'){
                            $log.info('entra al delete');
                            $log.info(result);
                            WebsocketService.emit('calendar:removeUser', {id: result._id});
                        }
                    }
                    else{
                        $log.info('no result');
                    }
                });

            };

            $scope.createEvent = function () {
                $modal.open({
                    templateUrl: 'views/modals/addCalendarEvent.html',
                    controller: 'CreateEventCtrl',
                    resolve: {event: {}}
                })
                .result.then(function(result) {
                    if (result) {
                        if (result.type === 'create'){
                            result.start = result.start -result.start.getTimezoneOffset()*60000;
                            $log.info(result);
                            WebsocketService.emit('calendar:createEvent', result);
                        }
//                        delete should never be called in that method!
                        else if (result.type === 'delete'){
                            $log.info('entra al delete');
                            $log.info(result);
                            WebsocketService.emit('calendar:removeUser', {id: result.id});
                        }
                    }
                    else{
                        $log.info('no result');
                    }
                });
            };

            $scope.uiConfig = {
                calendar:{
                    height: 450,
                    editable: false,
                    header:{
                        left: 'title',
                        center: '',
                        right: ''
                    },
                    dayClick: function( date, allDay, jsEvent, view){
                        $scope.$apply(function(){
                            $log.info('click!!');
                            $log.info(date);
                            $log.info(allDay);
                            $log.info(jsEvent);
                            $log.info(view);
                        });

                    },
                    eventClick: function(event, jsEvent, view){
                        $scope.$apply($scope.alertOnEventClick(event,jsEvent, view));
                    }
                }
            };

            $scope.events = {events: EventService.getEvents(), color: 'orange', textColor: 'black'};


            /* Change View */
            $scope.changeView = function(view,calendar) {
                calendar.fullCalendar('changeView',view);
            };
            /* Change View */
            $scope.renderCalender = function(calendar) {
                calendar.fullCalendar('render');
            };

            $scope.prevDay = function(calendar){
                calendar.fullCalendar('prev');
            };
            $scope.nextDay = function(calendar){
                calendar.fullCalendar('next');
            };
            $scope.today = function(calendar){
                calendar.fullCalendar('today');
            };

            $scope.eventSources = [$scope.events];
        });
}());