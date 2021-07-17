/* global angular */

var app = angular.module('app', ["ngRoute"]);//, "ngAnimate"
app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "background.html",
                controller: "background"
            })
            .when("/publicMap", {
                templateUrl: "mapa.html",
                controller: "mapa",
                controllerAs: "mapa"
            })
            .when("/mispuntos", {
                templateUrl: "mispuntos.html",
                controller: "mapa_mispuntos"
            })
            .when("/misrutas", {
                templateUrl: "misrutas.html",
                controller: "mapa_misrutas"
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
            validarSesion(globalData.user_token);
            $scope.$apply(() => {
                $scope.DatoUsuario = globalData;
            });
            createIconsLeaf();
        } else {
            globalData = {};
            swalDelay({
                status: "4",
                information: "No tienes acceso a esta página, primero debes iniciar sesión.",
                tittle: "¡Validación de Permiso!"
            }, "login");
        }
    });

    $scope.getItemIndex = getItemIndex;
    $scope.cerrarSesion = function () {
        cerrarSesion();
    };

    $scope.publicMap = function () {
        location.href = "#!publicMap";
//        angular.element($('[ng-controller="mapa"]')).scope().meReady();
    };

    $scope.mispuntos = function () {
        location.href = "#!mispuntos";
//        angular.element($('[ng-controller="mapa"]')).scope().meReady();
    };
    $scope.misrutas = function () {
        location.href = "#!misrutas";
    };
});

function verpunto(val) {
    console.log("llamar a", val);
    angular.element($('[ng-view')).scope().verinfopunto(val);
}
function verRuta(val) {
    console.log("llamar a", val);
    angular.element($('[ng-view')).scope().verinforuta(val);
}
//angular.element($('[ng-view')).scope().geoInversa(-1.0430657, -79.6384996);
