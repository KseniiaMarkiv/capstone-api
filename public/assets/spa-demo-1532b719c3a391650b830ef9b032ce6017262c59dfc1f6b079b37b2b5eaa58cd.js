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
      'images_page_html': "/assets/spa-demo/pages/images_page-88b5fad4f44a890ffec91339f70b8f77478782a7bfc537157822fa09fdeb3f98.html",
      'image_selector_html': "/assets/spa-demo/subjects/images/image_selector-083decd045cc67de243f308f0c9e94c67b2ebda758270c8a39df2fc9a9d96d98.html",
      'image_editor_html': "/assets/spa-demo/subjects/images/image_editor-945dbb930d6cf3a8cf367db9d97321380f1afc02ee9d92423bdf6d278def65e4.html",
      'things_page_html': "/assets/spa-demo/pages/things_page-66165e4e064f3ca46b20d0555d40a317c688eb4f112b0a54e5240ff0e0d1fae8.html",
      'thing_selector_html': "/assets/spa-demo/subjects/things/thing_selector-209da3067772af0dc6bca67a08000afbf6a7f9373da13f5e03ffe571bd332c14.html",
      'thing_editor_html': "/assets/spa-demo/subjects/things/thing_editor-310577a6b3f4b714817e0837dde1bdec1613f86f2ce30d092a8dcd398e4f314f.html",
      
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

    var myApp = angular.module("spa-demo.authz")
    myApp.service('Authz', ["$rootScope", "$q", "Authn", "spa-demo.authn.whoAmI", function($rootScope, $q, Authn, whoAmI) {
        var service = this;
        service.user = null; //holds result from server
        service.userPromise = null; //promise during server request
        service.admin = false;
        service.originator = []

        service.getAuthorizedUser = getAuthorizedUser;
        service.getAuthorizedUserId = getAuthorizedUserId;
        service.isAuthenticated = isAuthenticated;
        service.isAdmin = isAdmin;
        service.isOriginator = isOriginator;
        service.isOrganizer = isOrganizer;
        service.isMember = isMember;
        service.hasRole = hasRole;

        activate();
        return;
        ////////////////
        function activate() {
            $rootScope.$watch(
                function() { return Authn.getCurrentUserId(); },
                newUser);
        }

        function newUser() {
            //we do not have a authz-user until resolved
            var deferred = $q.defer();
            service.userPromise = deferred.promise;
            service.user = null;

            service.admin = false;
            service.originator = [];
            whoAmI.get().$promise.then(
                function(response) { processUserRoles(response, deferred); },
                function(response) { processUserRoles(response, deferred); });
        }

        //process application-level roles returned from server
        function processUserRoles(response, deferred) {
            console.log("processing roles", service.state, response);
            angular.forEach(response.user_roles, function(value) {
                if (value.role_name == "admin") {
                    service.admin = true;
                } else if (value.role_name == "originator") {
                    service.originator.push(value.resource);
                }
            });

            service.user = response;
            service.userPromise = null;
            deferred.resolve(response);
            console.log("processed roles", service.user);
        }

        function getAuthorizedUser() {
            var deferred = $q.defer();

            var promise = service.userPromise;
            if (promise) {
                promise.then(
                    function() { deferred.resolve(service.user); },
                    function() { deferred.reject(service.user); });
            } else {
                deferred.resolve(service.user);
            }

            return deferred.promise;
        }

        function getAuthorizedUserId() {
            return service.user && !service.userPromise ? service.user.id : null;
        }

        function isAuthenticated() {
            return getAuthorizedUserId() != null;
        }

        //return true if the user has an application admin role
        function isAdmin() {
            return service.user && service.admin && true;
        }

        //return true if the current user has an organizer role for the instance
        //users with this role have the lead when modifying the instance
        function isOriginator(resource) {
            return service.user && service.originator.indexOf(resource) >= 0;
        }

        //return true if the current user has an organizer role for the instance
        //users with this role have the lead when modifying the instance
        function isOrganizer(item) {
            return !item ? false : hasRole(item.user_roles, 'organizer');
        }

        //return true if the current user has a member role for the instance
        //users with this role are associated in a formal way with the instance
        //and may be able to make some modifications to the instance
        function isMember(item) {
            return !item ? false : hasRole(item.user_roles, 'member') || isOrganizer(item);
        }

        //return true if the collection of roles contains the specified role
        function hasRole(user_roles, role) {
            if (role) {
                return !user_roles ? false : user_roles.indexOf(role) >= 0;
            } else {
                return !user_roles ? true : user_roles.length == 0
            }
        }
    }])

})();
(function() {
    "use strict";

    var myApp = angular.module("spa-demo.authz")
    myApp.factory('BasePolicy', ['Authz', function BasePolicyFactory(Authz) {
        function BasePolicy(resourceName) {
            this.resourceName = resourceName;
            return;
        }

        BasePolicy.prototype.getAuthorizedUserId = function() {
            return Authz.getAuthorizedUserId();
        };
        //returns a promise of the user being resolved
        BasePolicy.prototype.getAuthorizedUser = function() {
            return Authz.getAuthorizedUser();
        }
        BasePolicy.prototype.isAuthenticated = function() {
            return Authz.isAuthenticated();
        }
        BasePolicy.prototype.canCreate = function() {
            //console.log("BasePolicy.canCreate");
            return Authz.isOriginator(this.resourceName);
        };
        BasePolicy.prototype.canQuery = function() {
            //console.log("BasePolicy.canQuery");
            return true;
        };
        BasePolicy.prototype.canUpdate = function(item) {
            //console.log("BasePolicy.canUpdate", item);
            if (!item) {
                return false;
            } else {
                return !item.id ? this.canCreate() : Authz.isOrganizer(item);
            }
        };
        BasePolicy.prototype.canDelete = function(item) {
            //console.log("BasePolicy.canDelete", item);
            return (item && item.id && (this.canUpdate(item) || Authz.isAdmin())) == true;
        };
        BasePolicy.prototype.canGetDetails = function(item) {
            //console.log("BasePolicy.canGetDetails", item);
            if (!item) {
                return false;
            } else {
                return !item.id ? this.canCreate() : (Authz.isMember(item) || Authz.isAdmin());
            }
        };
        return BasePolicy;
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
            controller: ["$scope", "$stateParams", "Authz", "Image", function ImageSelectorController($scope, $stateParams, Authz, Image) {
                var vm = this;

                vm.$onInit = function() {
                    console.log("ImageSelectorController", $scope);
                    $scope.$watch(function() { return Authz.getAuthorizedUserId(); },
                        function() {
                            if (!$stateParams.id) {
                                vm.items = Image.query();
                            }
                        });
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
            controller: ["$scope", "$q", "$state", "$stateParams", "Authz", "Image", "ImageLinkableThing", "ImageThing", function ImageEditorController($scope, $q, $state, $stateParams, Authz, Image, ImageLinkableThing, ImageThing) {
                var vm = this;
                vm.selected_linkables = [];
                vm.create = create;
                vm.clear = clear;
                vm.update = update;
                vm.remove = remove;
                vm.linkThings = linkThings;

                vm.$onInit = function() {
                    console.log("ImageEditorController", $scope);
                    $scope.$watch(function() { return Authz.getAuthorizedUserId(); },
                        function() {
                            if ($stateParams.id) {
                                reload($stateParams.id);
                            } else {
                                newResource();
                            }
                        });
                }
                return;
                //////////////
                function newResource() {
                    console.log("newResource()");
                    vm.item = new Image();
                    vm.imagesAuthz.newItem(vm.item);
                    return vm.item;
                }

                function reload(imageId) {
                    var itemId = imageId ? imageId : vm.item.id;
                    console.log("reloading image", itemId);
                    vm.item = Image.get({ id: itemId });
                    vm.things = ImageThing.query({ image_id: itemId });
                    vm.linkable_things = ImageLinkableThing.query({ image_id: itemId });
                    vm.imagesAuthz.newItem(vm.item);
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
            require: {
                imagesAuthz: "^sdImagesAuthz"
            }
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

    var myApp = angular.module("spa-demo.subjects")
    myApp.factory("ImagesAuthz", ["Authz", "BasePolicy", function ImagesAuthzFactory(Authz, BasePolicy) {
        function ImagesAuthz() {
            BasePolicy.call(this, "Image");
        }

        //start with base class prototype definitions
        ImagesAuthz.prototype = Object.create(BasePolicy.prototype);
        ImagesAuthz.constructor = ImagesAuthz;

        //override and add additional methods
        ImagesAuthz.prototype.canCreate = function() {
            //console.log("ItemsAuthz.canCreate");
            return Authz.isAuthenticated();
        };

        return new ImagesAuthz();

    }]);
})();
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
            controller: ["$scope", "$q", "$state", "$stateParams", "Authz", "Thing", "ThingImage", function ThingEditorController($scope, $q, $state, $stateParams, Authz, Thing, ThingImage) {
                var vm = this;
                vm.create = create;
                vm.clear = clear;
                vm.update = update;
                vm.remove = remove;
                vm.haveDirtyLinks = haveDirtyLinks;
                vm.updateImageLinks = updateImageLinks;

                vm.$onInit = function() {
                    console.log("ThingEditorController", $scope);
                    $scope.$watch(function() { return Authz.getAuthorizedUserId(); },
                        function() {
                            if ($stateParams.id) {
                                reload($stateParams.id);
                            } else {
                                newResource();
                            }
                        });
                }
                return;
                //////////////
                function newResource() {
                    vm.item = new Thing();
                    vm.thingsAuthz.newItem(vm.item);
                    return vm.item;
                }

                function reload(thingId) {
                    var itemId = thingId ? thingId : vm.item.id;
                    console.log("reloading thing", itemId);
                    vm.images = ThingImage.query({ thing_id: itemId });
                    vm.item = Thing.get({ id: itemId });
                    vm.thingsAuthz.newItem(vm.item);
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
            require: {
                thingsAuthz: "^sdThingsAuthz"
            }
        })
        .component("sdThingSelector", {
            templateUrl: ["APP_CONFIG", function thingSelectorTemplateUrl(APP_CONFIG) {
                return APP_CONFIG.thing_selector_html;
            }],
            controller: ["$scope", "$stateParams", "Authz", "Thing", function ThingSelectorController($scope, $stateParams, Authz, Thing) {
                var vm = this;

                vm.$onInit = function() {
                    console.log("ThingSelectorController", $scope);
                    $scope.$watch(function() { return Authz.getAuthorizedUserId(); },
                        function() {
                            if (!$stateParams.id) {
                                vm.items = Thing.query();
                            }
                        });
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

    var myApp = angular.module("spa-demo.subjects")
    myApp.factory("ThingsAuthz", ["Authz", "BasePolicy", function ThingsAuthzFactory(Authz, BasePolicy) {
        function ThingsAuthz() {
            BasePolicy.call(this, "Thing");
        }
        //start with base class prototype definitions
        ThingsAuthz.prototype = Object.create(BasePolicy.prototype);
        ThingsAuthz.constructor = ThingsAuthz;


        //override and add additional methods
        ThingsAuthz.prototype.canQuery = function() {
            //console.log("ThingsAuthz.canQuery");
            return Authz.isAuthenticated();
        };

        //add custom definitions
        ThingsAuthz.prototype.canAddImage = function(thing) {
            return Authz.isMember(thing);
        };
        ThingsAuthz.prototype.canUpdateImage = function(thing) {
            return Authz.isOrganizer(thing)
        };
        ThingsAuthz.prototype.canRemoveImage = function(thing) {
            return Authz.isOrganizer(thing) || Authz.isAdmin();
        };

        return new ThingsAuthz();

    }]);
})();
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
                    vm.newItem = newItem;

                    activate();
                    return;
                    //////////
                    function activate() {
                        vm.newItem(null);
                    }

                    function newItem(item) {
                        ThingsAuthz.getAuthorizedUser().then(
                            function(user) { authzUserItem(item, user); },
                            function(user) { authzUserItem(item, user); });
                    }

                    function authzUserItem(item, user) {
                        console.log("new Item/Authz", item, user);
                        vm.authz.authenticated = ThingsAuthz.isAuthenticated();
                        vm.authz.canQuery = ThingsAuthz.canQuery();
                        vm.authz.canCreate = ThingsAuthz.canCreate();
                        if (item && item.$promise) {
                            vm.authz.canUpdate = false;
                            vm.authz.canDelete = false;
                            vm.authz.canGetDetails = false;
                            vm.authz.canUpdateImage = false;
                            vm.authz.canRemoveImage = false;
                            item.$promise.then(function() { checkAccess(item); });
                        } else {
                            checkAccess(item);
                        }
                    }

                    function checkAccess(item) {
                        vm.authz.canUpdate = ThingsAuthz.canUpdate(item);
                        vm.authz.canDelete = ThingsAuthz.canDelete(item);
                        vm.authz.canGetDetails = ThingsAuthz.canGetDetails(item);
                        vm.authz.canUpdateImage = ThingsAuthz.canUpdateImage(item);
                        vm.authz.canRemoveImage = ThingsAuthz.canRemoveImage(item);
                        console.log("checkAccess", item, vm.authz);
                    }

                    function canUpdateItem(item) {
                        return ThingsAuthz.canUpdate(item);
                    }
                }],
                controllerAs: "vm",
                restrict: "A",
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
