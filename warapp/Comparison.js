var Comparison = function(first_ach, second_ach, u1, u2, war_api) {
	var joint_achievements = [];
	var first_keys = Object.keys(first_ach);
	var second_keys = Object.keys(second_ach);
	var key;

	for (key in first_ach) {
		if (first_ach[key] === second_ach[key] && first_ach[key] === 0) {
			continue;
		}
		var ach = war_api.getAchievementObject(key);
		var name_i18n;
		if (ach) {
			name_i18n = ach.name_i18n;
		} else {
			name_i18n = key;
		}

		var first_width = 0;
	    var second_width =  0;
	    var first_value = first_ach[key];
	    var second_value = second_ach[key];
	    if (first_value === 0) {
	    	first_width = "0%";
	    	second_width = "100%";
	    } else if (second_value === 0) {
			first_width = "100%";
	    	second_width = "0%";
	    } else if (first_value >= second_value) {
	        first_width = "100%";
	        second_width = 100 * second_value / first_value;
	        second_width = second_width + "%";
	    } else {
	        second_width = "100%";
	        first_width = 100 * first_value / second_value;
	        first_width = first_width + "%";
	    }

		joint_achievements.push({
			name: key,
			compare_data: [first_value, second_value],
			"first_width": first_width,
			"second_width": second_width
		});
	}

	return {
		getComparedAchievements: function() {return joint_achievements},
	};
}