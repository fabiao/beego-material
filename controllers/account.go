package controllers

import (
	"encoding/json"
	"github.com/fabiao/beego-material/models"
	"github.com/fabiao/beego-material/utils"
	"net/http"
)

type AccountController struct {
	BaseController
}

func (self *AccountController) Signin() {
	var signin models.Signin
	json.Unmarshal(self.Ctx.Input.RequestBody, &signin)

	token, user, code, err := utils.Signin(signin)
	if err != nil {
		self.response.CustomError(code, 0, err.Error())
		return
	}

	self.response.AddContent("token", token)
	self.response.AddContent("user", user)
	self.response.SetStatus(http.StatusOK)
	self.response.ServeJSON()
}

func (self *AccountController) Signup() {
	var signup models.Signup
	json.Unmarshal(self.Ctx.Input.RequestBody, &signup)

	token, user, code, err := utils.Signup(signup)
	if err != nil {
		self.response.CustomError(code, 0, err.Error())
		return
	}

	self.response.AddContent("token", token)
	self.response.AddContent("user", user)
	self.response.SetStatus(http.StatusOK)
	self.response.ServeJSON()
}