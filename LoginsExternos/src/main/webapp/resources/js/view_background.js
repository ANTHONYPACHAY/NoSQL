/* global app, getItemIndex, globalData, urlWebServicies, swal */

app.controller('background', function ($scope, $http) {
    $scope.DatoUsuario = {};
    $scope.homeData = {};

    $scope.getItemIndex = getItemIndex;

    $(document).ready(function () {
        if (Object.keys(globalData).length > 0)
        {
            $scope.DatoUsuario = globalData;
            cargaHome({"user_token": globalData.user_token});
        } else {
            sesionCaducada();
        }

    });
    function cargaHome(data) {
        return $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'general/getHombeInfo',
            data: JSON.stringify(data),
            beforeSend: function () {
                loading();
            }, success: function (data) {
                swal.close();
                data.tittle = "Inicio.";
                console.log(data);
                if (data.status === 2) {
                    $scope.$apply(function () {
                        $scope.homeData = data.data[0];
                    });
                } else if (data.status === 6) {
                    sesionCaducada();
                } else {
                    data.tittle = "Inicio";
                    toastrDelay(data);
                }
            }, error: function (objXMLHttpRequest) {
                console.log("error", objXMLHttpRequest);
                swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
            }
        });
    }

    $scope.procesaUbicacion = function (params) {
        if (params)
        {
            let part1 = params.ciudad_ruta !== undefined ? params.ciudad_ruta.trim() : "";
            let part2 = params.provincia_ruta !== undefined ? params.provincia_ruta.trim() : "";
            let part3 = params.pais_ruta !== undefined ? params.pais_ruta.trim() : "";
            part1 = part1 + (part1.length > 0 ? ", " : "");
            part2 = part2 + (part2.length > 0 ? ", " : "");
            part3 = part3 + ".";
            return part1 + part2 + part3;
        }
        return "Ubicación no definida";
    };
});