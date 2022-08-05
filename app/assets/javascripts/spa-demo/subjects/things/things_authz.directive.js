(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .directive("sdThingsAuthz", function() {
            var directive = {
                bindToController: true,
                controller: ['$scope', 'Authn', function ThingsAuthzDirective($scope, Authn) {
                    var vm = this;
                    vm.authz = {};
                    vm.authz.authenticated = false;
                    vm.authz.canCreate = false;
                    vm.authz.canQuery = true;
                    vm.authz.canUpdate = false;
                    vm.authz.canDelete = false;
                    vm.authz.canGetDetails = false;
                    vm.authz.canUpdateItem = canUpdateItem;

                    ThingsAuthzDirective.prototype.resetAccess = function() {
                        this.authz.canCreate = false;
                        this.authz.canQuery = true;
                        this.authz.canUpdate = false;
                        this.authz.canDelete = false;
                        this.authz.canGetDetails = true;

                    }

                    activate();
                    return;
                    //////////
                    function activate() {
                        vm.resetAccess();
                        $scope.$watch(Authn.getCurrentUser, newUser);
                    }

                    function newUser(user, prevUser) {
                        console.log("newUser=", user, ", prev=", prevUser);
                        vm.authz.canQuery = true;
                        vm.authz.authenticated = Authn.isAuthenticated();
                        if (vm.authz.authenticated) {
                            vm.authz.canCreate = true;
                            vm.authz.canUpdate = true;
                            vm.authz.canDelete = true;
                            vm.authz.canGetDetails = true;
                        } else {
                            vm.resetAccess();
                        }
                    }

                    function canUpdateItem(item) {
                        return Authn.isAuthenticated();
                    }
                }],
                controllerAs: "vm",
                restrict: "A",
                scope: {
                    authz: "=" // updates parent scope with authz evals
                },
                link: link
            };
            return directive;

            function link(scope, element, attrs) {
                console.log("ThingsAuthzDirective", scope);
            }
        });


})();