package utils

import (
	"github.com/casbin/casbin"
	"github.com/casbin/mongodb-adapter"
)

const (
	RBAC_CONFIG_FILE = "conf/rbac_policy.conf"
)

type RoleManageable interface {
	Enforcer() *casbin.Enforcer
}

type RoleManager struct {
	enforcer *casbin.Enforcer
}

var rm RoleManageable

func GetRoleManager() RoleManageable {
	if rm == nil {
		a := mongodbadapter.NewAdapter(DB_HOST + "/" + DB_NAME)
		enforcer := casbin.NewEnforcer(RBAC_CONFIG_FILE, a)
		instance := &RoleManager{enforcer: enforcer}
		rm = instance
	}

	return rm
}

func (self *RoleManager) Enforcer() *casbin.Enforcer {
	return self.enforcer
}
