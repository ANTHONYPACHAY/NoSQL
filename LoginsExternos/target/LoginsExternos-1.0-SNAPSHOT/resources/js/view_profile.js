
app.controller('profile', function ($scope, $http) {

    $scope.postsList = [];
    $scope.dataUser = {};

    function parseParams() {
        let str = location.href.replace(/.*\?/g, "");
//        window.history.replaceState(null, null, window.location.pathname + "#!/profile");
        return str.split('&').reduce(function (params, param) {
            var paramSplit = param.split('=').map(function (value) {
                return decodeURIComponent(value.replace(/\+/g, ' '));
            });
            params[paramSplit[0]] = paramSplit[1];
            return params;
        }, {});
    }
    $(document).ready(() => {
        console.log(globalData);
        if (globalData['identifier'] != undefined)
        {


            let userData = parseParams();
            console.log("---------------------");
            if (Object.keys(parseParams())[0] !== location.href) {
                console.log(userData);
                $scope.$apply(() => {
                    $scope.dataUser = {
                        "identifier": userData["identifier"],
                        "n.email_p": userData["to.email_p"],
                        "n.img_p": userData["to.img_p"],
                        "n.lastname_p": userData["to.lastname_p"],
                        "n.name_p": userData["to.name_p"],
                        "n.provider_p": userData["to.provider_p"]
                    };
                });
            } else {
                $scope.dataUser = globalData;
            }
            $scope.load({
                'person_id': $scope.dataUser['identifier'],
                'option': 'to',
            });
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
            url: urlWebServicies + 'publications/listPublications',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params)
        }).then(function (response) {
            console.log(response.data);
            let data = response.data;
            if (data.status === 2) {
                $scope.postsList = data.data;
            }
            data.tittle = "List Persons.";
            toastrDelay(data);
        }, function (response) {
            console.log(response);
        });
    };
});