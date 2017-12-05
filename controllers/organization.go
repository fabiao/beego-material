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

	User := db.User()
	user := &models.User{}

	// See https://godoc.org/github.com/zebresel-com/mongodm#Model.New
	err, requestMap := User.New(user, self.Ctx.Input.RequestBody)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	/**
	 * Use a custom validation for the field password.err, requestMap := User.New(user, self.Ctx.Input.RequestBody)
	if err != nil {
		self.minlen(http.StatusBadRequest, err)
		return
	 * The default validation will be called automatically within this step.
	*/
	if valid, errors := user.Validate(requestMap["password"]); valid {
		// See https://godoc.org/github.com/zebresel-com/mongodm#DocumentBase.Save
		err = user.Save()
		if err != nil {

			self.ServeError(http.StatusInternalServerError, err.Error())
			return
		}
	} else {
		errorStrings := make([]string, len(errors))
		for i, e := range errors {
			errorStrings[i] = e.Error()
		}
		self.ServeErrors(http.StatusBadRequest, errorStrings)
		return
	}

	self.ServeContent("user", user)
}

func (self *UserController) Update() {
	var updateAccount models.UpdateAccount
	json.Unmarshal(self.Ctx.Input.RequestBody, &updateAccount)

	valid := validation.Validation{}
	isValid, err := valid.Valid(&updateAccount)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}
	if !isValid {
		errors := make([]string, len(valid.Errors))
		for i, v := range valid.Errors {
			errors[i] = v.Error()
		}
		self.ServeErrors(http.StatusBadRequest, errors)
		return
	}

	token, sessionUser, code, err := utils.Update(updateAccount, self.currentUserId)
	if err != nil {
		self.ServeError(code, err.Error())
		return
	}

	self.ServeContents(map[string]interface{}{
		"token": token,
		"user":  sessionUser,
	})
}

func (self *UserController) GetAny() {
	db := utils.GetDbManager()

	User := db.User()
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
		self.ServeError(http.StatusInternalServerError, queryErr.Error())
		return
	}

	err := User.Find(query).Sort("-createdAt").Skip(self.paging.skip).Limit(self.paging.take).Exec(&users)

	if len(users) > 0 && err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	self.response.CreatePaging(self.paging.skip, self.paging.take, queryCount, len(users))
	self.ServeContent("users", users)
}

func (self *UserController) Get() {
	db := utils.GetDbManager()

	User := db.User()
	user := &models.User{}

	err := User.FindId(bson.ObjectIdHex(self.currentUserId)).Exec(user)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	self.ServeContent("user", user.SessionUser)
}
