package models

import (
	"github.com/zebresel-com/mongodm"
)

const (
	UserModelName      = "User"
	UserCollectionName = "users"
)

type SessionUser struct {
	FirstName string   `json:"firstName" bson:"firstName" minLen:"2" maxLen:"30" required:"true" valid:"Required;MinSize(2);MaxSize(30)"`
	LastName  string   `json:"lastName" bson:"lastName" minLen:"2" maxLen:"30" required:"true" valid:"Required;MinSize(2);MaxSize(30)"`
	Email     string   `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true" valid:"Required;Email;MinSize(5);MaxSize(255)"`
	Address   *Address `json:"address" bson:"address"`
}

type User struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`
	SessionUser          `json:",inline" bson:",inline"`

	PasswordHash string `json:"-" bson:"passwordHash"`
	PasswordSalt string `json:"salt" bson:"salt"`
}
