/* global L, popup, globalData */
app.controller('mapa_mispuntos', function ($scope, $http) {
    $scope.detailvis = true;
    $scope.MapaPoints = [];
    $scope.modovistamapa = true;
    $scope.elementosvisibles = 1;

    $scope.mode = 0;

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
    var georeverse;

    $(document).ready(() => {
        $scope.meReady();
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $scope.meReady = function () {
        initMap();
        callApiMap({"user_token": globalData.user_token}, "listarMisPuntos");

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
                $scope.objetoInsertar.latitud_punto = e.latlng.lat;
                $scope.objetoInsertar.longitud_punto = e.latlng.lng;
            });
            $scope.geoInversa(e.latlng.lat, e.latlng.lng);
            console.log($scope.objetoInsertar.puntos_ruta);
        }
    }

    function callApiMap(jsonparam, option) {
        console.log(jsonparam);
        $.when(MapAjax(jsonparam, option)).then(function (data) {
//        swal.close();
            if (option === "listarMisPuntos") {
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
                    $scope.$apply(function () {
                        $scope.categorias = allIcons;
                    });
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
//                    toastrDelay(data);
                }
            }
            toastrDelay(data);
        });
    }
    function MapAjax(data, option) {
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
        $scope.cambiarvista(false);
        document.getElementById("cobtenido_mapa").scrollTop += 250;

    };

    $scope.geoInversa = function (lat, lng) {
        georeverse.reverse({lat: lat, lng: lng},
                mymap.options.crs.scale(mymap.getZoom()), results => {
            console.log("resultado de busqueda a partir coordenadas", results);
            console.log(results[0].properties.address);
            let data = results[0].properties.address;
            $scope.$apply(function () {
                $scope.objetoInsertar.pais_punto = data.country;
                $scope.objetoInsertar.condado_punto = data.county;
                $scope.objetoInsertar.provincia_punto = data.state;
                $scope.objetoInsertar.ciudad_punto = data.town;
            });
        });
    };

    $scope.insertarObjeto = function () {
        console.log("wa isnertar", $scope.objetoInsertar);
        console.log("wa isnertar", );
        let tmp = $scope.objetoInsertar;
//        tmp.puntos_ruta = JSON.stringify(tmp.puntos_ruta);
        console.log(tmp);
//        callApiMapRutas({"user_token": globalData.user_token, ...tmp}, "insertPunto");
        callApiMap({"user_token": globalData.user_token, ...tmp}, "insertPunto");
    };
});