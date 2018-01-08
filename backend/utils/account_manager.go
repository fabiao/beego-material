package utils

import (
	"errors"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/fabiao/beego-material/backend/models"
	"github.com/zebresel-com/mongodm"
	"gopkg.in/mgo.v2/bson"
)

const (
	SESSION_TOKEN_EXPIRATION_TIME_MINS = 60
)

func RefreshUserSession(user *models.User) (string, *models.UserBase, int, error) {
	db := GetDbManager()
	timeFunc := jwt.TimeFunc()
	now := timeFunc.Unix()
	expiration := timeFunc.Add(time.Minute * SESSION_TOKEN_EXPIRATION_TIME_MINS).Unix()
	et := EasyToken{
		Username:  user.Id.Hex(),
		IssuedAt:  now,
		ExpiresAt: expiration,
	}

	token, err := et.GetToken()
	if err != nil {
		return "", nil, http.StatusInternalServerError, err
	}

	UserSession := db.UserSession()
	userSession := &models.UserSession{}
	err, _ = UserSession.New(userSession)
	if err != nil {
		return "", nil, http.StatusInternalServerError, err
	}
	userSession.Token = token
	userSession.UserId = user.Id
	err = userSession.Save()
	if err != nil {
		return "", nil, http.StatusInternalServerError, err
	}

	return token, &user.UserBase, http.StatusOK, nil
}

func Signin(login models.Signin) (string, *models.UserBase, int, error) {
	db := GetDbManager()
	User := db.User()
	user := &models.User{}
	err := User.FindOne(bson.M{"email": login.Email}).Exec(user)
	if _, ok := err.(*mongodm.NotFoundError); ok {
		return "", nil, http.StatusUnauthorized, err
	} else if err != nil {
		return "", nil, http.StatusInternalServerError, err
	}

	verified, err := VerifyHash(login.Password, user.PasswordHash, user.PasswordSalt)
	if err != nil {
		return "", nil, http.StatusUnauthorized, err
	} else if !verified {
		return "", nil, http.StatusUnauthorized, errors.New("Unauthorized user")
	}

	return RefreshUserSession(user)
}

func UpdateModelToUser(user *models.User, firstName string, lastName string, email string, password string, confirmPassword string, address *models.Address) (int, error) {
	db := GetDbManager()
	User := db.User()

	num, err := User.Find(
		bson.M{
			"email": email,
			"_id":   bson.M{"$ne": user.Id},
		}).Count()
	if err != nil {
		return http.StatusInternalServerError, err
	} else if num > 0 {
		return http.StatusInternalServerError, errors.New("Email already used by other user")
	}

	if password != confirmPassword {
		return http.StatusInternalServerError, errors.New("Password confirmation don't match")
	}

	passwordHash, passwordSalt, err := HashAndSalt(password)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	user.FirstName = firstName
	user.LastName = lastName
	user.Email = email
	user.Address = address
	user.PasswordHash = passwordHash
	user.PasswordSalt = passwordSalt
	err = user.Save()
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, nil
}

func UpdateModelToUserBase(user *models.User, firstName string, lastName string, email string, address *models.Address) (int, error) {
	db := GetDbManager()
	User := db.User()

	num, err := User.Find(
		bson.M{
			"email": email,
			"_id":   bson.M{"$ne": user.Id},
		}).Count()
	if err != nil {
		return http.StatusInternalServerError, err
	} else if num > 0 {
		return http.StatusInternalServerError, errors.New("Email already used by other user")
	}

	user.FirstName = firstName
	user.LastName = lastName
	user.Email = email
	user.Address = address
	err = user.Save()
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, nil
}

func Signup(model models.Signup) (string, *models.UserBase, int, error) {
	db := GetDbManager()
	User := db.User()
	user := &models.User{}
	err, _ := User.New(user)
	if err != nil {
		return "", nil, http.StatusInternalServerError, err
	}

	code, err := UpdateModelToUser(user, model.FirstName, model.LastName, model.Email, model.Password, model.ConfirmPassword, model.Address)
	if err != nil {
		return "", nil, code, err
	}

	token, sessionUser, code, err := RefreshUserSession(user)
	if err != nil {
		return "", nil, code, err
	}

	return token, sessionUser, http.StatusOK, nil
}

func UpdateAccountBase(model models.UserBase, userId string) (string, *models.UserBase, int, error) {
	db := GetDbManager()
	User := db.User()
	user := &models.User{}
	err := User.FindId(bson.ObjectIdHex(userId)).Exec(user)
	if err != nil {
		return "", nil, http.StatusUnauthorized, err
	}

	code, err := UpdateModelToUserBase(user, model.FirstName, model.LastName, model.Email, model.Address)
	if err != nil {
		return "", nil, code, err
	}

	token, sessionUser, code, err := RefreshUserSession(user)
	if err != nil {
		return "", nil, code, err
	}

	return token, sessionUser, http.StatusOK, nil
}

func UpdateAccount(model models.Signup, userId string) (string, *models.UserBase, int, error) {
	db := GetDbManager()
	User := db.User()
	user := &models.User{}
	err := User.FindId(bson.ObjectIdHex(userId)).Exec(user)
	if err != nil {
		return "", nil, http.StatusUnauthorized, err
	}

	code, err := UpdateModelToUser(user, model.FirstName, model.LastName, model.Email, model.Password, model.ConfirmPassword, model.Address)
	if err != nil {
		return "", nil, code, err
	}

	token, sessionUser, code, err := RefreshUserSession(user)
	if err != nil {
		return "", nil, code, err
	}

	return token, sessionUser, http.StatusOK, nil
}
