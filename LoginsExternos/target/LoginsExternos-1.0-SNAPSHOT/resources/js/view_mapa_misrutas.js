/* global L, popup, globalData */
app.controller('mapa_misrutas', function ($scope, $http) {
    $scope.detailvis = true;
    $scope.objetoInsertar = {};
    $scope.MapaRutas = [];
    $scope.modovistamapa = true;
    $scope.elementosvisibles = 1;

    $scope.mode = 0;

    var georeverse;

    $scope.cambiartab = function (val) {
        $scope.elementosvisibles = val;
        if (val === 3)
        {
            $scope.objetoInsertar = {};
            $scope.mode = 1;
        } else {
            $scope.mode = 0;
        }
    };
    $scope.cambiarvista = function (val) {
        $scope.$apply(() => {
            $scope.modovistamapa = val;
        });

        console.log($scope.modovistamapa);
    };


    var mymap;
    var contorlLay;

    $(document).ready(() => {
        $scope.meReady();
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $scope.meReady = function () {
        initMap();
        callApiMapRutas({"user_token": globalData.user_token, "indice": 0}, "listarMisRutas");
    };


    function resizeMap() {

    }

//    console.log("map", mymap === undefined);
//    if (mymap !== undefined)
//    {
//        mymap.off();
//        mymap.remove();
//    }

    function initMap() {
        var confi = {attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'};

        var capas = {
            "calles": "streets-v11",
            "satelite": "satellite-streets-v11",
            "claro": "light-v9",
            "oscuro": "dark-v9",
            "libre": "outdoors-v9"
        };
        var capaskeys = Object.keys(capas);
        var layegr = [], layerleg = {};
        let ind = 4;
//        for (var ind = 0; ind < capaskeys.length; ind++) {
        let laytmp = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW50aG9ueXBhY2hheSIsImEiOiJjazJldWY2ZTQwN2ZlM2hud2I2MGl4eG9oIn0.zDK2-VmKq5JsY4bIVfqefA', {
            id: ('mapbox/' + capas[capaskeys[ind]]), ...confi});
        layegr.push(laytmp);
        layerleg[capaskeys[ind]] = laytmp;
//        }


        mymap = L.map('mapid_mapa', {
            center: [-1.042213, -79.637661],
            zoom: 15,
            layers: layegr
        });

        contorlLay = L.control.layers(layerleg, null, {
            collapsed: false,
            autoZIndex: false
        });
        contorlLay.addTo(mymap);

        mymap.on('click', onMapClick);

        console.log("cargame estaaaaaaaaaaaa");

        var geocoder = L.Control.geocoder({
            defaultMarkGeocode: false
        })
                .on('markgeocode', function (e) {
                    console.log(e);
                    console.log(e.geocode.center);
                    mymap.setView([
                        e.geocode.center.lat,
                        e.geocode.center.lng
                    ], 15);
                })
                .addTo(mymap);
        var destinoControles = document.getElementById('control_capas');

        var buscador = geocoder.getContainer();
        setParent(buscador, destinoControles);

        var controlObject = contorlLay.getContainer();
        setParent(controlObject, destinoControles);


        georeverse = L.Control.Geocoder.nominatim();
    }

    function onMapClick(e) {
        console.log("You clicked the map at ", e.latlng);
        console.log(e.latlng.lat + "," + e.latlng.lng);
        if ($scope.mode == 1)
        {
            $scope.$apply(function () {
                if (!$scope.objetoInsertar.puntos_ruta)
                    $scope.objetoInsertar.puntos_ruta = [];
                $scope.objetoInsertar.puntos_ruta.push([e.latlng.lat, e.latlng.lng]);
            });
            if ($scope.objetoInsertar.puntos_ruta.length === 1)
            {
                $scope.geoInversa(e.latlng.lat, e.latlng.lng);
            }
            console.log($scope.objetoInsertar.puntos_ruta);
        }
    }

    function callApiMapRutas(jsonparam, option) {
        console.log(jsonparam);
        $.when(MapAjaxRuta(jsonparam, option)).then(function (data) {
//        swal.close();
            console.log("get points", data);
            if (option === "listarMisRutas") {
                data.tittle = "Obtener Rutas.";
                if (data.status === 2)
                {
//                    data.data[0].nrows
                    let points = data.data[0].querydata;
//                    let layerRoute = L.layerGroup();
                    for (var ind = 0; ind < points.length; ind++) {
                        let tmp = points[ind];

                        console.log("tmp", tmp);
                        let tmpmark = crearRutaLeaflet(tmp);
                        tmpmark.addTo(mymap);

                        $scope.$apply(function () {
                            $scope.MapaRutas.push({...tmp, "src": 'resources/icons/routing/109-placeholder-1.png'});
                        });
                    }
//                    layerRoute.addTo(mymap);
//                    contorlLay.addOverlay(layerRoute, "Ciclo Rutas");
                } else if (data.status === 6) {
                    sesionCaducada();
                } else {
                    toastrDelay(data);
                }
            } else if (option === "inforuta") {
                swal.close();
                if (data.status === 2) {
                    console.log(data.data[0].querydata[0]);
                    $scope.$apply(function () {
                        $scope.objecVistaRuta = data.data[0].querydata[0];
                        $scope.objecVistaRuta.puntos_ruta = JSON.parse($scope.objecVistaRuta.puntos_ruta);
                        $scope.objecVistaRuta.coments = data.data[0].coments;
                        $scope.comentarioRuta = [];

                    });
                    console.log(Object.keys($scope.objecVistaRuta).length);
                } else if (data.status === 6) {
                    sesionCaducada();
                } else {
                    toastrDelay(data);
                }
            } else if (option === "insertPunto") {
                swal.close();

                if (data.status === 2) {
                    console.log(data.data);
                    $scope.$apply(function () {
                        $scope.objetoInsertar = {};
                    });
                    location.reload();
                    toastrDelay(data);
                } else if (data.status === 6) {
                    sesionCaducada();
                } else {
                    toastrDelay(data);
                }
            }
        });
    }

    function MapAjaxRuta(data, option) {
        return $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'rutas/' + option,
            data: JSON.stringify(data),
            beforeSend: function () {
//            loading();
            }, error: function (objXMLHttpRequest) {
                console.log("error", objXMLHttpRequest);
                swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
            }
        });
    }

    $scope.getItemIndex = function (pcondi, value) {
        let list = allIcons;

        for (var ind = 0; ind < list.length; ind++) {
            if (list[ind][pcondi] == value) {
                return list[ind];
            }
        }
        return {};
    };

    $scope.verRuta = function (param) {
        mymap.setView(param.puntos_ruta[0]);
    };
    $scope.geoInversa = function (lat, lng) {
        georeverse.reverse({lat: lat, lng: lng},
                mymap.options.crs.scale(mymap.getZoom()), results => {
            console.log("resultado de busqueda a partir coordenadas", results);
            console.log(results[0].properties.address);
            let data = results[0].properties.address;
            $scope.$apply(function () {
                $scope.objetoInsertar.pais_ruta = data.country;
                $scope.objetoInsertar.condado_ruta = data.county;
                $scope.objetoInsertar.provincia_ruta = data.state;
                $scope.objetoInsertar.ciudad_ruta = data.town;
            });
        });
    };

    $scope.insertarObjeto = function () {
        console.log("wa isnertar", $scope.objetoInsertar);
        console.log("wa isnertar", );
        let tmp = $scope.objetoInsertar;
        tmp.puntos_ruta = JSON.stringify(tmp.puntos_ruta);
        console.log(tmp);
        callApiMapRutas({"user_token": globalData.user_token, ...tmp}, "insertPunto");
    };
});