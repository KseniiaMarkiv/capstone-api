(function() {
    'use strict';

    angular.module('spa-demo', [
        'ui.router',
        'spa-demo.config',
        'spa-demo.authn',
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
      'navbar_html': '/assets/spa-demo/layout/navbar/navbar-246fc69219d6f6cb97027d8afd09ef75af8732e7239e0822db29e0ef16f039e4.html',
      'signup_page_html': "/assets/spa-demo/pages/signup_page-47ad58f07c3eb5920310315793163d951c398c194ddae69b98d31b67642cdf37.html",
      'authn_signup_html': "/assets/spa-demo/authn/signup/signup-797b899fa508c764d4f1465d758e4edf32e6379d0cb559392d4be313f04c39b6.html",
      'authn_session_html': "/assets/spa-demo/authn/authn_session/authn_session-a607754a8f11782dd62ea0c881c766f8b797e8cc0f80f22f2f62dbb9d3032cec.html",
      'authn_page_html': "/assets/spa-demo/pages/authn_page-b369675392e053c2c3c48af34484a700e433fcc7b9b731037aa851b168c9168c.html",
      'images_page_html': "/assets/spa-demo/pages/images_page-f3affa16f8e89a65a3d623f0e6ece3a9cb27a81807d20c41ffeeb63550718929.html",
      'image_selector_html': "/assets/spa-demo/subjects/images/image_selector-821140a669b1a77b0ceeac5bf3a9dd9ee08f7359d26f8f42291aac8a831056c1.html",
      'image_editor_html': "/assets/spa-demo/subjects/images/image_editor-31883860e1b4b220c672663391ddbad2b859b88113e8d311c559b62295683498.html",
      'things_page_html': "/assets/spa-demo/pages/things_page-5600694cd4bc8ee18089b8b48e176a5a6693dfce34b09046d9d32b229fbd66ff.html",
      'thing_selector_html': "/assets/spa-demo/subjects/things/thing_selector-02128ee657b521ea8b671e7b997fa8f97b52b870eb63c748d1f37c550895065f.html",
      'thing_editor_html': "/assets/spa-demo/subjects/things/thing_editor-4b613599cccf7a72fdb318ee05013901ce2b3139f09a0badd0714be5d856c9e8.html",
      
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
            return service.user ? service.user.name : null;
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
        vm.getCurrentUser = Authn.getCurrentUser;

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
                    //console.log("login");
                    $scope.login_form.$setPristine();
                    vm.loginForm["errors"] = null;
                    Authn.login(vm.loginForm),

                        function(response) {
                            vm.loginForm["errors"] = response.errors;
                        };
                }

                function logout() {
                    Authn.logout();
                    console.log("logout")
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
            controller: ["$scope", "$state", "$stateParams", "Image", function ImageEditorController($scope, $state, $stateParams, Image) {
                var vm = this;
                vm.create = create;
                vm.clear = clear;
                vm.update = update;
                vm.remove = remove;

                vm.$onInit = function() {
                    console.log("ImageEditorController", $scope);
                    if ($stateParams.id) {
                        vm.item = Image.get({ id: $stateParams.id });
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

                function clear() {
                    newResource();
                    $state.go(".", { id: null });
                }

                function create() {
                    $scope.imageform.$setPristine();
                    vm.item.errors = null;
                    vm.item.$save().then(
                        function() {
                            $state.go(".", { id: vm.item.id });
                        },
                        handleError);
                }

                function update() {
                    $scope.imageform.$setPristine();
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
        .directive("sdImagesAuthz", function() {
            var directive = {
                bindToController: true,
                controller: ['$scope', 'Authn', function ImagesAuthzController($scope, Authn) {
                    var vm = this;
                    vm.authz = {};
                    vm.authz.authenticated = false;
                    vm.authz.canCreate = false;
                    vm.authz.canQuery = true;
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
(function() {
    'use strict';

    var myApp = angular.module('spa-demo.subjects');
    myApp.factory('Thing', ['$resource', 'APP_CONFIG', function($resource, APP_CONFIG) {

        var service = $resource(APP_CONFIG.server_url + "/api/things/:id", { id: '@id' }, { update: { method: "PUT" } });
        return service;
    }]);

})();
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
// SPA Demo Javascript Manifest File





























;
