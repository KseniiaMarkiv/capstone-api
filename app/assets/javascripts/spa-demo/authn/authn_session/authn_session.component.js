(function() {
    "use strict";

    angular
        .module("spa-demo.authn")
        .component("sdAuthnSession", {
            templateUrl: templateUrl,
            controller: AuthnSessionController
        });


    templateUrl.$inject = ["APP_CONFIG"];

    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.authn_session_html;
    }

    AuthnSessionController.$inject = ["$scope", "Authn"];

    function AuthnSessionController($scope, Authn) {
        var vm = this;
        vm.loginForm = {}
        vm.login = login;
        vm.getCurrentUser = Authn.getCurrentUser;
        vm.getCurrentUserName = Authn.getCurrentUserName;

        vm.$onInit = function() {
                console.log("AuthnSessionController", $scope);
            }
            // --------------- this "open" function not need now in 2022 year -----------------
            // vm.$postLink = function() {
            //     vm.dropdown = $("li.dropdown")
            // }
        return;
        //////////////
        function login() {
            //console.log("login");
            Authn.login(vm.loginForm)
                // --------------- this "open" function not need now in 2022 year -----------------
                // .then(
                // function() {
                //     vm.dropdown.removeClass("open");
                // });
        }
    }
})();