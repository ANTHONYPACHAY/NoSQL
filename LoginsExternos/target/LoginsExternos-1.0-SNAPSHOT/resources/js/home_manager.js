$('#sidebarCollapse').click(function () {
    $('#sidebar, #content').toggleClass('active');
});
var globalData;
var app = angular.module('app', ["ngRoute"]); //, "ngAnimate"
app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "background.html",
                controller: "background"
            })
            .when("/persons", {
                templateUrl: "persons.html",
                controller: "persons"
            })
            .when("/friends", {
                templateUrl: "friends.html",
                controller: "friends"
            })
            .when("/friendspost", {
                templateUrl: "friendspost.html",
                controller: "friendspost"
            })
            .when("/profile", {
                templateUrl: "profile.html",
                controller: "profile"
            })
            .when("/test", {
                templateUrl: "test.html",
//                controller: "friends"
            })
            .otherwise({
                redirectTo: 'nodisponible',
                templateUrl: 'nodisponible.html'
            });
});
app.controller("user_manager", function ($scope, $http) {

    $scope.DatoUsuario = {};
    $(document).ready(function () {
        globalData = getDataSession();
        if (globalData.user_token !== undefined && globalData.user_token !== null)
        {
            $scope.$apply(() => {
                $scope.DatoUsuario = globalData;
            });
        } else {
            globalData = {};
            swalDelay({
                status: "4",
                information: "No tienes acceso a esta página, primero debes iniciar sesión.",
                tittle: "¡Validación de Permiso!"
            }, "login");
        }
    });
    $scope.cerrarSesion = function () {
        cerrarSesion();
    };
    $scope.persons = function () {
        location.href = "#!persons";
        //        angular.element($('[ng-controller="mapa"]')).scope().meReady();
    };
    $scope.friends = function () {
        location.href = "#!friends";
        //        angular.element($('[ng-controller="mapa"]')).scope().meReady();
    };
    $scope.friendspost = function () {
        location.href = "#!friendspost";
    };

    $scope.profile = function () {
        location.href = "#!profile";
    };
});