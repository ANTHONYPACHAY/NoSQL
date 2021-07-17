var urlWebServicies = location.origin + "/LoginsExternos/webresources/";

var globalData = {};
var allIcons = [];
var RoutinhIcons = [];

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function getItemIndex(pcondi, pcallb, value) {
    let list = [
        {permit: "R", label: "Administrador", color: "badge-danger"},
        {permit: "A", label: "Moderador", color: "badge-warning"},
        {permit: "U", label: "Usuario", color: "badge-info"}
    ];
    for (var ind = 0; ind < list.length; ind++) {
        if (list[ind][pcondi] === value) {
            return list[ind][pcallb];
        }
    }
}

function createIconsLeaf() {
    callApiglobal({"user_token": globalData.user_token}, "getCategorias");
}
function callApiglobal(jsonparam, option) {
//    console.log(jsonparam);
    $.when(globalAjax(jsonparam, option)).then(function (data) {
//        swal.close();
        console.log("procesa data iconos", data);
        if (option === "getCategorias") {
            data.tittle = "Obtener Iconos.";
            if (data.status === 2)
            {
                var LeafIcon = L.Icon.extend({
                    options: {
                        iconSize: [40, 40], // size of the icon
                        iconAnchor: [15, 36], // point of the icon which will correspond to marker's location
                        popupAnchor: [5, -35]
                    }
                });
                allIcons = data.data;
                for (var ind = 0; ind < allIcons.length; ind++) {
                    allIcons[ind]["lefticon"] = new LeafIcon({iconUrl: 'resources/points/' + allIcons[ind]["relpath"]});
                }
//                console.log("nuevos iconos", allIcons);
                RoutinhIcons.push(new LeafIcon({iconUrl: 'resources/icons/routing/118-placeholder.png'}));
                RoutinhIcons.push(new LeafIcon({iconUrl: 'resources/icons/routing/056-panel-1.png'}));
                RoutinhIcons.push(new LeafIcon({iconUrl: 'resources/icons/routing/080-placeholder-7.png'}));

            } else {
                toastrDelay(data);
            }
        }

    });
}

function crearRutaLeaflet(param) {
    param.puntos_ruta = JSON.parse(param.puntos_ruta);

    let marcadores = [];
    for (var ind = 0; ind < param.puntos_ruta.length; ind++) {
        marcadores.push(L.latLng(param.puntos_ruta[ind], param.puntos_ruta[1]));
    }
    console.log(param);
    console.log(marcadores);
    return L.Routing.control({
        lineOptions: {
            styles: [
                {color: 'white', opacity: 0.9, weight: 9},
                {color: '#FC8428', opacity: 1, weight: 3}
            ]
        },
        waypoints: marcadores,
        createMarker: function (i, item, n) {
            let marker_icon = null;
            let mypopup = '';
            console.log(i, item, n);
            if (i === 0) {
                // This is the first marker, indicating start
                marker_icon = RoutinhIcons[0];
                mypopup = cardMapRuta(
                        param.identificador,
                        param.nombre,
                        param.calificacion
                        );
            } else if (i === n - 1) {
                //This is the last marker indicating destination
                marker_icon = RoutinhIcons[2];
                mypopup = cardMapRuta(
                        param.identificador,
                        param.nombre,
                        param.calificacion
                        );
            } else {
                marker_icon = RoutinhIcons[1];
                mypopup = 'Este es un desvio';
            }
            return L.marker(item.latLng, {
                draggable: false, // peromite mover el punto, ya sea inicio o fin
                bounceOnAdd: true,
                bounceOnAddOptions: {duration: 1000, height: 800, function() {
                        (popup.openOn(mymap))
                    }},
                icon: marker_icon
            }).bindPopup(mypopup);
        }});
}

function globalAjax(data, option) {
    return $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: urlWebServicies + 'general/' + option,
        data: JSON.stringify(data),
        beforeSend: function () {
//            loading();
        }, error: function (objXMLHttpRequest) {
            console.log("error", objXMLHttpRequest);
            swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
        }
    });
}

function setParent(elem, newParent)
{
    newParent.appendChild(elem);
}

function sesionCaducada() {
    swalDelay({
        status: "4",
        information: "La sesión ha expirado, vuelve a iniciar sesión.",
        tittle: "¡Validación de Permiso!"
    }, "login");
}






