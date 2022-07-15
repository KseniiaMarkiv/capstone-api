(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.service('Authn', ['$auth', function($auth) {
        var service = this;
        service.signup = signup;

        return;
        ////////////////

        function signup(registration) {
            return $auth.submitRegistration(registration);
        }
    }])
})();