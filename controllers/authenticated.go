package controllers

import (
	"github.com/juusechec/jwt-beego"
	"strings"
)

type AuthenticatedController struct {
	BaseController
}

func (c *AuthenticatedController) Prepare() {
	authHeader := c.Ctx.Request.Header.Get("Authorization")
	token := strings.TrimSpace(strings.Replace(authHeader, "Bearer", "", -1))
	et := jwtbeego.EasyToken{}
	isValid, _, err := et.ValidateToken(token)
	if err != nil {
		c.response.SetStatus(401)
		c.response.AddContent("error", err.Error())
		c.response.ServeJSON()
	}
	if !isValid {
		c.response.SetStatus(401)
		c.response.AddContent("error", "Invalid authorization token found")
		c.response.ServeJSON()
	}
}
