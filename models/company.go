package models

import (
	"errors"
	"github.com/zebresel-com/mongodm"
	"gopkg.in/mgo.v2"
)

const (
	CompanyModelName      = "Company"
	CompanyCollectionName = "companies"
)

type Company struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`

	Name     string      `json:"name"  bson:"name" minLen:"2" maxLen:"30" required:"true"`
	Owner    interface{} `json:"owner"  bson:"owner" model:"User" relation:"11" required:"true"`
	Receiver interface{} `json:"receiver"  bson:"receiver"  model:"User" relation:"1n" required:"true"`
	Text     string      `json:"text"  bson:"text" minLen:"1" maxLen:"500" required:"true"`
}

func RegisterCompanyModel(db *mongodm.Connection) (*mongodm.Model, error) {
	db.Register(&Company{}, CompanyCollectionName)
	companyModel := db.Model(CompanyModelName)
	if companyModel == nil {
		return companyModel, errors.New("Company model creation failed")
	}

	err := companyModel.EnsureIndex(
		mgo.Index{
			Key:        []string{"name"},
			Unique:     true,
			DropDups:   false,
			Background: true,
		})
	if err != nil {
		return companyModel, err
	}

	return companyModel, nil
}
