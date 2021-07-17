/* global L, popup, globalData, swal, urlWebServicies, allIcons */
app.controller('mapa', function ($scope, $http) {
    $scope.detailvis = true;
    $scope.MapaPoints = [];
    $scope.MapaRutas = [];
    $scope.modovistamapa = true;
    $scope.elementosvisibles = 1;

    $scope.objecVistaPunto = {};
    $scope.comentarioPuntos = [];
    $scope.nuevoComentarioPuntos = {};

    $scope.opcionescalificacion = [
        {value: 0, display: " -- "},
        {value: 1, display: "Muy Malo"},
        {value: 2, display: "Malo"},
        {value: 3, display: "Regular"},
        {value: 4, display: "Bueno"},
        {value: 5, display: "Muy Bueno"}
    ];


    $scope.cambiartab = function (val) {
        $scope.elementosvisibles = val;
    };
    $scope.cambiarvista = function (val) {
        $scope.$apply(() => {
            $scope.modovistamapa = val;
        });

        console.log($scope.modovistamapa);
    };

    $scope.muestraPanel = function (obj) {
        if (obj) {
            return Object.keys(obj).length > 0;
        }
        return false;
    };
    $scope.datepart = function (obj) {
        return obj !== undefined ? datepart_(obj) : "";
    };


    var mymap;
    var contorlLay;
    var georeverse;

    $(document).ready(() => {
        $scope.meReady();
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $scope.meReady = function () {
//        alert("activacion");
        initMap();
        callApiMapPunto({"user_token": globalData.user_token, "indice": 0}, "listarPuntos");
        callApiMapRutas({"user_token": globalData.user_token, "indice": 0}, "listarRutas");


    };



//    let mapacargado = L.DomUtil.get('mapid_mapa');
//    if (mapacargado != null) {
//        mapacargado._leaflet_id = null;
//    }

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
        for (var ind = 0; ind < capaskeys.length; ind++) {
            let laytmp = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW50aG9ueXBhY2hheSIsImEiOiJjazJldWY2ZTQwN2ZlM2hud2I2MGl4eG9oIn0.zDK2-VmKq5JsY4bIVfqefA', {
                id: ('mapbox/' + capas[capaskeys[ind]]), ...confi});
            layegr.push(laytmp);
            layerleg[capaskeys[ind]] = laytmp;
        }


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

//        var buscador = document.querySelector(".leaflet-control-geocoder");
        var buscador = geocoder.getContainer();
        setParent(buscador, destinoControles);

        var controlObject = contorlLay.getContainer();
        setParent(controlObject, destinoControles);

//        alert("ter");
        georeverse = L.Control.Geocoder.nominatim();
    }

    function onMapClick(e) {
        console.log("You clicked the map at ", e.latlng);
        console.log(e.latlng.lat + "," + e.latlng.lng);
    }

    function callApiMapPunto(jsonparam, option) {
        console.log(jsonparam);
        $.when(MapAjaxPunto(jsonparam, option)).then(function (data) {
//        swal.close();
            console.log("get points", data);
            if (option === "listarPuntos") {
                data.tittle = "Obtener Puntos.";
                if (data.status === 2)
                {
                    data.data[0].nrows
                    let points = data.data[0].querydata;
                    let layerPoint = L.layerGroup();
                    for (var ind = 0; ind < points.length; ind++) {
                        let tmp = points[ind];
                        let categorItemx = $scope.getItemIndex("id_categoria", tmp["categorias_id_categoria"]);

                        let tmpmark = L.marker([tmp.lat, tmp.lng], {icon: categorItemx.lefticon});
                        tmpmark.bindPopup(cardMap(tmp.identificador, tmp.nombre, tmp.calificacion));
                        tmpmark.addTo(layerPoint);
                        console.log("tmp", tmp);
                        $scope.$apply(function () {
                            $scope.MapaPoints.push({...tmp, "src": categorItemx.lefticon.options.iconUrl});
                        });

                    }

                    layerPoint.addTo(mymap);
//                    contorlLay.addBaseLayer(layerPoint, 'Puntos');
                    contorlLay.addOverlay(layerPoint, "Puntos de Interés");
                    //overlays
//                    L.control.layers().addTo(controls);
                } else if (data.status === 6) {
                    sesionCaducada();
                } else {
                    toastrDelay(data);
                }
            } else if (option === "infopunto") {
                swal.close();
                if (data.status === 2) {
                    console.log(data.data[0].querydata[0]);
                    $scope.$apply(function () {
                        $scope.objecVistaPunto = data.data[0].querydata[0];
                        $scope.objecVistaPunto.coments = data.data[0].coments;
                        $scope.comentarioPuntos = [];

                    });
                    console.log(Object.keys($scope.objecVistaPunto).length);
                } else if (data.status === 6) {
                    sesionCaducada();
                } else {
                    toastrDelay(data);
                }
            } else if (option === "listComentariosPuntos") {
                swal.close();
                if (data.status === 2) {
                    console.log(data.data);
                    $scope.$apply(function () {
                        $scope.comentarioPuntos = data.data;
                    });
                } else if (data.status === 6) {
                    sesionCaducada();
                } else {
                    toastrDelay(data);
                }
            }
        });
    }

    function MapAjaxPunto(data, option) {
        return $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'puntos/' + option,
            data: JSON.stringify(data),
            beforeSend: function () {
//            loading();
            }, error: function (objXMLHttpRequest) {
                console.log("error", objXMLHttpRequest);
                swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
            }
        });
    }

    function callApiMapRutas(jsonparam, option) {
        console.log(jsonparam);
        $.when(MapAjaxRuta(jsonparam, option)).then(function (data) {
//        swal.close();
            console.log("get points", data);
            if (option === "listarRutas") {
                data.tittle = "Obtener Rutas.";
                if (data.status === 2)
                {
//                    data.data[0].nrows
                    let points = data.data[0].querydata;
                    let layerRoute = L.layerGroup();
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
            } else if (option === "listComentariosRutas") {
                swal.close();
                if (data.status === 2) {
                    console.log(data.data);
                    $scope.$apply(function () {
                        $scope.comentarioRutas = data.data;
                    });
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



    $scope.verPunto = function (param) {
        mymap.setView([param.lat, param.lng]);
        $scope.modovistamapa = true;
    };

    $scope.verRuta = function (param) {
//        console.log(param);
        mymap.setView(param.puntos_ruta[0]);
        $scope.modovistamapa = true;
    };
    $scope.viewMap = function () {
        $scope.modovistamapa = true;
    };

    $scope.verinfopunto = function (param) {
        loading();
        callApiMapPunto({"user_token": globalData.user_token, "identificador": param}, "infopunto");
        $scope.objecVistaRuta = {};
        $scope.cambiarvista(false);
    };
    $scope.verinforuta = function (param) {
        loading();
        callApiMapRutas({"user_token": globalData.user_token, "identificador": param}, "inforuta");
        $scope.objecVistaPunto = {};
        $scope.cambiarvista(false);
    };

    $scope.verComentariosPunto = function () {
        loading();
        callApiMapPunto({
            "user_token": globalData.user_token,
            "identificador": $scope.objecVistaPunto.id_punto
        }, "listComentariosPuntos");
    };

    $scope.geoInversa = function (lat, lng) {
        georeverse.reverse({lat: lat, lng: lng},
                mymap.options.crs.scale(mymap.getZoom()), results => {
            console.log("resultado de busqueda a partir coordenadas", results);
            console.log(results[0].properties.address);
        });
    };

});