app.controller('friends', function ($scope, $http) {

    $scope.friends = [];

    $(document).ready(() => {
        console.log(globalData);
        if (globalData['identifier'] != undefined)
        {
            $scope.load({'person_id': globalData['identifier']});
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
            url: urlWebServicies + 'friends/listFriends',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params)
        }).then(function (response) {
            console.log(response.data);
            let data = response.data;
            if (data.status === 2) {
                $scope.friends = data.data;
            }
            data.tittle = "List Persons.";
            toastrDelay(data);
        }, function (response) {
            console.log(response);
        });
    };
    $scope.rmFriend = (id_friend) => {
        if (globalData['identifier'] != undefined)
        {
            let params = {
                "person_id": globalData['identifier'],
                "friend_id": id_friend,
                "option": "rm"
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
                    $scope.load({'person_id': globalData['identifier']});
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
    $scope.itsMe = (val) => {
        if (globalData['identifier'] != undefined)
        {
//            console.log(globalData['identifier'], val);
            return globalData['identifier'] === val;
        } else {
            toastrDelay({
                status: 4,
                tittle: "Not have session",
                information: "A session was not found."
            }, "index.html");
        }
        return false;
    };

    $scope.viewPost = (val) => {
        if (val != undefined) {
            console.log(val);
//            debugger;
            location.href = "#!profile?" + $.param(val);
        }
    };
});