
(function() {
    'use strict';

    angular.module('angularClientApp')
        .service('UserService', function UserService($log, _) {
        
            var user = {};
            var contacts = {accepted: [], requested: [], pending: [], blocked: []};
        
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
        
            return {
                addUser : addUser,
                addUsers: addUsers,
                deleteUser: deleteUser,
                getUsers: getUsers,
                setSession: setSession,
                getSession: getSession,
                setLocalStream: setLocalStream,
                getLocalStream: getLocalStream
            };
        });

}());