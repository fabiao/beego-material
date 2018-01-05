package controllers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/astaxie/beego/validation"
	"github.com/fabiao/beego-material/backend/models"
	"github.com/fabiao/beego-material/backend/utils"
	"gopkg.in/mgo.v2/bson"
)

type UserController struct {
	AuthenticatedController
}

func (self *UserController) Get() {
	var userId string
	err := self.Ctx.Input.Bind(&userId, "userId")
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	db := utils.GetDbManager()

	User := db.User()
	user := &models.User{}
	err = User.FindId(bson.ObjectIdHex(userId)).Exec(user)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	updatedUser := models.UpdatedUser{
		user.Id,
		models.UserBase{
			user.FirstName,
			user.LastName,
			user.Email,
			user.Address,
		},
	}

	self.ServeContent("user", updatedUser)
}

func (self *UserController) Create() {
	var model models.Signup
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &model)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	valid := validation.Validation{}
	isValid, err := valid.Valid(&model)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}
	if !isValid {
		self.ServeErrors(http.StatusBadRequest, utils.ToValidationErrorStrings(valid.Errors))
		return
	}

	db := utils.GetDbManager()
	User := db.User()
	user := &models.User{}
	err, _ = User.New(user)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	code, err := utils.UpdateModelToUser(user, model.FirstName, model.LastName, model.Email, model.Password, model.ConfirmPassword, model.Address)
	if err != nil {
		self.ServeError(code, err.Error())
		return
	}

	updatedUser := models.UpdatedUser{
		user.Id,
		models.UserBase{
			user.FirstName,
			user.LastName,
			user.Email,
			user.Address,
		},
	}

	self.ServeContent("user", updatedUser)
}

func (self *UserController) Update() {
	var model models.UserToUpdate
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &model)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	valid := validation.Validation{}
	isValid, err := valid.Valid(&model)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}
	if !isValid {
		self.ServeErrors(http.StatusBadRequest, utils.ToValidationErrorStrings(valid.Errors))
		return
	}

	db := utils.GetDbManager()
	User := db.User()
	user := &models.User{}
	err = User.FindId(model.Id).Exec(user)
	if err != nil {
		self.ServeError(http.StatusUnauthorized, err.Error())
		return
	}

	code, err := utils.UpdateModelToUser(user, model.FirstName, model.LastName, model.Email, model.Password, model.ConfirmPassword, model.Address)
	if err != nil {
		self.ServeError(code, err.Error())
		return
	}

	updatedUser := models.UpdatedUser{
		user.Id,
		models.UserBase{
			user.FirstName,
			user.LastName,
			user.Email,
			user.Address,
		},
	}

	self.ServeContent("user", updatedUser)
}

func (self *UserController) UpdateCurrent() {
	var model models.Signup
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &model)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	valid := validation.Validation{}
	isValid, err := valid.Valid(&model)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}
	if !isValid {
		self.ServeErrors(http.StatusBadRequest, utils.ToValidationErrorStrings(valid.Errors))
		return
	}

	token, sessionUser, code, err := utils.UpdateAccount(model, self.currentUserId)
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

	err := User.Find(query).Sort("-createdAt").Skip(self.paging.skip).Limit(self.paging.limit).Exec(&users)

	if len(users) > 0 && err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	paging, _ := self.CreatePaging(self.paging.skip, self.paging.limit, queryCount, len(users))
	self.ServeContents(map[string]interface{}{"pagination": paging, "users": users})
}

func (self *UserController) GetCurrent() {
	db := utils.GetDbManager()

	User := db.User()
	user := &models.User{}

	err := User.FindId(bson.ObjectIdHex(self.currentUserId)).Exec(user)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	self.ServeContent("user", user.UserBase)
}