(function() {
    'use strict';

    angular
        .module('spa-demo.layout')
        .component('sdNavbar', {
            templateUrl: ['APP_CONFIG', function templateUrl(APP_CONFIG) {
                return APP_CONFIG.navbar_html;
            }],
            controller: ['$scope', 'Authn', function NavbarController($scope, Authn) {
                var vm = this;
                vm.getLoginLabel = getLoginLabel;

                vm.$onInit = function() {
                    console.log('NavbarController', $scope);
                }
                return;
                //////////////
                function getLoginLabel() {
                    return Authn.isAuthenticated() ? Authn.getCurrentUserName() : 'Login';
                }
            }]
        });


})();