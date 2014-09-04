var Comparison = function(first_ach, second_ach, u1, u2, war_api) {
	var joint_achievements = [];
	var first_keys = Object.keys(first_ach);
	var second_keys = Object.keys(second_ach);
	var key;
	var d3Obj = [
		{
			key: u1,
			color: "#d67777",
			values: []
		},
		{
			key: u2,
			color: "#4f99b4",
			values: []
		}
	]
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

		d3Obj[0].values.push({
			label: name_i18n,
			value: first_ach[key],
			ref_obj: ach
		});

		d3Obj[1].values.push({
			label: name_i18n,
			value: second_ach[key],
			ref_obj: ach
		});

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
			/*color: function(key) {
				if (first_ach[key] < second_ach[key]) {
					return "bg-danger";
				} else if (first_value === second_value) {
					return "bg-info";
				} else  {
					return "bg-success";
				}
			},*/
			key: key,
			"first_width": first_width,
			"second_width": second_width
		});
	}

	return {
		getComparedAchievements: function() {return joint_achievements},
		getD3ComparedData: function() {return d3Obj;}
	};
}