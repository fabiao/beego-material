package models

import (
	"github.com/zebresel-com/mongodm"
	"gopkg.in/mgo.v2/bson"
)

const (
	OrganizationModelName      = "Organization"
	OrganizationCollectionName = "orgs"
)

type OrganizationNew struct {
	Name    string   `json:"name" bson:"name" minLen:"1" maxLen:"255" required:"true" valid:"MinSize(1);MaxSize(255)"`
	Address *Address `json:"address" bson:"address"`
}

type OrganizationEdit struct {
	Id              bson.ObjectId `json:"id" bson:"_id,omitempty"`
	OrganizationNew `json:",inline" bson:",inline"`
}

type Organization struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`
	OrganizationNew      `json:",inline" bson:",inline"`
}
