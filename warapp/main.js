var app = angular.module("warapp", ["nvd3"]);
var app_id = "ac8d8479ff8f65e649d928b2d82fea68";

app.controller("WargamingController", function($scope) {
    var that = this;
    this.first_user = 'zopikrotik';
    this.second_user = 'nikbunny';
    this.first_obj = {};
    this.second_obj = {};
    this.compare_object = {};
    this.showChart = true;
    this.war_api = new WargamingAPI("ru");
    this.chart_options = generateChartOptions();
    this.compareUsers = function() {
        Q.all([setObjectForUser(that.first_user), setObjectForUser(that.second_user)]).spread(function(ar1, ar2) {
            that.first_obj = new User(ar1[0], that.first_user, ar1[1].data);
            that.second_obj = new User(ar2[0], that.second_user, ar2[1].data);
            that.compare_object = new Comparison(that.first_obj.getAchievements(), that.second_obj.getAchievements(), that.first_user, that.second_user, that.war_api);
            $scope.$apply();             
        });
    };

});

function generateChartOptions() {
    return {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 2000,
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            stacked: true,
            showControls: false,
            interactive: true,
            tooltips: true,
            tooltip: function(key, x, y, e, graph) {
                    return "<div style='background-color: #d66666'>" + key + "</div>\
                     <divzzzz>" + x + ":" + y + "</div>";
            },
            transitionDuration: 500,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function(d){
                    return d3.format(',.2f')(d);
                }
            },
            margin: {
                top: 30,
                right: 20,
                bottom: 50,
                left: 175
            }
        }
    }
}

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