package models

import (
	"github.com/zebresel-com/mongodm"
	"gopkg.in/mgo.v2/bson"
)

const (
	UserModelName      = "User"
	UserCollectionName = "users"
)

type BaseUser struct {
	FirstName string   `json:"firstName" bson:"firstName" minLen:"2" maxLen:"30" required:"true" valid:"Required;MinSize(2);MaxSize(30)"`
	LastName  string   `json:"lastName" bson:"lastName" minLen:"2" maxLen:"30" required:"true" valid:"Required;MinSize(2);MaxSize(30)"`
	Email     string   `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true" valid:"Required;Email;MinSize(5);MaxSize(255)"`
	Address   *Address `json:"address" bson:"address"`
}

type User struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`
	BaseUser             `json:",inline" bson:",inline"`

	PasswordHash string `json:"-" bson:"passwordHash"`
	PasswordSalt string `json:"salt" bson:"salt"`
}

type SessionUser struct {
	BaseUser `json:",inline" bson:",inline"`
	Roles    []string `json:"roles" bson:"roles"`
}

type UserToUpdate struct {
	Id              bson.ObjectId `json:"id" bson:"_id,omitempty"`
	FirstName       string        `json:"firstName" bson:"firstName" minLen:"2" maxLen:"30" required:"true" valid:"Required;MinSize(2);MaxSize(30)"`
	LastName        string        `json:"lastName" bson:"lastName" minLen:"2" maxLen:"30" required:"true" valid:"Required;MinSize(2);MaxSize(30)"`
	Email           string        `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true" valid:"Required;Email;MinSize(5);MaxSize(255)"`
	Address         *Address      `json:"address" bson:"address"`
	Password        string        `json:"password" bson:"password" minLen:"5" maxLen:"255" valid:"MaxSize(255)"`
	ConfirmPassword string        `json:"confirmPassword" bson:"confirmPassword" minLen:"5" maxLen:"255" valid:"MaxSize(255)"`
}

type UpdatedUser struct {
	Id        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	FirstName string        `json:"firstName" bson:"firstName" minLen:"2" maxLen:"30" required:"true" valid:"Required;MinSize(2);MaxSize(30)"`
	LastName  string        `json:"lastName" bson:"lastName" minLen:"2" maxLen:"30" required:"true" valid:"Required;MinSize(2);MaxSize(30)"`
	Email     string        `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true" valid:"Required;Email;MinSize(5);MaxSize(255)"`
	Address   *Address      `json:"address" bson:"address"`
}
