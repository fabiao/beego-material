package models

import (
	"github.com/zebresel-com/mongodm"
)

const (
	UserModelName      = "User"
	UserCollectionName = "users"
)

type SessionUser struct {
	FirstName string `json:"firstName"  bson:"firstName" minLen:"2" maxLen:"30" required:"true"`
	LastName  string `json:"lastName"  bson:"lastName" minLen:"2" maxLen:"30" required:"true"`
	Email     string `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true"`
}

type User struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`
	SessionUser          `json:",inline" bson:",inline"`

	PasswordHash string   `json:"-" bson:"passwordHash"`
	PasswordSalt string   `json:"salt" bson:"salt"`
	Address      *Address `json:"address" bson:"address"`
}
