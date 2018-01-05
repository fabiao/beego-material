package utils

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/fabiao/beego-material/backend/models"
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

		_, err = dbm.RegisterModel(&models.Organization{}, models.OrganizationModelName, models.OrganizationCollectionName, []mgo.Index{
			{
				Key:        []string{"name"},
				Unique:     true,
				DropDups:   false,
				Background: true,
			},
		})
		if err != nil {
			beego.Error(models.OrganizationModelName+" model registration failed: ", err)
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

	if !rm.E().AddPermissionForUser(SUPERADMIN, "*", "/*", "*") {
		beego.Error("Administrator role permission addiction failed: ", err)
		return false
	}

	if !rm.E().AddRoleForUserInDomain(user.Id.Hex(), SUPERADMIN, "*") {
		beego.Error("Administrator role addiction failed: ", err)
		return false
	}

	return true
}

func createOrganizationAdmin() bool {
	db := GetDbManager()

	User := db.User()
	user := &models.User{}
	err, _ := User.New(user)
	if err != nil {
		beego.Error("Organization administrator creation failed: ", err)
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
		beego.Error("Organization administrator password creation failed: ", err)
		return false
	}

	user.PasswordHash = passwordHash
	user.PasswordSalt = passwordSalt
	err = user.Save()
	if err != nil {
		beego.Error("Organization administrator user creation failed: ", err)
		return false
	}

	Organization := db.Organization()
	org := &models.Organization{}
	err, _ = Organization.New(org)
	if err != nil {
		beego.Error("Organization creation failed: ", err)
		return false
	}

	org.Name = "ACME"
	org.Address = &models.Address{
		Street:  "Via Chambery 125",
		ZipCode: "11100",
		City:    "Aosta",
	}

	err = org.Save()
	if err != nil {
		beego.Error("Organization creation failed: ", err)
		return false
	}

	rm := GetRoleManager()

	/*p,org_admin,orgId,/orgs/:orgId*,*
	p,org_editor,orgId,/orgs/:orgId/activities*,*
	p,org_viewer,orgId,/orgs/:orgId/reports*,read*/

	if !rm.E().AddPermissionForUser(ORG_ADMIN, org.Id.Hex(), "/orgs/:orgId*", "*") {
		beego.Error("Organization admin role permission addiction failed: ", err)
		return false
	}

	if !rm.E().AddRoleForUserInDomain(user.Id.Hex(), ORG_ADMIN, org.Id.Hex()) {
		beego.Error("Organization admin role addiction failed: ", err)
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
		if len(rm.E().GetUsersForRole(SUPERADMIN)) == 0 {
			if createSuperadmin() {
				beego.Info("Administrator with default info created")
			}
		}

		if len(rm.E().GetUsersForRole(ORG_ADMIN)) == 0 {
			if createOrganizationAdmin() {
				beego.Info("Organization admin with default info created")
			}
		}
	}

	beego.Info("App bootstrap completed")
	return true
}
