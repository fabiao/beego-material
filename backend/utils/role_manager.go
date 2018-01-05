package utils

import (
	"github.com/casbin/casbin"
	"github.com/casbin/mongodb-adapter"
)

const (
	RBAC_MODEL_FILE = "conf/rbac_model.conf"
)

const (
	SUPERADMIN = "superadmin"
	ORG_ADMIN  = "org_admin"
	ORG_EDITOR = "org_editor"
	ORG_VIEWER = "org_viewer"
)

type RoleManageable interface {
	E() *casbin.Enforcer
	GetUserRoles(userId string) []string
	GetRoleAllowedPaths(role string) []string
}

type RoleManager struct {
	enforcer *casbin.Enforcer
}

var rm RoleManageable

func GetRoleManager() RoleManageable {
	if rm == nil {
		a := mongodbadapter.NewAdapter(DB_HOST + "/" + DB_NAME)
		enforcer := casbin.NewEnforcer(RBAC_MODEL_FILE, a)

		instance := &RoleManager{enforcer: enforcer}
		rm = instance
	}

	return rm
}

func (self *RoleManager) E() *casbin.Enforcer {
	return self.enforcer
}

func (self *RoleManager) GetUserRoles(userId string) []string {
	groups := self.enforcer.GetFilteredGroupingPolicy(0, userId)
	roles := []string{}
	for _, g := range groups {
		if len(g) > 1 {
			roles = append(roles, g[1])
		}
	}

	return roles
}

func (self *RoleManager) GetRoleAllowedPaths(role string) []string {
	policies := rm.E().GetFilteredPolicy(0, role)
	allowedPaths := []string{}
	for _, p := range policies {
		if len(p) > 2 {
			allowedPaths = append(allowedPaths, p[2])
		}
	}

	return allowedPaths
}
