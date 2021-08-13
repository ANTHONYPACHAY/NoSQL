
app.controller('friendspost', function ($scope, $http) {

    var firebaseConfig = {
        apiKey: "AIzaSyDDZKJAW6jLTIFDJTe0QNaG3HOEck1xOiE",
        authDomain: "tddm4iots01.firebaseapp.com",
        projectId: "tddm4iots01",
        storageBucket: "tddm4iots01.appspot.com",
        messagingSenderId: "2302824414",
        appId: "1:2302824414:web:bda17099d52e3c7383974f"
    };
// Initialize Firebase
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }

    $scope.dataUser = {};
    $scope.description = '';
    $(document).ready(() => {
        console.log(globalData);
        if (globalData['identifier'] != undefined)
        {
            $scope.$apply(() => {
                $scope.dataUser = globalData;
            });
            $scope.load({
                'person_id': globalData['identifier'],
                'option': 'from',
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
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
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

    $scope.newPost = () => {
        let input = document.querySelector("#btn-newimagepost");
        let minword = $scope.description;
        if (input.files[0] !== undefined && minword.length > 0) {
            loading();
            uploadFile(input.files[0], minword);
//            input.files[0] = undefined;
        } else {
            toastrDelay({
                status: 4,
                tittle: "¡Oh no!",
                information: "A problem has occurred."
            });
        }

    };
    const uploadFile = (file, wordname) => {
        const storageref = firebase.storage().ref("/posts/" + file.name);
        let taskup = storageref.put(file);
        taskup.on("state_changed", (snapshot) => {
            let port = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(port);
        }, (error) => {
            swal.close();
            toastrDelay({
                status: 4,
                tittle: "¡Oh no!",
                information: "A problem has occurred."
            });
            console.log("error", error);
        }, () => {
            console.log(taskup.snapshot);
            taskup.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                let f = new Date();
                let date = f.getDate() + "-" + f.getMonth() + "-" + f.getFullYear() + " " + f.getHours() + ":" + f.getMinutes();
                $scope.savePost({
                    "person_id": $scope.dataUser['identifier'],
                    "description": wordname,
                    "url_image": downloadURL,
                    "date": date
                });
//                console.log({
//                    "person_id": $scope.dataUser['identifier'],
//                    "description": wordname,
//                    "url_image": downloadURL,
//                    "date": date
//                });
            });
        });
    };
    $scope.savePost = (params) => {
        $http({
            method: 'POST',
            url: urlWebServicies + 'publications/newPublication',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params)
        }).then(function (response) {
            console.log(response.data);
            let data = response.data;
            if (data.status === 2) {
//                $scope.posts = data.data;
                $scope.load({
                    'person_id': globalData['identifier'],
                    'option': 'from',
                });
            }
            data.tittle = "Save Post.";
            toastrDelay(data);
            swal.close();
        }, function (response) {
            console.log(response);
            swal.close();
            toastrDelay({
                status: 4,
                tittle: "¡Oh no!",
                information: "A problem has occurred."
            });
        });
    };
});