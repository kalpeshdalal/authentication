const roles = ["user", "admin", "superAdmin"];
const adminRoles = ["admin", "superAdmin"]; // Admin and SuperAdmin roles can log in to the dashboard

const roleRights = new Map();

roleRights.set(roles[0], ["getUsers", "manageUsers"]);

roleRights.set(roles[1], ["getUsers", "adminAccess", "manageUsers"]);

roleRights.set(roles[2], [
	"getUsers",
	"adminAccess",
	"manageUsers",
	"manageAdmins",
	"fullAccess",
]); // SuperAdmin rights include everything plus more administrative controls

module.exports = {
	roles,
	roleRights,
	adminRoles,
};
