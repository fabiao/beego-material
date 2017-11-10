package models

import (
	"errors"
	"github.com/zebresel-com/mongodm"
	"gopkg.in/mgo.v2"
)

const (
	UserModelName      = "User"
	UserCollectionName = "users"
)

type Address struct {
	Street string `json:"street" bson:"street"`
	City   string `json:"city" bson:"city"`
	Zip    string `json:"zip" bson:"zip"`
}

type Login struct {
	Email    string `json:"email" bson:"email" validation:"email" required:"true"`
	Password string `json:"password" bson:"password"`
}

type User struct {
	mongodm.DocumentBase `json:",inline" bson:",inline"`

	FirstName    string   `json:"firstname"  bson:"firstname" minLen:"2" maxLen:"30" required:"true"`
	LastName     string   `json:"lastname"  bson:"lastname" minLen:"2" maxLen:"30" required:"true"`
	Email        string   `json:"email" bson:"email" validation:"email" minLen:"5" maxLen:"255" required:"true"`
	PasswordHash string   `json:"-" bson:"passwordHash"`
	PasswordSalt string   `json:"salt" bson:"salt"`
	Address      *Address `json:"address" bson:"address"`
}

func RegisterUserModel(db *mongodm.Connection) (*mongodm.Model, error) {
	db.Register(&User{}, UserCollectionName)
	userModel := db.Model(UserModelName)
	if userModel == nil {
		return userModel, errors.New("User model creation failed")
	}

	err := userModel.EnsureIndex(
		mgo.Index{
			Key:        []string{"firstname", "lastname"},
			Unique:     true,
			DropDups:   false,
			Background: true,
		})
	if err != nil {
		return userModel, err
	}

	err = userModel.EnsureIndex(
		mgo.Index{
			Key:        []string{"email"},
			Unique:     true,
			DropDups:   false,
			Background: true,
		})
	if err != nil {
		return userModel, err
	}

	return userModel, nil
}

func (self *User) Validate(values ...interface{}) (bool, []error) {
	var valid bool
	var validationErrors []error
	valid, validationErrors = self.DefaultValidate()
	type m map[string]string
	if len(values) > 0 {
		//expect password as first param then validate it with the next rules
		if password, ok := values[0].(string); ok {
			if len(password) < 8 {
				self.AppendError(&validationErrors, mongodm.L("validation.field_minlen", "password", 8))
			} else if len(password) > 50 {
				self.AppendError(&validationErrors, mongodm.L("validation.field_maxlen", "password", 50))
			}
		} else {
			self.AppendError(&validationErrors, mongodm.L("validation.field_required", "password"))
		}
	}

	if len(validationErrors) > 0 {
		valid = false
	}

	return valid, validationErrors
}
