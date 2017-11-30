package models

import (
	"github.com/zebresel-com/mongodm"
)

const (
	OrganizationModelName      = "Organization"
	OrganizationCollectionName = "orgs"
)

type Organization struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`

	Name    string   `json:"name" bson:"name" minLen:"1" maxLen:"255" required:"true" valid:"MinSize(1);MaxSize(255)"`
	Address *Address `json:"address" bson:"address"`
}
