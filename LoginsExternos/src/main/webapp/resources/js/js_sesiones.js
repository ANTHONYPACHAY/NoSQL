var globalPages = {
    login: 'index.html',
    verifier: 'index.html',
    home: 'usuario.html'
};

function getDataSession() {
    var dataUser = store.session.get("usuario_app");
    if (dataUser === undefined || dataUser === null || dataUser == "undefined")
    {
        if (currentPage() !== globalPages.login)
        {
            location.href = globalPages.login; // si no existe sesion inicada lo bota al login
        }
    }
    return dataUser;
}

function cerrarSesion() {
    store.session.set("usuario_app", undefined);
    location.href = globalPages.login;
}

function validarSesion(user_token) {
    if (user_token !== undefined && user_token !== null)
    {
        $.when(verificarSesion(user_token)).then(function (data) {
//            console.log("data de resultado duper", data);
            if (data.status === 2) {
                if (validarpagina(data.data.permmit)) {
                    data.tittle = "Validación de Sesión";
                    alertAll(data);
                }
            } else {
                data.tittle = "¡Alerta de Sesión!";
                store.session.set("usuario_cyclero", undefined);
                if (currentPage() === globalPages.login)
                {
                    swalDelay(data, globalPages.login);
                }
            }
        });
    } else {
        if (currentPage() !== globalPages.login)
        {
            swalDelay({
                status: 4,
                information: "No tienes acceso a esta página, primero debes iniciar sesión.",
                tittle: "¡Validación de Permiso!"
            }, globalPages.login);
        }

    }
}

function verificarSesion(user_token) {
    return $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: urlWebServicies + 'persona/getdatasession',
        data: JSON.stringify({"user_token": user_token}),
        beforeSend: function () {
//            loading();
        },
        success: function (data)
        {
//            swal.close();
        },
        error: function (objXMLHttpRequest) {
            console.log("error", objXMLHttpRequest);
            swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
        }
    });
}

function verificarPermiso(permit, actual) {
    if (actual === undefined)
    {
        actual = currentPage();
    }
    actual = actual.toString().replace(".html", "");

    let pages = [
        {'page': 'login', 'permit': /[X]/},
        {'page': 'home', 'permit': /[U|A|R]/}
    ];
    let flagpermit = false;
    if (permit.length !== 1) {
        permit = 'X';
    } else
    {
        for (let ind = 0; ind < pages.length; ind++) {
            if (pages[ind]['page'] === actual && pages[ind]['permit'].test(permit)) {
                flagpermit = true;
                ind = pages.length;
            }
        }
    }
    return flagpermit;
}

function validarpagina(permit, actual) {
    let flagpermit = verificarPermiso(permit, actual);
//    console.log("to", flagpermit);
    let def = (permit === 'S') ? globalPages.verifier :
            (permit === 'U') ? globalPages.home :
            (permit === 'A' || permit === 'R') ? globalPages.home : globalPages.login;
    if (!flagpermit)
    {
        if (actual === globalPages.login)
        {
            swalDelay({
                status: 1,
                information: "Será redirigido al lugar adecuado.",
                tittle: "¡Sesión en curso!"
            }, def);
        } else {
            swalDelay({
                status: 3,
                information: "No tienes acceso a esta página, seras redirigido a un lugar adecuado.",
                tittle: "¡Validación de Permiso!"
            }, def);
        }
        console.log("regresa a: " + def);
    } else {
        console.log("permiso consedido");
        return true;
    }
}

function redirigirPorDefecto(permit) {
    let def = (permit === 'S') ? globalPages.verifier :
            (permit === 'U') ? globalPages.home :
            (permit === 'A' || permit === 'R') ? globalPages.home : globalPages.login;
    if (def !== currentPage()) {
        setInterval(function () {
            location.href = def;
        }, 1000);
    }
}