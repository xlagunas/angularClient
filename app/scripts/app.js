/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp', [
        'ngCookies',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.calendar',
        'ngStorage',
        'ngMaterial'
    ])
        .config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$sceProvider', '$provide', '$compileProvider', '$mdIconProvider',
        function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $sceProvider, $provide, $compileProvider, $mdIconProvider) {

            $urlRouterProvider.otherwise('/login');

            $stateProvider
                .state('main', {
                    abstract: true,
                    url: '/main',
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .state('main.conference', {
                    url: '/conference/:id',
                    templateUrl: 'views/conference.html',
                    controller: 'ConferenceCtrl'
                })
                .state('main.calendar', {
                    url:'/calendar',
                    templateUrl: 'views/calendar.html',
                    controller: 'CalendarCtrl'
                })
                .state('main.newEvent', {
                    url:'/newEvent',
                    templateUrl: 'views/newEvent.html',
                    controller:'NewEventCtrl'
                })
                .state('main.contact', {
                    url:'/contact/:id',
                    templateUrl: 'views/contact.html',
                    controller: 'ContactCtrl'
                })
                .state('main.management', {
                    url:'/management',
                    templateUrl: 'views/management.html',
                    controller: 'ManagementCtrl'
                })
                .state('main.landing', {
                    url: '/landing',
                    templateUrl: 'views/landing.html',
                    controller: 'LandingCtrl'
                })
                .state('main.secondary', {
                    url: '/secondary',
                    templateUrl: 'views/secondary.html',
                    controller: 'SecondaryCtrl'
                })
                .state('main.search', {
                    url: '/search',
                    templateUrl: 'views/searchList.html',
                    controller: 'SearchListCtrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl'
                })
                .state('newUser', {
                    url: '/create',
                    templateUrl: 'views/newUser.html',
                    controller: 'NewUserCtrl'
                });

            $mdIconProvider
                .defaultFontSet( 'fa' )

            $sceProvider.enabled(true);

            $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(cdn\.)?vb2.i2cat.net/]);
            $compileProvider.aHrefSanitizationWhitelist(/^\s (https|ftp|file|blob):|data:text|data:image|data:application|:\/\/(cdn\.)?vb2.i2cat.net\//);
//            $compileProvider.urlSanitizationWhitelist(/^\s (https|ftp|file|blob):|data:image\//);

            $provide.decorator('$log', ['$delegate', '$sniffer', function($delegate, $sniffer) {
                var _log = $delegate.log; //Saving the original behavior

//                $delegate.log = function(message) { };
//                $delegate.info = function(message) { };
//                $delegate.debug = function(message) { };


                return $delegate;
            }]);
        }])

        .constant('SERVER_URL', 'http://localhost:8000/app');


}());
