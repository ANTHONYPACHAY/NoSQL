/* global app, getItemIndex, globalData, urlWebServicies, swal */

app.controller('persons', function ($scope, $http) {

    $scope.personas = [];

    $(document).ready(() => {
        console.log(globalData);
        if (globalData['identifier'] != undefined)
        {
            $scope.load({'id_per': globalData['identifier'], key: 'email_p', value: ''});
        } else {
            toastrDelay({
                status: 4,
                tittle: "Not have session",
                information: "A session was not found."
            }, "index.html");
        }
    });

    $scope.load = (params) => {
        $http({
            method: 'POST',
            url: urlWebServicies + 'person/listUsers',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params)
        }).then(function (response) {
            console.log(response.data);
            let data = response.data;
            if (data.status === 2) {
                $scope.relations = data.data.rels;
                $scope.personas = data.data.people;
                console.log($scope.personas);
            }
            data.tittle = "List Persons.";
            toastrDelay(data);

        }, function (response) {
            console.log(response);
        });
    };

//  encabezados de los datos 
    $scope.headers = [
        {
            "display": "Name",
            "value": "n.name_p"
        },
        {
            "display": "Last Name",
            "value": "n.lastname_p"
        },
        {
            "display": "Email",
            "value": "n.email_p"
        }
//        {
//            "display": "Provider",
//            "value": "n.provider_p"
//        }
    ];
//                        modelo para el combo de filtrado
    $scope.item = $scope.headers[0].value;
//                        modelo para el cuadro de búsqueda
    $scope.textfilt = '';
//                      función para determinar que filas se deben mostrar
    $scope.canShow = function (param) {
        if ($scope.textfilt.toString().length > 0) {
            return param[$scope.item].toString().toLowerCase().includes($scope.textfilt.toLowerCase());
        }
        return true;
    };

    $scope.showOptions = (identifier) => {
        let flag = 0;//nadie
        if (identifier != undefined && globalData.identifier != undefined)
        {
            flag = 3; // agregar un nuevo amigo
            if (identifier === globalData.identifier) {
                flag = 1;//soy yo
            } else {
                let opt = $scope.relations;
                for (let ind = 0; ind < opt.length; ind++) {
                    if (opt[ind].identifier == identifier) {
                        flag = 2;//es mi amigo
                    }
                }
            }
        }
        console.log(flag);
        return flag;
    };
    $scope.hasFriend = (identifier) => {
        let opt = $scope.relations;
        for (let ind = 0; ind < opt.length; opt++) {
            if (opt[ind].identifier === identifier) {
                return true;
            }
        }
        return false;
    };

    // agregar nuevo amigo

    $scope.addFriend = (id_friend) => {
        if (globalData['identifier'] != undefined)
        {
            let params = {
                "person_id": globalData['identifier'],
                "friend_id": id_friend,
                "option": "mk"
            };
            $http({
                method: 'POST',
                url: urlWebServicies + 'friends/mkrmFriend',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(params)
            }).then(function (response) {
                console.log(response.data);
                let data = response.data;
                if (data.status === 2) {
                    $scope.load({'id_per': globalData['identifier'], key: 'email_p', value: ''});
                }
                data.tittle = "Add Friend.";
                toastrDelay(data);

            }, function (response) {
                console.log(response);
            });
        } else {
            toastrDelay({
                status: 4,
                tittle: "Not have session",
                information: "A session was not found."
            }, "index.html");
        }
    };
});