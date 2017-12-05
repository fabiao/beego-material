package controllers

import (
	"encoding/json"

	"github.com/fabiao/beego-material/models"
	"github.com/fabiao/beego-material/utils"
)

// AccountController : here you tell us what AccountController is
type AccountController struct {
	BaseController
}

// Signin : here you tell us what Signin is
func (ac *AccountController) Signin() {
	var signin models.Signin
	json.Unmarshal(ac.Ctx.Input.RequestBody, &signin)

	token, user, code, err := utils.Signin(signin)
	if err != nil {
		ac.ServeError(code, err.Error())
		return
	}

	ac.ServeContents(map[string]interface{}{
		"token": token,
		"user":  user,
	})
}

func (self *AccountController) Signup() {
	var signup models.Signup
	json.Unmarshal(self.Ctx.Input.RequestBody, &signup)

	token, user, code, err := utils.Signup(signup)
	if err != nil {
		self.ServeError(code, err.Error())
		return
	}

	self.ServeContents(map[string]interface{}{
		"token": token,
		"user":  user,
	})
}

func (self *AccountController) GetRouteBindings() {
	rc := utils.GetRouteChecker()
	routeBindings := rc.GetRouteBindings()
	self.ServeContent("routeBindings", routeBindings)
}
