var WargamingAPI = function(language) {
	var that = this;
	this.lang = language || "ru"; 

	var _getAchievements = function(lang) {
	    var url = "https://api.worldoftanks.ru/wot/encyclopedia/achievements/?application_id=" + app_id + "&language=" + lang;
	    var p = Q.defer();
	    requestOkText(url).then(function(response_text) {
	        var oJSON = JSON.parse(response_text);
	        p.resolve(oJSON.data);
	    });
	    return p.promise;
	};

	var achievements = {};
	_getAchievements(this.lang).then(function(achievements) {
		that.achievements = achievements;
	});

	var transformKeyToCamelCase = function (key) {
		var i = key.indexOf("_");
		if (key === "max_killing_series") {
			console.log("debug");
		}
		var new_key = key.replace("_", "");
		if (new_key === key) {
			return key;
		} else {
			new_key = new_key.substr(0, i) + new_key[i].toUpperCase() + new_key.substr(i + 1);
			return transformKeyToCamelCase(new_key);
		}
	};
	//some names of achievements cannot be transformed by just removing '_' and doing camel case
	//we need to hard-code corresponding mappings
	var transformKeyForSeries = function(key) {
		var series_keys = {
			"max_sniper_series": "titleSniper",
			"max_piercing_series": "armorPiercer",
			"max_killing_series": "handOfDeath",
			"max_invincible_series": "invincible" ,
			"max_diehard_series": "diehard",
			"tank_expert_japan": "tankExpert5",
			"tank_expert_ussr": "tankExpert0",
			"tank_expert_germany": "tankExpert1",
			"tank_expert_usa": "tankExpert2",
			"tank_expert_china": "tankExpert3",
			"tank_expert_france": "tankExpert4"
		};
		return series_keys[key] || key;
	}

	return {
		getAchievementObject: function(key) {
			//check if key is in list exceptional names
			var new_key = transformKeyForSeries(key);
			//make it camel case. E.g. : "max_series -> maxSeries"
			new_key = transformKeyToCamelCase(new_key);
			var ach = that.achievements[new_key];
			return ach;
		}
	}
}