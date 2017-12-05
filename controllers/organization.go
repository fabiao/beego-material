package controllers

import (
	"net/http"
	"strings"

	"github.com/fabiao/beego-material/models"
	"github.com/fabiao/beego-material/utils"
	"gopkg.in/mgo.v2/bson"
)

type OrganizationController struct {
	AuthenticatedController
}

func (self *OrganizationController) Prepare() {
	self.AuthenticatedController.Prepare()
}

func (self *OrganizationController) Create() {
	db := utils.GetDbManager()

	Org := db.Organization()
	org := &models.Organization{}

	err, requestMap := Org.New(org, self.Ctx.Input.RequestBody)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	if valid, errors := org.Validate(requestMap); valid {
		err = org.Save()
		if err != nil {
			self.ServeError(http.StatusInternalServerError, err.Error())
			return
		}
	} else {
		self.ServeErrors(http.StatusBadRequest, utils.ToErrorStrings(errors))
		return
	}

	err = org.Save()
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	self.ServeContent("org", org)
}

func (self *OrganizationController) Update() {
	db := utils.GetDbManager()

	Org := db.Organization()
	org := &models.Organization{}

	err, requestMap := Org.New(org, self.Ctx.Input.RequestBody)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	if valid, errors := org.Validate(requestMap); valid {
		err = org.Save()
		if err != nil {
			self.ServeError(http.StatusInternalServerError, err.Error())
			return
		}
	} else {
		self.ServeErrors(http.StatusBadRequest, utils.ToErrorStrings(errors))
		return
	}

	err = org.Save()
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	self.ServeContent("org", org)
}

func (self *OrganizationController) GetAny() {
	db := utils.GetDbManager()

	Org := db.Organization()
	orgs := []*models.Organization{}

	filter := bson.M{"deleted": false}
	if self.paging.searchValue != "" {
		if self.paging.searchField != "" {
			filter = bson.M{"deleted": false, self.paging.searchField: self.paging.searchValue}
		} else {
			splitted := strings.Split(self.paging.searchValue, " ")
			regexArray := []interface{}{}

			for _, value := range splitted {
				if len(value) > 0 {
					regexArray = append(regexArray, &bson.RegEx{Pattern: value, Options: "i"})
				}
			}

			filter = bson.M{
				"deleted": false,
				"$or": []interface{}{
					bson.M{"name": bson.M{"$in": regexArray}},
				}}
		}
	}

	query := Org.Find(filter)
	queryCount, queryErr := query.Count()
	if queryErr != nil {
		self.ServeError(http.StatusInternalServerError, queryErr.Error())
		return
	}

	err := query.Sort("name").Skip(self.paging.skip).Limit(self.paging.limit).Exec(&orgs)
	if len(orgs) > 0 && err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	self.response.CreatePaging(self.paging.skip, self.paging.limit, queryCount, len(orgs))
	self.ServeContent("orgs", orgs)
}

func (self *OrganizationController) Get() {
	var orgId string
	err := self.Ctx.Input.Bind(&orgId, "orgId")
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	db := utils.GetDbManager()

	Org := db.Organization()
	org := &models.Organization{}

	err = Org.FindId(bson.ObjectIdHex(orgId)).Exec(org)
	if err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	self.ServeContent("org", org)
}
