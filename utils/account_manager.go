package utils

import (
	"errors"
	"github.com/fabiao/beego-material/models"
	"github.com/juusechec/jwt-beego"
	"github.com/zebresel-com/mongodm"
	"gopkg.in/mgo.v2/bson"
	"net/http"
	"time"
)

const (
	SESSION_TOKEN_EXPIRATION_TIME_SECS = 3600 // 1h
)

func Signin(login models.Signin) (string, *models.SessionUser, int, error) {
	db := GetDbManager()

	User := db.Connection().Model(models.UserModelName)
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

	et := jwtbeego.EasyToken{
		Username: user.Email,
		Expires:  time.Now().Unix() + SESSION_TOKEN_EXPIRATION_TIME_SECS,
	}

	token, err := et.GetToken()
	if err != nil {
		return "", nil, http.StatusInternalServerError, err
	}

	UserSession := db.Connection().Model(models.UserSessionModelName)
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

	return token, &user.SessionUser, http.StatusOK, nil
}

func Signup(signup models.Signup) (string, *models.SessionUser, int, error) {
	db := GetDbManager()
	User := db.Connection().Model(models.UserModelName)

	num, err := User.Find(bson.M{"email": signup.Email}).Count()
	if err != nil {
		return "", nil, http.StatusInternalServerError, err
	} else if num > 0 {
		return "", nil, http.StatusInternalServerError, errors.New("Email already used by other user")
	}

	if signup.Password != signup.ConfirmPassword {
		return "", nil, http.StatusInternalServerError, errors.New("Password confirmation don't match")
	}

	passwordHash, passwordSalt, err := HashAndSalt(signup.Password)
	if err != nil {
		return "", nil, http.StatusInternalServerError, err
	}

	user := &models.User{}
	err, _ = User.New(user)
	if err != nil {
		return "", nil, http.StatusInternalServerError, err
	}
	user.FirstName = signup.FirstName
	user.LastName = signup.LastName
	user.Email = signup.Email
	user.Address = signup.Address
	user.PasswordHash = passwordHash
	user.PasswordSalt = passwordSalt
	err = user.Save()
	if err != nil {
		return "", nil, http.StatusInternalServerError, err
	}

	token, sessionUser, code, err := Signin(models.Signin{signup.Email, signup.Password})
	if err != nil {
		return "", nil, code, err
	}

	return token, sessionUser, http.StatusOK, nil
}
