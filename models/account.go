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
	Email    string `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true" valid:"Required;Email;MinSize(5);MaxSize(255)"`
	Password string `json:"password" bson:"password" minLen:"5" maxLen:"255" required:"true" valid:"Required;MinSize(5);MaxSize(255)"`
}

type Signup struct {
	Signin `json:",inline" bson:",inline"`

	FirstName       string   `json:"firstName" bson:"firstName" minLen:"1" maxLen:"255" required:"true" valid:"Required;MinSize(1);MaxSize(255)"`
	LastName        string   `json:"lastName" bson:"lastName" minLen:"1" maxLen:"255" required:"true" valid:"Required;MinSize(1);MaxSize(255)`
	ConfirmPassword string   `json:"confirmPassword" bson:"confirmPassword" minLen:"5" maxLen:"255" required:"true" valid:"Required;MinSize(5);MaxSize(255)"`
	Address         *Address `json:"address" bson:"address"`
}

type UpdateAccount struct {
	FirstName       string   `json:"firstName" bson:"firstName" minLen:"1" maxLen:"255" required:"true" valid:"Required;MinSize(1);MaxSize(255)"`
	LastName        string   `json:"lastName" bson:"lastName" minLen:"1" maxLen:"255" required:"true" valid:"Required;MinSize(1);MaxSize(255)`
	Email           string   `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true" valid:"Required;Email;MinSize(5);MaxSize(255)"`
	Password        string   `json:"password" bson:"password" minLen:"5" maxLen:"255" valid:"MaxSize(255)"`
	ConfirmPassword string   `json:"confirmPassword" bson:"confirmPassword" minLen:"5" maxLen:"255" valid:"MaxSize(255)"`
	Address         *Address `json:"address" bson:"address"`
}

type UserSession struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`

	UserId bson.ObjectId `bson:"userId" required:"true"`
	Token  string        `bson:"token" required:"true"`
}
