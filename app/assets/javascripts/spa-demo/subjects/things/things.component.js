(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .component("sdThingSelector", {
            templateUrl: ["APP_CONFIG", function thingSelectorTemplateUrl(APP_CONFIG) {
                return APP_CONFIG.thing_selector_html;
            }],
            controller: ["$scope", "$stateParams", "Thing", function ThingSelectorController($scope, $stateParams, Thing) {
                var vm = this;

                vm.$onInit = function() {
                    console.log("ThingSelectorController", $scope);
                    if (!$stateParams.id) {
                        vm.items = Thing.query();
                    }
                }
                return;
                //////////////
            }],
            bindings: {
                authz: "<"
            },
        })
        .component("sdThingEditor", {
            templateUrl: ["APP_CONFIG", function thingEditorTemplateUrl(APP_CONFIG) {
                return APP_CONFIG.thing_editor_html;
            }],
            controller: ["$scope", "$state", "$stateParams", "Thing", function ThingEditorController($scope, $state, $stateParams, Thing) {
                var vm = this;
                vm.create = create;
                vm.clear = clear;
                vm.update = update;
                vm.remove = remove;

                vm.$onInit = function() {
                    console.log("ThingEditorController", $scope);
                    if ($stateParams.id) {
                        vm.item = Thing.get({ id: $stateParams.id });
                    } else {
                        newResource();
                    }
                }
                return;
                //////////////
                function newResource() {
                    vm.item = new Thing();
                    return vm.item;
                }

                function clear() {
                    newResource();
                    $state.go(".", { id: null });
                }

                function create() {
                    $scope.thingform.$setPristine();
                    vm.item.errors = null;
                    vm.item.$save().then(
                        function() {
                            $state.go(".", { id: vm.item.id });
                        },
                        handleError);
                }

                function update() {
                    $scope.thingform.$setPristine();
                    vm.item.errors = null;
                    vm.item.$update().then(
                        function() {
                            console.log("Updated complete", vm.item);
                            $state.reload();
                        },
                        handleError);
                }

                function remove() {}

                function handleError(response) {
                    console.log("error", response);
                    if (response.data) {
                        vm.item["errors"] = response.data.errors;
                    }
                    if (!vm.item.errors) {
                        vm.item["errors"] = {}
                        vm.item["errors"]["full_messages"] = [response];
                    }

                }
            }],
            bindings: {
                authz: "<"
            },
        });

})();