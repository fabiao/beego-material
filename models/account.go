package models

import (
	"github.com/zebresel-com/mongodm"
	"gopkg.in/mgo.v2/bson"
)

const (
	UserSessionModelName      = "UserSession"
	UserSessionCollectionName = "userSessions"
)

type Signin struct {
	Email    string `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true"`
	Password string `json:"password" bson:"password" minLen:"5" maxLen:"255"`
}

type Signup struct {
	FirstName       string   `json:"firstName" bson:"firstName" minLen:"1" maxLen:"255" required:"true"`
	LastName        string   `json:"lastName" bson:"lastName" minLen:"1" maxLen:"255" required:"true"`
	Email           string   `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true"`
	Password        string   `json:"password" bson:"password" minLen:"5" maxLen:"255"`
	ConfirmPassword string   `json:"confirmPassword" bson:"confirmPassword" minLen:"5" maxLen:"255"`
	Address         *Address `json:"address" bson:"address"`
}

type UserSession struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`

	UserId bson.ObjectId `bson:"userId" required:"true"`
	Token  string        `bson:"token" required:"true"`
}
