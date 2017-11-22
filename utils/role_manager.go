package utils

import (
	"encoding/json"
	"github.com/astaxie/beego"
	"github.com/casbin/casbin"
	"github.com/casbin/mongodb-adapter"
	"github.com/fabiao/beego-material/models"
	"io/ioutil"
)

const (
	RBAC_CONFIG_FILE = "conf/rbac_policy.conf"
	ROLES_FILE       = "conf/roles.json"
)

const (
	SUPERADMIN = "superadmin"
	ADMIN = "admin"
	EMPLOYEE = "employee"
	REVIEWER = "reviewer"
)

type RoleManageable interface {
	GetRoles() map[string]*models.Role
	GetRole(roleName string) *models.Role
	GetRoleNamesForUser(user *models.User) []string
	GetRolesForUser(user *models.User) map[string]*models.Role
	GetUserIdsForRole(role *models.Role) []string
	HasRoleForUser(user *models.User, role *models.Role) bool
	AddRoleForUser(user *models.User, role *models.Role) bool
	DeleteRoleForUser(user *models.User, role *models.Role) bool
	DeleteRolesForUser(user *models.User) bool
	DeleteUser(user *models.User) bool
	DeleteRole(role string)
	DeletePermission(permission ...string) bool
	AddPermissionForRole(role *models.Role, permission ...string) bool
	DeletePermissionForRole(role *models.Role, permission ...string) bool
	DeletePermissionsForRole(role *models.Role) bool
	AddPermissionForUser(user *models.User, permission ...string) bool
	DeletePermissionForUser(user *models.User, permission ...string) bool
	DeletePermissionsForUser(user *models.User) bool
	GetPermissionsForUser(user *models.User) [][]string
	HasPermissionForUser(user *models.User, permission ...string) bool
	GetRoleNamesForUserInCompany(user *models.User, company *models.Company) []string
	GetRolesForUserInCompany(user *models.User, company *models.Company) map[string]*models.Role
	GetPermissionsForUserInCompany(user *models.User, company *models.Company) [][]string
	AddRoleForUserInCompany(user *models.User, role *models.Role, company *models.Company) bool
	DeleteRoleForUserInCompany(user *models.User, role *models.Role, company *models.Company) bool
}

type RoleManager struct {
	enforcer *casbin.Enforcer
	roles    map[string]*models.Role
}

var rm RoleManageable

func GetRoleManager() RoleManageable {
	if rm == nil {
		a := mongodbadapter.NewAdapter(DB_HOST + "/" + DB_NAME)
		enforcer := casbin.NewEnforcer(RBAC_CONFIG_FILE, a)

		var roles map[string]*models.Role
		file, err := ioutil.ReadFile(ROLES_FILE)
		if err != nil {
			beego.Critical("Roles file load failed: ", err)
			panic("Roles file load failed: " + err.Error())
		} else {
			err = json.Unmarshal(file, &roles)
			if err != nil {
				beego.Critical("Roles unmarshalling failed: ", err)
				panic("Roles unmarshalling failed: " + err.Error())
			}
		}

		instance := &RoleManager{enforcer: enforcer, roles: roles}
		rm = instance
	}

	return rm
}

func (self *RoleManager) GetRoles() map[string]*models.Role {
	return self.roles
}

func (self *RoleManager) GetRole(roleName string) *models.Role {
	return self.roles[roleName]
}

func (self *RoleManager) GetRoleNamesForUser(user *models.User) []string {
	return self.enforcer.GetRolesForUser(user.Id.String())
}

func (self *RoleManager) GetRolesForUser(user *models.User) map[string]*models.Role {
	roleNames := self.GetRoleNamesForUser(user)
	roles := make(map[string]*models.Role)
	for _, r := range roleNames {
		roles[r] = self.roles[r]
	}
	return roles
}

func (self *RoleManager) GetUserIdsForRole(role *models.Role) []string {
	return self.enforcer.GetUsersForRole(role.Name)
}

func (self *RoleManager) HasRoleForUser(user *models.User, role *models.Role) bool {
	return self.enforcer.HasRoleForUser(user.Id.String(), role.Name)
}

func (self *RoleManager) AddRoleForUser(user *models.User, role *models.Role) bool {
	return self.enforcer.AddRoleForUser(user.Id.String(), role.Name)
}

func (self *RoleManager) DeleteRoleForUser(user *models.User, role *models.Role) bool {
	return self.enforcer.DeleteRoleForUser(user.Id.String(), role.Name)
}

func (self *RoleManager) DeleteRolesForUser(user *models.User) bool {
	return self.enforcer.DeleteRolesForUser(user.Id.String())
}

func (self *RoleManager) DeleteUser(user *models.User) bool {
	return self.enforcer.DeleteUser(user.Id.String())
}

func (self *RoleManager) DeleteRole(role string) {
	self.enforcer.DeleteRole(role)
}

func (self *RoleManager) DeletePermission(permission ...string) bool {
	return self.enforcer.DeletePermission(permission...)
}

func (self *RoleManager) AddPermissionForRole(role *models.Role, permission ...string) bool {
	return self.enforcer.AddPermissionForUser(role.Name, permission...)
}

func (self *RoleManager) DeletePermissionForRole(role *models.Role, permission ...string) bool {
	return self.enforcer.DeletePermissionForUser(role.Name, permission...)
}

func (self *RoleManager) DeletePermissionsForRole(role *models.Role) bool {
	return self.enforcer.DeletePermissionsForUser(role.Name)
}

func (self *RoleManager) AddPermissionForUser(user *models.User, permission ...string) bool {
	return self.enforcer.AddPermissionForUser(user.Id.String(), permission...)
}

func (self *RoleManager) DeletePermissionForUser(user *models.User, permission ...string) bool {
	return self.enforcer.DeletePermissionForUser(user.Id.String(), permission...)
}

func (self *RoleManager) DeletePermissionsForUser(user *models.User) bool {
	return self.enforcer.DeletePermissionsForUser(user.Id.String())
}

func (self *RoleManager) GetPermissionsForUser(user *models.User) [][]string {
	return self.enforcer.GetPermissionsForUser(user.Id.String())
}

func (self *RoleManager) HasPermissionForUser(user *models.User, permission ...string) bool {
	return self.enforcer.HasPermissionForUser(user.Id.String(), permission...)
}

func (self *RoleManager) GetRoleNamesForUserInCompany(user *models.User, company *models.Company) []string {
	return self.enforcer.GetRolesForUserInDomain(user.Id.String(), company.Id.String())
}

func (self *RoleManager) GetRolesForUserInCompany(user *models.User, company *models.Company) map[string]*models.Role {
	roleNames := self.GetRoleNamesForUserInCompany(user, company)
	roles := make(map[string]*models.Role)
	for _, r := range roleNames {
		roles[r] = self.roles[r]
	}
	return roles
}

func (self *RoleManager) GetPermissionsForUserInCompany(user *models.User, company *models.Company) [][]string {
	return self.enforcer.GetPermissionsForUserInDomain(user.Id.String(), company.Id.String())
}

func (self *RoleManager) AddRoleForUserInCompany(user *models.User, role *models.Role, company *models.Company) bool {
	return self.enforcer.AddRoleForUserInDomain(user.Id.String(), role.Name, company.Id.String())
}

func (self *RoleManager) DeleteRoleForUserInCompany(user *models.User, role *models.Role, company *models.Company) bool {
	return self.enforcer.DeleteRoleForUserInDomain(user.Id.String(), role.Name, company.Id.String())
}
