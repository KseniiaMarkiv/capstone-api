(function() {
    'use strict';

    angular.module('spa-demo', [
        'ui.router',
        'spa-demo.config',
        'spa-demo.authn',
        'spa-demo.layout',
        'spa-demo.foos'
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
        $stateProvider.state(homeState);
        $stateProvider.state(accountSignup);
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
      'navbar_html': '/assets/spa-demo/layout/navbar/navbar-4c0f1317cedc4426f54a9100835f097ad4fe8cf688faace73f286bcccc229610.html',
      'signup_page_html': "/assets/spa-demo/pages/signup_page-47ad58f07c3eb5920310315793163d951c398c194ddae69b98d31b67642cdf37.html",
      'authn_signup_html': "/assets/spa-demo/authn/signup/signup-c6c9d9bb527508c143a8ef9f7d924cb9e11b3675afe98f0e004c5ef1af0d9ddc.html",
      authn_session_html: "/assets/spa-demo/authn/authn_session/authn_session-85c36f6ad034f03d1eb22bf66e63a0cefd4ddae940b8a31a15126b8454ed5878.html",
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
    myApp.service('Authn', ['$auth', function($auth) {
        var service = this;
        service.signup = signup;
        service.user = null;
        service.isAuthenticated = isAuthenticated;
        service.getCurrentUser = getCurrentUser;
        service.getCurrentUserName = getCurrentUserName;
        service.login = login;
        return;
        ////////////////

        function signup(registration) {
            return $auth.submitRegistration(registration);
        }

        function isAuthenticated() {
            return service.user && service.user["uid"];
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
            result.then(
                function(response) {
                    console.log("login complete", response);
                    service.user = response;
                });
            return result;
        }
    }])
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
            templateUrl: templateUrl,
            controller: AuthnSessionController
        });


    templateUrl.$inject = ["APP_CONFIG"];

    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.authn_session_html;
    }

    AuthnSessionController.$inject = ["$scope", "Authn"];

    function AuthnSessionController($scope, Authn) {
        var vm = this;
        vm.loginForm = {}
        vm.login = login;
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
            Authn.login(vm.loginForm).then(
                function() {
                    vm.dropdown.removeClass("open");
                });
        }
    }
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
            templateUrl: templateUrl,
            controller: NavbarController
        });


    templateUrl.$inject = ['APP_CONFIG'];

    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.navbar_html;
    }

    NavbarController.$inject = ['$scope', 'Authn'];

    function NavbarController($scope, Authn) {
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
    }
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

    myApp.controller('spa-demo.foos.FoosController', ['spa-demo.foos.Foo', function(Foo) {
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
            controller: 'spa-demo.foos.FoosController',
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
// SPA Demo Javascript Manifest File




















;
