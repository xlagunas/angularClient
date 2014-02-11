
(function() {
    'use strict';

    angular.module('angularClientApp')
        .service('UserService', function UserService($log, _) {
        
            var user = {};
            var contacts = [];
        
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
        
            function deleteUser(user){
                $log.debug('Removing User');
                var filteredContacts = _.filter(contacts, function(data){
                    return data.info.username != user.username;
                });
                angular.copy(filteredContacts, contacts);
            }
        
            function getUsers(){
                $log.debug('Retrieving users...');
                return contacts;
            }
        
            function addUsers(users){
                $log.info('adding users');
                angular.copy(users, contacts);
            }
        
            function setSession(userData) {
                user = userData;
            }
        
            function getSession(){
                return user;
            }
        
            return {
                addUser : addUser,
                addUsers: addUsers,
                deleteUser: deleteUser,
                getUsers: getUsers,
                setSession: setSession,
                getSession: getSession
            };
        });

}());