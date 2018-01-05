package controllers

import (
	"errors"
	"github.com/fabiao/beego-material/backend/utils"
	"net/http"
)

type AuthenticatedController struct {
	BaseController

	currentUserId string
}

func (self *AuthenticatedController) CheckAuthorized(dom string, action string) (int, error) {
	if !utils.GetRoleManager().E().Enforce(self.currentUserId, dom, self.Ctx.Request.URL.Path, action) {
		return http.StatusUnauthorized, errors.New("You are not allowed to access this resource")
	}

	return http.StatusOK, nil
}

func (self *AuthenticatedController) Prepare() {
	self.BaseController.Prepare()
	self.currentUserId = self.Ctx.Input.GetData("currentUserId").(string)
}
