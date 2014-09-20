var app = angular.module("warapp", []);
var app_id = "ac8d8479ff8f65e649d928b2d82fea68";

app.controller("WargamingController", function($scope) {
    var that = this;
    this.first_user = 'zopikrotik';
    this.second_user = 'nikbunny';
    this.first_obj = {};
    this.second_obj = {};
    this.compare_object = {};
    this.war_api = new WargamingAPI("ru");
    this.compareUsers = function() {
        Q.all([setObjectForUser(that.first_user), setObjectForUser(that.second_user)]).spread(function(ar1, ar2) {
            that.first_obj = new User(ar1[0], that.first_user, ar1[1].data);
            that.second_obj = new User(ar2[0], that.second_user, ar2[1].data);
            that.compare_object = new Comparison(that.first_obj.getAchievements(), that.second_obj.getAchievements(), that.first_user, that.second_user, that.war_api);
            $scope.$apply();             
        });
    };
});

app.directive("achievementCompare", function() {
    return {
        restrict: "E",
        template: '<div style="background-color: #FFCC99">\
            <img ng-src="{{warCtrl.war_api.getAchievementObject(compared.name).image}}" class="img-responsive center-block"></img>\
            {{warCtrl.war_api.getAchievementObject(compared.name).name_i18n || compared.name}} - {{warCtrl.war_api.getAchievementObject(compared.name).description}}</div>\
            <div style="width: 100%; height: 4rem;">\
            <div style="width: 100%; border: 1px solid black;">\
                <div style="width: {{compared.first_width}}; background-color: #3399FF;">{{compared.compare_data[0]}}</div>\
            </div>\
            <div style="width: 100%; border: 1px solid black;">\
                <div style="width: {{compared.second_width}}; background-color: #FF9966;">{{compared.compare_data[1]}}</div>\
            </div>\
            </div>'
    };
});

function setObjectForUser(nickname) {
    var deferred = Q.defer();
    getUserIdByNickname(nickname).then(function(id) {
        console.log(id);
        var iId = id;
        getUserDataById(id).then(function(oUser) {
            user = oUser;
            console.log(user);
            deferred.resolve([iId, oUser]);
        });
    });
    return deferred.promise;
};

function User(id, nickname, data) {
  return {
    "data": data,
    "id": id,
    "nickname": nickname,

    countMedals: function() {
      var ach = this.getAchievements();
      var sum = 0;
      for (var a in ach) {
        sum = sum + ach[a];
      }
      return sum;
    },

    getAchievements: function() {
        return this.data[id].achievements;
    }
  }
};

function getUserIdByNickname(nickname) {
    var url = "https://api.worldoftanks.ru/wot/account/list/?application_id=" + app_id + "&search=" + nickname;
    var deferred = Q.defer();
    requestOkText(url).then(function (response_text) {
        var oJSON = JSON.parse(response_text);
        deferred.resolve(oJSON.data[0].account_id);
    });
    return deferred.promise;
};

function getUserDataById(id) {
    var url = "https://api.worldoftanks.ru/wot/account/info/?application_id=" + app_id + "&account_id=" + id;
    var p = Q.defer();
    requestOkText(url).then(function(response_text) {
        var oJSON = JSON.parse(response_text);
        p.resolve(oJSON);
    });
    return p.promise;
};

function requestOkText(url) {
        "use strict";
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

function getAchievementDescriptions(lang) {
    var url = "https://api.worldoftanks.ru/wot/encyclopedia/achievements/?application_id=" + app_id + "&language=" + lang;
    var p = Q.defer();
    requestOkText(url).then(function(response_text) {
        var oJSON = JSON.parse(response_text);
        p.resolve(oJSON.data);
    });
    return p.promise;
};