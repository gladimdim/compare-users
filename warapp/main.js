var app = angular.module("warapp", []);
var app_id = "ac8d8479ff8f65e649d928b2d82fea68";

app.controller("WargamingController", function($scope) {
    var that = this;
    $scope.pressures = [];
    a = 3;
    var b = 3;

    $scope.compareUsers = function() {
        console.log('compare');
        getUserIdByNickname($scope.first_user).then(function(id) {
            console.log(id);
        });
        getUserIdByNickname($scope.second_user).then(function(id) {
            console.log(id);
        });
    }
});

function getUserIdByNickname(nickname) {
    var url = "https://api.worldoftanks.ru/wot/account/list/?application_id=" + app_id + "&search=" + nickname;
    var deferred = Q.defer();
    requestOkText(url).then(function (response_text) {
        var oJSON = JSON.parse(response_text);
        deferred.resolve(oJSON.data[0].account_id);
    });
    return deferred.promise;
};

function requestOkText(url) {
        "use strict";
        /*global XMLHttpRequest */
        /*global Q */
        var request = new XMLHttpRequest(),
            deferred = Q.defer();

        function onload() {
            if (request.status === 200) {
                deferred.resolve(request.responseText);
            } else {
                deferred.reject(new Error("Status code was " + request.status));
            }
        }

        function onerror() {
            deferred.reject(new Error("Can't XHR " + JSON.stringify(url)));
        }

        function onprogress(event) {
            deferred.notify(event.loaded / event.total);
        }
        request.open("GET", url, true);
        request.onload = onload;
        request.onerror = onerror;
        request.onprogress = onprogress;
        request.send();
        return deferred.promise;
};
