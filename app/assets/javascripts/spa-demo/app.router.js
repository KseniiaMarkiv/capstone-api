(function() {
    'use strict';
    //  'use babel';

    var myApp = angular.module('spa-demo')

    myApp.config(['$stateProvider', '$urlRouterProvider', 'APP_CONFIG', function($stateProvider, $urlRouterProvider, APP_CONFIG) {
        var homeState = {
            name: 'home',
            url: '/',
            templateUrl: APP_CONFIG.main_page_html
        }
        var accountSignup = {
            name: 'accountSignup',
            url: '/signup',
            templateUrl: APP_CONFIG.signup_page_html
        }
        var authnState = {
            name: "authn",
            url: "/authn",
            templateUrl: APP_CONFIG.authn_page_html
        }
        $stateProvider.state(homeState);
        $stateProvider.state(accountSignup);
        $stateProvider.state(authnState);

        $urlRouterProvider.otherwise('/');
    }]);
})();