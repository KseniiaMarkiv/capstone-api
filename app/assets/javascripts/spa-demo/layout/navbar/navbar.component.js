(function() {
    "use strict";

    angular
        .module("spa-demo.layout")
        .component("sdNavbar", {
            templateUrl: templateUrl,
            controller: NavbarController
        });


    templateUrl.$inject = ["APP_CONFIG"];

    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.navbar_html;
    }

    NavbarController.$inject = ["$scope"];

    function NavbarController($scope) {
        var vm = this;


        vm.$onInit = function() {
            console.log("NavbarController", $scope);
        }
        return;
        //////////////

    }
})();