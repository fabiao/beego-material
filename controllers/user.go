package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego/validation"
	"github.com/fabiao/beego-material/models"
	"github.com/fabiao/beego-material/utils"
	"gopkg.in/mgo.v2/bson"
	"net/http"
	"strings"
)

type UserController struct {
	AuthenticatedController
}

func (self *UserController) Create() {
	db := utils.GetDbManager()

	User := db.Connection().Model(models.UserModelName)
	user := &models.User{}

	// See https://godoc.org/github.com/zebresel-com/mongodm#Model.New
	err, requestMap := User.New(user, self.Ctx.Input.RequestBody)
	if err != nil {
		self.response.CustomError(http.StatusBadRequest, 0, err.Error())
		return
	}

	/**
	 * Use a custom validation for the field password.err, requestMap := User.New(user, self.Ctx.Input.RequestBody)
	if err != nil {
		self.minlen(http.StatusBadRequest, err)
		return
	 * The default validation will be called automatically within this step.
	*/
	if valid, issues := user.Validate(requestMap["password"]); valid {
		// See https://godoc.org/github.com/zebresel-com/mongodm#DocumentBase.Save
		err = user.Save()
		if err != nil {

			self.response.Error(http.StatusInternalServerError)
			return
		}
	} else {
		self.response.Error(http.StatusBadRequest, issues)
		return
	}

	self.response.AddContent("user", user)
	self.response.SetStatus(http.StatusCreated)
	self.response.ServeJSON()
}

func (self *UserController) Update() {
	var updateAccount models.UpdateAccount
	json.Unmarshal(self.Ctx.Input.RequestBody, &updateAccount)

	valid := validation.Validation{}
	isValid, err := valid.Valid(&updateAccount)
	if err != nil {
		self.response.CustomError(http.StatusInternalServerError, 0, err.Error())
		return
	}
	if !isValid {
		errors := make([]string, len(valid.Errors))
		for i, v := range valid.Errors {
			errors[i] = v.Error()
		}
		self.response.Error(http.StatusBadRequest, errors)
		return
	}

	userId, err := self.getUserId()
	if err != nil {
		self.response.CustomError(http.StatusUnauthorized, 0, err.Error())
		return
	}

	token, sessionUser, code, err := utils.Update(updateAccount, userId)
	if err != nil {
		self.response.CustomError(code, 0, err.Error())
		return
	}

	self.response.AddContent("token", token)
	self.response.AddContent("user", sessionUser)
	self.response.SetStatus(http.StatusOK)
	self.response.ServeJSON()
}

func (self *UserController) GetAll() {
	db := utils.GetDbManager()

	User := db.Connection().Model(models.UserModelName)
	users := []*models.User{}

	searchTag := self.GetString("search")
	fieldName := self.GetString("field")

	query := bson.M{"deleted": false}

	if searchTag != "" {

		if fieldName != "" {

			query = bson.M{"deleted": false, fieldName: searchTag}

		} else {

			splitted := strings.Split(searchTag, " ")
			regexArray := []interface{}{}

			for _, value := range splitted {

				if len(value) > 0 {
					regexArray = append(regexArray, &bson.RegEx{Pattern: value, Options: "i"})
				}
			}

			query = bson.M{
				"deleted": false,
				"$or": []interface{}{
					bson.M{"firstName": bson.M{"$in": regexArray}},
					bson.M{"lastName": bson.M{"$in": regexArray}},
					bson.M{"email": bson.M{"$in": regexArray}},
					bson.M{"username": bson.M{"$in": regexArray}},
				}}
		}
	}

	queryCount, queryErr := User.Find(query).Count()

	if queryErr != nil {

		self.response.Error(http.StatusInternalServerError)
		return
	}

	err := User.Find(query).Sort("-createdAt").Skip(self.paging.skip).Limit(self.paging.take).Exec(&users)

	if len(users) > 0 && err != nil {
		self.response.Error(http.StatusInternalServerError)
		return
	}

	self.response.CreatePaging(self.paging.skip, self.paging.take, queryCount, len(users))
	self.response.AddContent(models.UserCollectionName, users)
	self.response.SetStatus(http.StatusOK)
	self.response.ServeJSON()
}

func (self *UserController) Get() {
	db := utils.GetDbManager()

	User := db.Connection().Model(models.UserModelName)
	user := &models.User{}

	userId, err := self.AuthenticatedController.getUserId()
	if err != nil {
		self.response.Error(http.StatusInternalServerError, err)
		return
	}
	err = User.FindId(bson.ObjectIdHex(userId)).Exec(user)
	if err != nil {
		self.response.Error(http.StatusInternalServerError, err)
		return
	}

	self.response.AddContent("user", user.SessionUser)
	self.response.SetStatus(http.StatusOK)
	self.response.ServeJSON()
}
