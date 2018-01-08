package controllers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/fabiao/beego-material/backend/models"
	"github.com/fabiao/beego-material/backend/utils"
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
	var model models.OrganizationNew
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &model)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	org := &models.Organization{}
	err, _ = Org.New(org)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	org.Name = model.Name
	org.Address = model.Address

	if valid, errors := org.DefaultValidate(); valid {
		err = org.Save()
		if err != nil {
			self.ServeError(http.StatusBadRequest, err.Error())
			return
		}
	} else {
		self.ServeErrors(http.StatusBadRequest, utils.ToErrorStrings(errors))
		return
	}

	self.ServeContent("org", org)
}

func (self *OrganizationController) Update() {
	db := utils.GetDbManager()

	Org := db.Organization()
	var model models.OrganizationEdit
	err := json.Unmarshal(self.Ctx.Input.RequestBody, &model)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	org := &models.Organization{}
	err = Org.FindId(model.Id).Exec(org)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	org.Name = model.Name
	org.Address = model.Address

	if valid, errors := org.DefaultValidate(); valid {
		err = org.Save()
		if err != nil {
			self.ServeError(http.StatusBadRequest, err.Error())
			return
		}
	} else {
		self.ServeErrors(http.StatusBadRequest, utils.ToErrorStrings(errors))
		return
	}

	self.ServeContent("org", org)
}

func (self *OrganizationController) GetAny() {
	db := utils.GetDbManager()

	Org := db.Organization()
	orgs := []*models.Organization{}

	filter := bson.M{"deleted": false}
	if self.paging.SearchValue != "" {
		if self.paging.SearchField != "" {
			filter = bson.M{"deleted": false, self.paging.SearchField: self.paging.SearchValue}
		} else {
			splitted := strings.Split(self.paging.SearchValue, " ")
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

	err := query.Sort("name").Skip(self.paging.Skip).Limit(self.paging.Limit).Exec(&orgs)
	if len(orgs) > 0 && err != nil {
		self.ServeError(http.StatusInternalServerError, err.Error())
		return
	}

	/*allOrgs := []*models.Organization{}
	for i := 1; i <= 101; i++ {
		org := &models.Organization{}
		indexString := strconv.Itoa(i)
		org.Id = bson.ObjectId(indexString)
		org.Name = "Org n." + indexString
		org.Address = &models.Address{
			Street:  "Via le mani dal naso n. 1" + indexString,
			ZipCode: "11100",
			City:    "Aosta",
		}
		allOrgs = append(allOrgs, org)
	}
	numRecords := len(allOrgs)
	lastIndex := self.paging.Skip + self.paging.Limit
	if lastIndex > numRecords {
		lastIndex = numRecords
	}
	orgs = allOrgs[self.paging.Skip:lastIndex]*/

	self.paging.Rows = queryCount

	self.ServeContents(map[string]interface{}{"pagination": self.paging, "orgs": orgs})
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
