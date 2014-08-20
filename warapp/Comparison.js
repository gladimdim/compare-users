var Comparison = function(first_ach, second_ach) {
	var joint_achievements = [];
	var first_keys = Object.keys(first_ach);
	var second_keys = Object.keys(second_ach);
	var key;
	for (key in first_ach) {
		if (first_ach[key] === second_ach[key] && first_ach[key] === 0) {
			continue;
		}
		joint_achievements.push({
			name: key,
			compare_data: [first_ach[key], second_ach[key]],
		});
	}
	return {
		getComparedAchievements: function() {return joint_achievements}
	};
}