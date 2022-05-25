(function() {
    'use strict';
    //  'use babel';

    var myApp = angular.module('spa-demo')

    myApp.config(function($stateProvider, $urlRouterProvider, APP_CONFIG) {
        var aboutState = {
            name: 'home',
            url: '/',
            templateUrl: APP_CONFIG.main_page_html
        }
        $stateProvider.state(aboutState);
        $urlRouterProvider.otherwise('/');
    });
})();