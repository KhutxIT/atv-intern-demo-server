function applyExtraSetup(sequelize) {
	const { user, attendance, role, offwork } = sequelize.models;

	user.belongsToMany(role, { through: "user_roles"});
	role.belongsToMany(user, { through: "user_roles"});

	user.hasMany(attendance);
	attendance.belongsTo(user);

	user.hasMany(offwork);
	offwork.belongsTo(user);
}

module.exports = { applyExtraSetup };
