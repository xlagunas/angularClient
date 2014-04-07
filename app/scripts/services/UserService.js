
(function() {
    'use strict';

    angular.module('angularClientApp')
        .service('UserService', ['$log', '_', function UserService($log, _) {
        
            var user = {info:{}, conferencing: false};
            var contacts = {accepted: [], requested: [], pending: [], blocked: []};
            var constraints = { video: true, audio: true};
        
            function addUser(user){
                $log.debug('Adding User');
                var u;
                /**
                 * Checks wether this user exists or not, if exists, don't add it.
                 * */
                u = _.find(contacts, function(existingUser){
                    $log.info(existingUser);
                    return existingUser.info.username === user.username;
                });
        
                if (!u){
                    u = {info: {}};
                    angular.copy(user, u.info);
                    contacts.push(u);
                }
            }
        
            function deleteUser(contactType, user){
                $log.debug('Removing User');
                var filteredContacts = _.filter(contacts[contactType], function(data){
                    return data.username !== user.username;
                });
                angular.copy(filteredContacts, contacts);
            }
        
            function getUsers(){
                return contacts;
            }

            function isConferencing() {
                $log.info('getting conference status');
                return user.conferencing;
            }

            function setConferencing(status) {
                $log.log('setting conference status to '+status);
                user.conferencing = status;
            }
        
            function addUsers(contactType, users){
                $log.info('adding '+contactType+ 'users');
                angular.copy(users, contacts[contactType]);
            }
        
            function setSession(userData) {
                user.info = userData;
            }
        
            function getSession(){
                return user.info;
            }

            function setLocalStream (localStream) {
                $log.debug('Setting localSteram:');
                $log.debug(localStream);
                user.stream = {};
                user.stream = localStream;
            }

            function getLocalStream () {
                $log.debug('Returning stream: ');
                $log.debug(user.stream);
                return user.stream;
            }

            function setConstraints (newConstraints) {
                constraints = newConstraints;
            }

            function getConstraints () {
                return constraints;
            }
        
            return {
                addUser : addUser,
                addUsers: addUsers,
                deleteUser: deleteUser,
                getUsers: getUsers,
                setSession: setSession,
                getSession: getSession,
                setLocalStream: setLocalStream,
                getLocalStream: getLocalStream,
                isConferencing: isConferencing,
                setConferencing: setConferencing,
                getConstraints: getConstraints,
                setConstraints: setConstraints
            };
        }]);

}());