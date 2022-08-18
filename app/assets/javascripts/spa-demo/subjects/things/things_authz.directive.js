(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .directive("sdThingsAuthz", function ThingsAuthzDirective() {
            var directive = {
                bindToController: true,
                controller: ['$scope', 'ThingsAuthz', function ThingsAuthzController($scope, ThingsAuthz) {
                    var vm = this;
                    vm.authz = {};
                    vm.authz.canUpdateItem = canUpdateItem;


                    ThingsAuthzController.prototype.resetAccess = function() {
                        this.authz.canCreate = false;
                        this.authz.canQuery = false;
                        this.authz.canUpdate = false;
                        this.authz.canDelete = false;
                        this.authz.canGetDetails = false;
                        this.authz.canUpdateImage = false;
                        this.authz.canRemoveImage = false;

                    }

                    activate();
                    return;
                    //////////
                    function activate() {
                        vm.resetAccess();
                        newUser();
                    }

                    function newUser(user, prevUser) {
                        console.log("newUser=", user, ", prev=", prevUser);
                        vm.authz.authenticated = ThingsAuthz.isAuthenticated();
                        if (vm.authz.authenticated) {
                            vm.authz.canQuery = true;
                            vm.authz.canCreate = true;
                            vm.authz.canUpdate = true;
                            vm.authz.canDelete = true;
                            vm.authz.canGetDetails = true;
                            vm.authz.canUpdateImage = true;
                            vm.authz.canRemoveImage = true;

                        } else {
                            vm.resetAccess();
                        }
                    }

                    function canUpdateItem(item) {
                        return ThingsAuthz.isAuthenticated();
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