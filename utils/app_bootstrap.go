package utils

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/fabiao/beego-material/models"
	"github.com/zebresel-com/mongodm"
)

func dbSetup() (*mongodm.Model, bool) {
	dbm := GetDbManager()
	if dbm != nil {
		userModel, err := dbm.RegisterModel(&models.User{}, models.UserModelName, models.UserCollectionName, [][]string{{"firstname", "lastname"}, {"email"}})
		if err != nil {
			beego.Error(models.UserModelName+" model registration failed: ", err)
			return nil, false
		}

		_, err = dbm.RegisterModel(&models.Company{}, models.CompanyModelName, models.CompanyCollectionName, [][]string{{"name"}})
		if err != nil {
			beego.Error(models.CompanyModelName+" model registration failed: ", err)
			return nil, false
		}

		return userModel, true
	}

	return nil, false
}

func createAdmin(mongoDmModel *mongodm.Model, roleManager RoleManageable) bool {
	user := &models.User{}
	err, _ := mongoDmModel.New(user)
	if err != nil {
		beego.Error("Administrator creation failed: ", err)
		return false
	}

	user.FirstName = "Fabio"
	user.LastName = "Di Francesco"
	user.Email = "fabio.difrancesco@gmail.com"
	user.Address = &models.Address{
		Street: "Viale Gran San Bernardo 17",
		Zip:    "11100",
		City:   "Aosta",
	}
	passwordHash, passwordSalt, err := HashAndSalt("password")
	if err != nil {
		beego.Error("Administrator password creation failed: ", err)
		return false
	}

	user.PasswordHash = passwordHash
	user.PasswordSalt = passwordSalt
	err = user.Save()
	if err != nil {
		beego.Error("Administrator creation failed: ", err)
		return false
	}

	if !roleManager.Enforcer().AddRoleForUser(user.Email, "administrator") {
		beego.Error("Administrator role addiction failed: ", err)
		return false
	}

	return true
}

func AppBootstrap() bool {
	if beego.BConfig.RunMode == "dev" {
		beego.BConfig.WebConfig.DirectoryIndex = true
	}

	// Log on file and console
	logs.SetLogger(logs.AdapterFile, `{"filename":"logs/history.log","level":7,"maxlines":0,"maxsize":0,"daily":true,"maxdays":7}`)

	userModel, state := dbSetup()
	if !state {
		return false
	}

	rm := GetRoleManager()
	if rm != nil {
		numUsers, err := userModel.Count()
		if err != nil {
			beego.Error("User count failed: ", err)
			return false
		}
		if numUsers == 0 {
			if createAdmin(userModel, rm) {
				beego.Info("Administrator with default info created")
			}
		}
	}

	beego.Info("App bootstrap completed")
	return true
}
