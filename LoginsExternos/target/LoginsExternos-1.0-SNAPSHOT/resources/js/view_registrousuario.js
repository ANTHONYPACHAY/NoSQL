
/* global app, urlWebServicies, swal, firebase, store */

app.controller('registrousuario', function ($scope, $http) {
    $scope.visible = 1; //bandera para mostrar div
    $scope.mostrar = function (param) {
        if (param) {
            $scope.visible = param;
        }
    };

    $(document).ready(function () {


    });
//    setTimeout(() => {
//        $scope.$apply(() => {
//            $scope.mostrar(2);
//        });
//    }, 3000);


    $scope.modelregistrar = {
        provider: 'facebook.com'
    };


    var firebaseConfig = {
        apiKey: "AIzaSyDDZKJAW6jLTIFDJTe0QNaG3HOEck1xOiE",
        authDomain: "tddm4iots01.firebaseapp.com",
        projectId: "tddm4iots01",
        storageBucket: "tddm4iots01.appspot.com",
        messagingSenderId: "2302824414",
        appId: "1:2302824414:web:bda17099d52e3c7383974f"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    $scope.logGoogle = function () {
        let provider = new firebase.auth.GoogleAuthProvider();
        $scope.consume(provider);
    };
    $scope.logFacebook = function () {
        let provider = new firebase.auth.FacebookAuthProvider();
        $scope.consume(provider);
    };
    $scope.logGithub = function () {
        let provider = new firebase.auth.GithubAuthProvider();
        $scope.consume(provider);
    };
    $scope.logTwitter = function () {
        let provider = new firebase.auth.TwitterAuthProvider();
        $scope.consume(provider);
    };

    $scope.cancelar = function () {
        $scope.modelregistrar = {};
        $scope.mostrar(1);
    };

    $scope.consume = function (provider) {
        auth.signInWithPopup(provider).then(function (result) {
            let userinfo = result.additionalUserInfo;
            let userprofile = userinfo.profile;
            let datosUser = {
                isNewUser: userinfo.isNewUser,
                provider: userinfo.providerId,
                userid: String(userinfo.profile.id)
            };
//            console.log(userinfo);
            switch (userinfo.providerId) {
                case "google.com":
                    {
                        //userimage: userinfo.profile.picture,
                        datosUser['userimage'] = userprofile.picture;
                        datosUser['useremail'] = userprofile.email;
                        datosUser['username'] = userprofile.given_name;
                        datosUser['userlastname'] = userprofile.family_name;
                    }
                    break;
                case "facebook.com":
                    {
                        datosUser['userimage'] = ("https://graph.facebook.com/" + userprofile.id + "/picture?type=large&amp;width=1080");
                        datosUser['useremail'] = userprofile.email;
                        datosUser['username'] = userprofile.first_name;
                        datosUser['userlastname'] = userprofile.last_name;
                    }
                    break;
                case "github.com":
                    {
                        datosUser['userimage'] = userprofile.avatar_url;
                        datosUser['useremail'] = userprofile.login;
                        datosUser['username'] = userprofile.name;
                        //datosUser['userlastname'] = 
                    }
                    break;
                case "twitter.com":
                    {
                        datosUser['userimage'] = userprofile.profile_image_url;
                        datosUser['useremail'] = userinfo.username;
                        datosUser['username'] = userinfo.profile.name;
                        //datosUser['userlastname'] = 
                    }
                    break;
                default:
                    break;
            }
            if (datosUser['userlastname'] === undefined)
            {
                let {username, ...datos} = datosUser;//desestructuración de objetdos
                username = operarnombre(username);//dividir el name de forma pro
                datosUser = {...datos, ...username};//juntar ambos json en uno solo :3
            }

            $scope.cargarApiModal(datosUser);
        }).catch(function (error) {
//            console.log("error", error);
            swalDelay({
                status: 4,
                tittle: "Service provider error!",
                information: error.message
            });
        });
    };

    $scope.cargarApiModal = function (datosUser) {
        $scope.mostrar(2);
        $scope.$apply(function () {
            $scope.modelregistrar = datosUser;
        });

    };
    /*------------------*/
    $scope.login = function () {
        callApipersona($scope.modelregistrar);
    };


    function callApipersona(jsonparam) {
        console.log(jsonparam);
        $.when(personaAjax(jsonparam)).then(function (data) {
            swal.close();
            console.log("procesa data", data);
            if (data.status === 2)
            {
                data.tittle = "Iniciar Sesión.";
                store.session.set("usuario_app", data.data);
            }
//            toastrDelay(data, 'usuario.html');
            toastrDelay(data, 'home.html');
        });
    }

    function personaAjax(data) {
        return $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'person/login',
            data: JSON.stringify(data),
            beforeSend: function () {
                loading();
            }, error: function (objXMLHttpRequest) {
                console.log("error", objXMLHttpRequest);
                swal.fire("!Oh no¡", "Se ha producido un problema.", "error");
            }
        });
    }

    function operarnombre(paramName) {
        let partes = paramName.toString().trim().split(" ");
        let obj = {
            username: '',
            userlastname: ''
        };
        let limit = (partes.length / 2).toFixed(0);
        for (var ind = 0; ind < partes.length; ind++) {
            let minpart = partes[ind];
            if (minpart.length > 0)
            {
                if (ind < limit) {
                    obj['username'] = obj['username'].length > 0 ? " " : "" + minpart;
                } else {
                    obj['userlastname'] = obj['userlastname'].length > 0 ? " " : "" + minpart;
                }
            } else {
            }
        }
        return obj;
    }

});