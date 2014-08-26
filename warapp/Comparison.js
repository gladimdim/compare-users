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
			value: first_ach[key]
		});

		d3Obj[1].values.push({
			label: name_i18n,
			value: second_ach[key]
		});


		joint_achievements.push({
			name: key,
			compare_data: [first_ach[key], second_ach[key]],
			color: function(key) {
				if (first_ach[key] < second_ach[key]) {
					return "bg-danger";
				} else if (first_ach[key] === second_ach[key]) {
					return "bg-info";
				} else  {
					return "bg-success";
				}
			},
			key: key,
			values: [first_ach[key], second_ach[key]]
		});
	}

	return {
		getComparedAchievements: function() {return joint_achievements},
		getD3ComparedData: function() {return d3Obj;}
	};
}