package models

import (
	"github.com/zebresel-com/mongodm"
)

const (
	CompanyModelName      = "Company"
	CompanyCollectionName = "companies"
)

type Company struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`

	Name    string   `json:"name"  bson:"name" minLen:"1" maxLen:"255" required:"true"`
	Address *Address `json:"address" bson:"address"`
}
