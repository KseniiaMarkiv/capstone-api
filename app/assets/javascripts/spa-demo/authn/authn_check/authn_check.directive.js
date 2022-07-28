(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.directive('sdAuthnCheck', function() {
        var directive = {
            bindToController: true,
            controller: 'spa-demo.authn.AuthnCheckController',
            controllerAs: "idVM",
            restrict: "A",
            scope: false, // cuz have child scope
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            console.log("AuthnCheck", scope);
        }
    });
})();