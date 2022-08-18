(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .directive("sdImagesAuthz", function ImagesAuthzDirective() {
            var directive = {
                bindToController: true,
                controller: ['$scope', 'ImagesAuthz', function ImagesAuthzController($scope, ImagesAuthz) {
                    var vm = this;
                    vm.authz = {};
                    vm.authz.canUpdateItem = canUpdateItem;
                    vm.newItem = newItem;

                    activate();
                    return;
                    //////////
                    function activate() {
                        vm.newItem(null);
                    }

                    function newItem(item) {
                        ImagesAuthz.getAuthorizedUser().then(
                            function(user) { authzUserItem(item, user); },
                            function(user) { authzUserItem(item, user); });
                    }

                    function authzUserItem(item, user) {
                        console.log("new Item/Authz", item, user);
                        vm.authz.authenticated = ImagesAuthz.isAuthenticated();
                        vm.authz.canQuery = ImagesAuthz.canQuery();
                        vm.authz.canCreate = ImagesAuthz.canCreate();
                        if (item && item.$promise) {
                            vm.authz.canUpdate = false;
                            vm.authz.canDelete = false;
                            vm.authz.canGetDetails = false;
                            item.$promise.then(function() { checkAccess(item); });
                        } else {
                            checkAccess(item)
                        }
                    }

                    function checkAccess(item) {
                        vm.authz.canUpdate = ImagesAuthz.canUpdate(item);
                        vm.authz.canDelete = ImagesAuthz.canDelete(item);
                        vm.authz.canGetDetails = ImagesAuthz.canGetDetails(item);
                        console.log("checkAccess", item, vm.authz);
                    }

                    function canUpdateItem(item) {
                        return ImagesAuthz.canUpdate(item);
                    }
                }],
                controllerAs: "vm",
                restrict: "A",
                link: link
            };
            return directive;

            function link(scope, element, attrs) {
                console.log("ImagesAuthzDirective", scope);
            }
        });


})();