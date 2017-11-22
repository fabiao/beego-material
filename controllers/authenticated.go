package controllers

import (
	"errors"
	"github.com/fabiao/beego-material/utils"
	"gopkg.in/mgo.v2/bson"
	"net/http"
	"strings"
)

type AuthenticatedController struct {
	BaseController
}

func (self *AuthenticatedController) GetToken() string {
	authHeader := self.Ctx.Request.Header.Get("Authorization")
	return strings.TrimSpace(strings.Replace(authHeader, "Bearer", "", -1))
}

func (self *AuthenticatedController) getUserId() (string, error) {
	token := self.GetToken()
	et := utils.EasyToken{}
	isValid, userId, err := et.ValidateToken(token)
	if err != nil {
		return "", err
	}
	if !isValid {
		return "", errors.New("Invalid authorization token found")
	}
	return userId, nil
}

func (self *AuthenticatedController) Prepare() {
	self.BaseController.Prepare()

	userId, err := self.getUserId()
	if err != nil {
		self.response.CustomError(http.StatusUnauthorized, 0, err.Error())
	}

	db := utils.GetDbManager()
	UserSession := db.UserSession()

	num, err := UserSession.FindOne(bson.M{"userId": bson.ObjectIdHex(userId)}).Count()
	if err != nil {
		self.response.CustomError(http.StatusInternalServerError, 0, err.Error())
	} else if num == 0 {
		self.response.CustomError(http.StatusForbidden, 0, "Authorization token expired")
	}
}
