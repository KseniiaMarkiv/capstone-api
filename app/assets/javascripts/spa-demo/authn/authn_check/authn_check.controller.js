(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.controller('spa-demo.authn.AuthnCheckController', ['$auth', 'spa-demo.authn.whoAmI', 'spa-demo.authn.checkMe', function($auth, whoAmI, checkMe) {
        var vm = this;
        vm.client = {}
        vm.server = {}
        vm.getClientUser = getClientUser;
        vm.whoAmI = getServerUser;
        vm.checkMe = checkServerUser;

        return;
        //////////////
        function getClientUser() {
            vm.client.currentUser = $auth.user;
        }

        function getServerUser() {
            vm.server.whoAmI = null;
            whoAmI.get().$promise.then(
                function(value) { vm.server.whoAmI = value; },
                function(value) { vm.server.whoAmI = value; }
            );
        }

        function checkServerUser() {
            vm.server.checkMe = null;
            checkMe.get().$promise.then(
                function(value) { vm.server.checkMe = value; },
                function(value) { vm.server.checkMe = value; }
            );
        }
    }])
})();