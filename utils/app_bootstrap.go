package utils

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/fabiao/beego-material/models"
	"gopkg.in/mgo.v2"
	"time"
)

func dbSetup() bool {
	dbm := GetDbManager()
	if dbm != nil {
		_, err := dbm.RegisterModel(&models.User{}, models.UserModelName, models.UserCollectionName, []mgo.Index{
			{
				Key:        []string{"email"},
				Unique:     true,
				DropDups:   false,
				Background: true,
			},
		})
		if err != nil {
			beego.Error(models.UserModelName+" model registration failed: ", err)
			return false
		}

		_, err = dbm.RegisterModel(&models.UserSession{}, models.UserSessionModelName, models.UserSessionCollectionName, []mgo.Index{
			{
				Key:        []string{"userId"},
				Unique:     false,
				Background: true,
			},
			{
				Key:        []string{"token"},
				Unique:     true,
				Background: true,
			},
			{
				Key:         []string{"createdAt"},
				Unique:      false,
				Background:  true,
				ExpireAfter: time.Duration(SESSION_TOKEN_EXPIRATION_TIME_MINS) * time.Minute,
			},
		})
		if err != nil {
			beego.Error(models.UserSessionModelName+" model registration failed: ", err)
			return false
		}

		_, err = dbm.RegisterModel(&models.Company{}, models.CompanyModelName, models.CompanyCollectionName, []mgo.Index{
			{
				Key:        []string{"name"},
				Unique:     true,
				DropDups:   false,
				Background: true,
			},
		})
		if err != nil {
			beego.Error(models.CompanyModelName+" model registration failed: ", err)
			return false
		}

		return true
	}

	return false
}

func createSuperadmin() bool {
	db := GetDbManager()
	User := db.User()
	user := &models.User{}
	err, _ := User.New(user)
	if err != nil {
		beego.Error("Administrator creation failed: ", err)
		return false
	}

	user.FirstName = "Fabio"
	user.LastName = "Di Francesco"
	user.Email = "fabio.difrancesco@gmail.com"
	user.Address = &models.Address{
		Street:  "Viale Gran San Bernardo 17",
		ZipCode: "11100",
		City:    "Aosta",
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
		beego.Error("Superadmin user creation failed: ", err)
		return false
	}

	rm := GetRoleManager()

	superadmin := rm.GetRole(SUPERADMIN)
	if superadmin == nil {
		beego.Error("Superadmin role not found: ", err)
		return false
	}

	if !rm.AddPermissionForRole(superadmin, "*") {
		beego.Error("Administrator role permission addiction failed: ", err)
		return false
	}

	if !rm.AddRoleForUser(user, superadmin) {
		beego.Error("Administrator role addiction failed: ", err)
		return false
	}

	return true
}

func createCompanyAdmin() bool {
	db := GetDbManager()

	User := db.User()
	user := &models.User{}
	err, _ := User.New(user)
	if err != nil {
		beego.Error("Company administrator creation failed: ", err)
		return false
	}

	user.FirstName = "Pippo"
	user.LastName = "Palmieri"
	user.Email = "donzauker78@gmail.com"
	user.Address = &models.Address{
		Street:  "Viale Gran San Bernardo 17",
		ZipCode: "11100",
		City:    "Aosta",
	}
	passwordHash, passwordSalt, err := HashAndSalt("password")
	if err != nil {
		beego.Error("Company administrator password creation failed: ", err)
		return false
	}

	user.PasswordHash = passwordHash
	user.PasswordSalt = passwordSalt
	err = user.Save()
	if err != nil {
		beego.Error("Company administrator user creation failed: ", err)
		return false
	}

	Company := db.Company()
	company := &models.Company{}
	err, _ = Company.New(company)
	if err != nil {
		beego.Error("Company creation failed: ", err)
		return false
	}

	company.Name = "ACME"
	company.Address = &models.Address{
		Street:  "Via Chambery 125",
		ZipCode: "11100",
		City:    "Aosta",
	}

	err = company.Save()
	if err != nil {
		beego.Error("Company creation failed: ", err)
		return false
	}

	rm := GetRoleManager()

	admin := rm.GetRole(ADMIN)
	if admin == nil {
		beego.Error("Company admin role not found: ", err)
		return false
	}

	if !rm.AddPermissionForRole(ADMIN, "*") {
		beego.Error("Company admin role permission addiction failed: ", err)
		return false
	}

	if !rm.AddRoleForUserInCompany(user, admin, company) {
		beego.Error("Company admin role addiction failed: ", err)
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

	if !dbSetup() {
		return false
	}

	rm := GetRoleManager()
	if rm != nil {
		superadmin := rm.GetRole("superadmin")
		if len(rm.GetUserIdsForRole(superadmin)) == 0 {
			if createSuperadmin() {
				beego.Info("Administrator with default info created")
			}
		}

		admin := rm.GetRole("admin")
		if len(rm.GetUserIdsForRole(admin)) == 0 {
			if createCompanyAdmin() {
				beego.Info("Company admin with default info created")
			}
		}
	}

	beego.Info("App bootstrap completed")
	return true
}
