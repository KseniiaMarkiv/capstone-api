(function() {
    'use strict';

    angular.module('spa-demo', [
        'ui.router',
        'spa-demo.config',
        'spa-demo.authn',
        "spa-demo.authz",
        'spa-demo.layout',
        'spa-demo.foos',
        'spa-demo.subjects'
    ]);

})();
(function() {
    'use strict';
    //  'use babel';

    var myApp = angular.module('spa-demo')

    myApp.config(['$stateProvider', '$urlRouterProvider', 'APP_CONFIG', function($stateProvider, $urlRouterProvider, APP_CONFIG) {
        var homeState = {
            name: 'home',
            url: '/',
            templateUrl: APP_CONFIG.main_page_html
        }
        var accountSignup = {
            name: 'accountSignup',
            url: '/signup',
            templateUrl: APP_CONFIG.signup_page_html
        }
        var authnState = {
            name: "authn",
            url: "/authn",
            templateUrl: APP_CONFIG.authn_page_html
        }
        var imageState = {
            name: "images",
            url: "/images/:id",
            templateUrl: APP_CONFIG.images_page_html
        }
        var thingState = {
            name: "things",
            url: "/things/:id",
            templateUrl: APP_CONFIG.things_page_html
        }
        $stateProvider.state(homeState);
        $stateProvider.state(accountSignup);
        $stateProvider.state(authnState);
        $stateProvider.state(imageState);
        $stateProvider.state(thingState);

        $urlRouterProvider.otherwise('/');
    }]);
})();
(function() {
  "use strict";

  angular
    .module("spa-demo.config", [])
    .constant('APP_CONFIG', {
      'server_url': "",
      'main_page_html': '/assets/spa-demo/pages/main-aaeae593a605cc2b0bece3fd21beb0b78f7d55d886f1de9abc1e119cb86988c9.html',
      'navbar_html': '/assets/spa-demo/layout/navbar/navbar-00827bd172c0336782915c5195d94dd5bdea85d67690a02de9f166a32dc16e14.html',
      'signup_page_html': "/assets/spa-demo/pages/signup_page-b2723361761ce4e347c67112b0d11adeee5e35d061c16c6f0cffcd1fc6ddfde4.html",
      'authn_signup_html': "/assets/spa-demo/authn/signup/signup-d9ad98c5d70ede0142401aa2040fb392d41164dd585c66deda52f46d2728036f.html",
      'authn_session_html': "/assets/spa-demo/authn/authn_session/authn_session-89d2f8951f13657ffc005ab328f4f4cd6953868b5b9851d0a5a1d972018f8e54.html",
      'authn_page_html': "/assets/spa-demo/pages/authn_page-b369675392e053c2c3c48af34484a700e433fcc7b9b731037aa851b168c9168c.html",
      'images_page_html': "/assets/spa-demo/pages/images_page-f3affa16f8e89a65a3d623f0e6ece3a9cb27a81807d20c41ffeeb63550718929.html",
      'image_selector_html': "/assets/spa-demo/subjects/images/image_selector-083decd045cc67de243f308f0c9e94c67b2ebda758270c8a39df2fc9a9d96d98.html",
      'image_editor_html': "/assets/spa-demo/subjects/images/image_editor-945dbb930d6cf3a8cf367db9d97321380f1afc02ee9d92423bdf6d278def65e4.html",
      'things_page_html': "/assets/spa-demo/pages/things_page-5600694cd4bc8ee18089b8b48e176a5a6693dfce34b09046d9d32b229fbd66ff.html",
      'thing_selector_html': "/assets/spa-demo/subjects/things/thing_selector-209da3067772af0dc6bca67a08000afbf6a7f9373da13f5e03ffe571bd332c14.html",
      'thing_editor_html': "/assets/spa-demo/subjects/things/thing_editor-d51caaaa1a71634061346c4506b059e812808dfddf1d5dd6d35a0705cc9b69c4.html",
      
      'foos_html': "/assets/spa-demo/foos/foos-881e3113f9cba12c5050386f3500877e9b58e776a7b0cba42cb4ebdf187690a4.html",

      })

})();
(function() {
  "use strict";

  angular
    .module("spa-demo.authn", [
      "ng-token-auth"
    ]);
})();
(function() {
    "use strict";

    var myApp = angular.module('spa-demo.authn')
    myApp.config(['$authProvider', 'APP_CONFIG', function($authProvider, APP_CONFIG) {
        $authProvider.configure({
            apiUrl: APP_CONFIG.server_url
        });
    }]);

})();
(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.service('Authn', ['$auth', '$q', function($auth, $q) {
        var service = this;
        service.signup = signup;
        service.user = null;
        service.isAuthenticated = isAuthenticated;
        service.getCurrentUser = getCurrentUser;
        service.getCurrentUserName = getCurrentUserName;
        service.getCurrentUserId = getCurrentUserId;
        service.login = login;
        service.logout = logout;

        activate();
        return;
        ////////////////
        function activate() {
            $auth.validateUser().then(
                function(user) {
                    service.user = user;
                    console.log("validated user", user);
                });
        }

        function signup(registration) {
            return $auth.submitRegistration(registration);
        }

        function isAuthenticated() {
            return service.user != null && service.user["uid"] != null;
        }

        function getCurrentUserName() {
            return service.user != null ? service.user.name : null;
        }

        function getCurrentUserId() {
            return service.user != null ? service.user.id : null;
        }

        function getCurrentUser() {
            return service.user;
        }

        function login(credentials) {
            console.log("login", credentials.email);
            var result = $auth.submitLogin({
                email: credentials["email"],
                password: credentials["password"]
            });
            var deferred = $q.defer();
            result.then(
                function(response) {
                    console.log("login complete", response);
                    service.user = response;
                    deferred.resolve(response);
                },
                function(response) {
                    var formatted_errors = {
                        errors: {
                            full_messages: response.errors
                        }
                    };
                    console.log("login failure", response);
                    deferred.reject(formatted_errors);
                });
            return deferred.promise;
        }

        function logout() {
            console.log("logout");
            var result = $auth.signOut();
            result.then(
                function(response) {
                    service.user = null;
                    console.log("logout complete", response);
                },
                function(response) {
                    service.user = null;
                    console.log("logout failure", response);
                    alert(response.status + ":" + response.statusText);
                });
            return result;
        }
    }])
})();
(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.factory('spa-demo.authn.whoAmI', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/authn/whoami");
    }]);
})();
(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authn")
    myApp.factory('spa-demo.authn.checkMe', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/authn/checkme");
    }]);
})();
(function() {
    "use strict";

    angular
        .module("spa-demo.authn")
        .component("sdSignup", {
            templateUrl: templateUrl,
            controller: SignupController,
        });


    templateUrl.$inject = ['APP_CONFIG'];

    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.authn_signup_html;
    }

    SignupController.$inject = ['$scope', '$state', 'Authn'];

    function SignupController($scope, $state, Authn) {
        var vm = this;
        vm.signupForm = {}
        vm.signup = signup;

        vm.$onInit = function() {
            console.log("SignupController", $scope);
        }
        return;
        //////////////
        function signup() {
            console.log("signup...");
            $scope.signup_form.$setPristine();
            Authn.signup(vm.signupForm).then(
                function(response) {
                    vm.id = response.data.data.id;
                    console.log("signup complete", response.data, vm);
                    $state.go("home");
                },
                function(response) {
                    vm.signupForm["errors"] = response.data.errors;
                    console.log("signup failure", response, vm);
                }
            );
        }

    }
})();
(function() {
    "use strict";

    angular
        .module("spa-demo.authn")
        .component("sdAuthnSession", {
            templateUrl: ["APP_CONFIG", function templateUrl(APP_CONFIG) {
                return APP_CONFIG.authn_session_html;
            }],
            controller: ["$scope", "Authn", function AuthnSessionController($scope, Authn) {
                var vm = this;
                vm.loginForm = {}
                vm.login = login;
                vm.logout = logout;
                vm.getCurrentUser = Authn.getCurrentUser;
                vm.getCurrentUserName = Authn.getCurrentUserName;

                vm.$onInit = function() {
                    console.log("AuthnSessionController", $scope);
                }
                vm.$postLink = function() {
                    vm.dropdown = $("#login-dropdown")
                }
                return;
                //////////////
                function login() {
                    console.log("login");
                    $scope.login_form.$setPristine();
                    vm.loginForm["errors"] = null;
                    Authn.login(vm.loginForm).then(
                        function() {
                            vm.dropdown.removeClass("open");
                        },
                        function(response) {
                            vm.loginForm["errors"] = response.errors;
                        });
                }

                function logout() {
                    Authn.logout().then(
                        function() {
                            vm.dropdown.removeClass("open");
                        });
                }
            }],
        });

})();
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
(function() {
  "use strict";

  angular
    .module("spa-demo.authz", [
    ]);
})();
(function() {
    "use strict";

    angular.module('spa-demo.layout', []);
})();
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
(function() {
    'use strict';

    angular.module('spa-demo.foos', [
        'ngResource'
    ]);
})();
(function() {
    'use strict';

    var myApp = angular.module('spa-demo.foos');
    myApp.factory('spa-demo.foos.Foo', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {

        return $resource(APP_CONFIG.server_url + '/api/foos/:id', { id: '@id' }, {
            update: { method: 'PUT' },
            save: {
                method: "POST",
                transformRequest: buildNestedBody
            }
        });
    }]);
    //nests the default payload below a "foo" element 
    //as required by default by Rails API resources
    function buildNestedBody(data) {
        return angular.toJson({ foo: data })
    }

})();
(function() {
    "use strict";

    var myApp = angular.module('spa-demo.foos');

    myApp.controller('FoosController', ['spa-demo.foos.Foo', function(Foo) {
        var vm = this;
        vm.foos;
        vm.foo;
        vm.edit = edit;
        vm.create = create;
        vm.update = update;
        vm.remove = remove;

        activate();
        return;
        ////////////////
        function activate() {
            newFoo();
            vm.foos = Foo.query();
        }

        function newFoo() {
            vm.foo = new Foo();
        }

        function handleError(response) {
            console.log(response);
        }

        function edit(object) {
            console.log('selected', object)
            vm.foo = object;
        }

        function create() {
            console.log("creating foo", vm.foo);
            vm.foo.$save()
                .then(function(response) {
                    //console.log(response);
                    vm.foos.push(vm.foo);
                    newFoo();
                })
                .catch(handleError);
        }

        function update() {
            //console.log("update", vm.foo);
            vm.foo.$update()
                .then(function(response) {
                    //console.log(response);
                })
                .catch(handleError);
        }

        function remove() {
            //console.log("remove", vm.foo);
            vm.foo.$delete()
                .then(function(response) {
                    //console.log(response);
                    //remove the element from local array
                    removeElement(vm.foos, vm.foo);
                    // vm.foos = Foo.query();
                    //replace edit area with prototype instance
                    newFoo();
                })
                .catch(handleError);
        }


        function removeElement(elements, element) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].id == element.id) {
                    elements.splice(i, 1);
                    break;
                }
            }
        }
    }]);

})();
(function() {
    "use strict";

    var myApp = angular.module('spa-demo.foos')
    myApp.directive('sdFoos', ['APP_CONFIG', function(APP_CONFIG) {
        var directive = {
            templateUrl: APP_CONFIG.foos_html,
            replace: true,
            bindToController: true,
            controller: 'FoosController',
            controllerAs: 'foosVM',
            restrict: 'E',
            scope: {},
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            console.log('sdFoos', scope);
        }
    }]);

})();
(function() {
  "use strict";

  angular
    .module("spa-demo.subjects", []);
})();
(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .component("sdImageSelector", {
            templateUrl: ["APP_CONFIG", function imageSelectorTemplateUrl(APP_CONFIG) {
                return APP_CONFIG.image_selector_html;
            }],
            controller: ["$scope", "$stateParams", "Image", function ImageSelectorController($scope, $stateParams, Image) {
                var vm = this;

                vm.$onInit = function() {
                    console.log("ImageSelectorController", $scope);
                    if (!$stateParams.id) {
                        vm.items = Image.query();
                    }
                }
                return;
                //////////////
            }],
            bindings: {
                authz: "<"
            },
        })
        .component("sdImageEditor", {
            templateUrl: ["APP_CONFIG", function imageEditorTemplateUrl(APP_CONFIG) {
                return APP_CONFIG.image_editor_html;
            }],
            controller: ["$scope", "$q", "$state", "$stateParams", "Image", "ImageLinkableThing", "ImageThing", function ImageEditorController($scope, $q, $state, $stateParams, Image, ImageLinkableThing, ImageThing) {
                var vm = this;
                vm.create = create;
                vm.clear = clear;
                vm.update = update;
                vm.remove = remove;
                vm.linkThings = linkThings;

                vm.$onInit = function() {
                    console.log("ImageEditorController", $scope);
                    if ($stateParams.id) {
                        // reload($stateParams.id);
                        $scope.$watch(function() { return vm.authz.authenticated },
                            function() { reload($stateParams.id); });
                    } else {
                        newResource();
                    }
                }
                return;
                //////////////
                function newResource() {
                    vm.item = new Image();
                    return vm.item;
                }

                function reload(imageId) {
                    var itemId = imageId ? imageId : vm.item.id;
                    console.log("reloading image", itemId);
                    vm.item = Image.get({ id: itemId });
                    vm.things = ImageThing.query({ image_id: itemId });
                    vm.linkable_things = ImageLinkableThing.query({ image_id: itemId });
                    $q.all([vm.item.$promise,
                        vm.things.$promise
                    ]).catch(handleError);
                }

                function clear() {
                    newResource();
                    $state.go(".", { id: null });
                }

                function create() {
                    // vm.item.errors = null;
                    vm.item.$save().then(
                        function() {
                            $state.go(".", { id: vm.item.id });
                        },
                        handleError);
                }

                function update() {
                    vm.item.errors = null;
                    var update = vm.item.$update();
                    linkThings(update);
                }

                function linkThings(parentPromise) {
                    var promises = [];
                    if (parentPromise) { promises.push(parentPromise); }
                    angular.forEach(vm.selected_linkables, function(linkable) {
                        var resource = ImageThing.save({ image_id: vm.item.id }, { thing_id: linkable });
                        promises.push(resource.$promise);
                    });

                    vm.selected_linkables = [];
                    //console.log("waiting for promises", promises);
                    $q.all(promises).then(
                        function(response) {
                            //console.log("promise.all response", response); 
                            $scope.imageform.$setPristine();
                            reload();
                        },
                        handleError);
                }

                function remove() {
                    vm.item.errors = null;
                    vm.item.$delete().then(
                        function() {
                            console.log("remove complete", vm.item);
                            clear();
                        },
                        handleError);
                }

                function handleError(response) {
                    console.log("error", response);
                    if (response.data) {
                        vm.item["errors"] = response.data.errors;
                    }
                    if (!vm.item.errors) {
                        vm.item["errors"] = {}
                        vm.item["errors"]["full_messages"] = [response];
                    }
                    $scope.imageform.$setPristine();
                }
            }],
            bindings: {
                authz: "<"
            },
        });

})();
(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('Image', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {

        var service = $resource(APP_CONFIG.server_url + "/api/images/:id", { id: '@id' }, {
            update: { method: "PUT" },
            save: { method: "POST", transformRequest: checkEmptyPayload }
        });
        return service;
    }]);
    //rails wants at least one parameter of the document filled in
    //all of our fields are optional
    //ngResource is not passing a null field by default, we have to force it
    function checkEmptyPayload(data) {
        if (!data['caption']) {
            data['caption'] = null;
        }
        return angular.toJson(data);
    }

})();
(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .directive("sdImagesAuthz", function ImagesAuthzDirective() {
            var directive = {
                bindToController: true,
                controller: ['$scope', 'Authn', function ImagesAuthzController($scope, Authn) {
                    var vm = this;
                    vm.authz = [];
                    vm.authz.authenticated = false;
                    vm.authz.canCreate = false;
                    vm.authz.canQuery = false;
                    vm.authz.canUpdate = false;
                    vm.authz.canDelete = false;
                    vm.authz.canGetDetails = false;
                    vm.authz.canUpdateItem = canUpdateItem;

                    ImagesAuthzController.prototype.resetAccess = function() {
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
                console.log("ImagesAuthzDirective", scope);
            }
        });


})();
(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('ImageThing', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {

        return $resource(APP_CONFIG.server_url + "/api/images/:image_id/thing_images");
    }]);

})();
(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('ImageLinkableThing', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/api/images/:image_id/linkable_things");
    }]);

})();
(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .component("sdThingEditor", {
            templateUrl: ["APP_CONFIG", function thingEditorTemplateUrl(APP_CONFIG) {
                return APP_CONFIG.thing_editor_html;
            }],
            controller: ["$scope", "$q", "$state", "$stateParams", "Thing", "ThingImage", function ThingEditorController($scope, $q, $state, $stateParams, Thing, ThingImage) {
                var vm = this;
                vm.create = create;
                vm.clear = clear;
                vm.update = update;
                vm.remove = remove;
                vm.haveDirtyLinks = haveDirtyLinks;
                vm.updateImageLinks = updateImageLinks;

                vm.$onInit = function() {
                    console.log("ThingEditorController", $scope);
                    if ($stateParams.id) {
                        // reload($stateParams.id);
                        $scope.$watch(function() { return vm.authz.authenticated },
                            function() { reload($stateParams.id); });
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

                function reload(thingId) {
                    var itemId = thingId ? thingId : vm.item.id;
                    console.log("reloading thing", itemId);
                    vm.images = ThingImage.query({ thing_id: itemId });
                    vm.item = Thing.get({ id: itemId });
                    vm.images.$promise.then(
                        function() {
                            angular.forEach(vm.images, function(ti) {
                                ti.originalPriority = ti.priority;
                            });
                        });
                    $q.all([vm.item.$promise, vm.images.$promise]).catch(handleError);
                }


                function haveDirtyLinks() {
                    for (var i = 0; vm.images && i < vm.images.length; i++) {
                        var ti = vm.images[i];
                        if (ti.toRemove || ti.originalPriority != ti.priority) {
                            return true;
                        }
                    }
                    return false;
                }

                function create() {
                    // $scope.thingform.$setPristine();
                    vm.item.errors = null;
                    vm.item.$save().then(
                        function() {
                            $state.go(".", { id: vm.item.id });
                        },
                        handleError);
                }

                function clear() {
                    newResource();
                    $state.go(".", { id: null });
                }

                function update() {
                    // $scope.thingform.$setPristine();
                    vm.item.errors = null;
                    var update = vm.item.$update();
                    updateImageLinks(update);
                }

                function updateImageLinks(promise) {
                    //console.log("updating links to images");
                    var promises = [];
                    if (promise) { promises.push(promise); }
                    angular.forEach(vm.images, function(ti) {
                        if (ti.toRemove) {
                            promises.push(ti.$remove());
                        } else if (ti.originalPriority != ti.priority) {
                            promises.push(ti.$update());
                        }
                    });

                    //console.log("waiting for promises", promises);
                    $q.all(promises).then(
                        function(response) {
                            //console.log("promise.all response", response); 
                            //update button will be disabled when not $dirty
                            $scope.thingform.$setPristine();
                            reload();
                        },
                        handleError);
                }

                function remove() {
                    vm.item.$remove().then(
                        function() {
                            console.log("thing.removed", vm.item);
                            clear();
                        },
                        handleError);
                }

                function handleError(response) {
                    console.log("error", response);
                    if (response.data) {
                        vm.item["errors"] = response.data.errors;
                    }
                    if (!vm.item.errors) {
                        vm.item["errors"] = {}
                        vm.item["errors"]["full_messages"] = [response];
                    }
                    $scope.thingform.$setPristine();
                }
            }],
            bindings: {
                authz: "<"
            },
        })
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
        });


})();
(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('Thing', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/api/things/:id", { id: '@id' }, { update: { method: "PUT" } });
    }]);

})();
(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .directive("sdThingsAuthz", function ThingsAuthzDirective() {
            var directive = {
                bindToController: true,
                controller: ['$scope', 'Authn', function ThingsAuthzController($scope, Authn) {
                    var vm = this;
                    vm.authz = [];
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
                        $scope.$watch(Authn.getCurrentUser, newUser);
                    }

                    function newUser(user, prevUser) {
                        console.log("newUser=", user, ", prev=", prevUser);
                        vm.authz.authenticated = Authn.isAuthenticated();
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
(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('ThingImage', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/api/things/:thing_id/thing_images/:id", {
            thing_id: '@thing_id',
            id: '@id'
        }, {
            update: { method: "PUT" }
        });
    }]);

})();
// SPA Demo Javascript Manifest File



































;
