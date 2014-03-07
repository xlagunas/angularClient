(function() {
    'use strict';


    angular.module('angularClientApp')
        .controller('CreateEventCtrl', function($scope, UserService, $log, _, event) {

            if (event){
                $scope.newEvent = event;
                $scope.isNew = false;
                $scope.message = 'Event information';
            }
            else{
                $scope.newEvent = {};
                $scope.isNew = true;
                $scope.message = 'Create new event';
            }

            $log.info('$scope.newEvent: '+$scope.newEvent.title);

            $scope.selectedContacts = [];
            $scope.selfUser = UserService.getSession();
            $scope.selectedContacts.push($scope.selfUser);

            $scope.addUser = function ($item){
                $log.info($item);
                $scope.selectedContacts.push($item);
            };
            $scope.removeUser = function(user){
                $log.info(user);
                $scope.selectedContacts = _.reject($scope.selectedContacts, function(delUser){
                    return user.id === delUser.id;
                });
            };

            $scope.contacts = UserService.getUsers().accepted;

            $scope.today = function() {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.showWeeks = true;
            $scope.toggleWeeks = function () {
                $scope.showWeeks = ! $scope.showWeeks;
            };

            $scope.clear = function () {
                $scope.dt = null;
            };

            $scope.toggleMin = function() {
                $scope.minDate = ( $scope.minDate ) ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = false;
            };

            $scope.dateOptions = {
                'year-format': '\'yy\'',
                'starting-day': 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'dd-MM-yy', 'yyyy-MM-ddTHH:mm:ss.SSSZ'];
            $scope.format = $scope.formats[1];

            $scope.dismiss = function() {
                $log.info('dismiss');
                $scope.$dismiss();
            };

            $scope.save = function() {
                $log.info('save');
                $log.info($scope.newEvent);
                $scope.newEvent.type = 'create';
                $scope.newEvent.users = _.pluck($scope.selectedContacts, 'id');
                $scope.$close($scope.newEvent);
            };

            $scope.delete = function() {
                $scope.newEvent.type = 'delete';
                $log.info('removing event');
                $log.info($scope.newEvent);
                $log.info($scope.type);
                $scope.$close($scope.newEvent);

            };
        });
}());
