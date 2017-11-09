package main

import (
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/casbin/casbin"
	"github.com/casbin/mongodb-adapter"
	"github.com/fabiao/beego-material/controllers"
	"github.com/fabiao/beego-material/models"
	_ "github.com/fabiao/beego-material/routers"
	"github.com/zebresel-com/mongodm"
	"io/ioutil"
	"os"
)

const (
	DB_NAME = "beego-material"
)

func main() {
	if beego.BConfig.RunMode == "dev" {
		beego.BConfig.WebConfig.DirectoryIndex = true
	}

	// Specify localisation file for automatic validation output
	file, err := ioutil.ReadFile("locals/locals.json")

	if err != nil {
		fmt.Printf("File error: %v\n", err)
		os.Exit(1)
	}

	// Unmarshal JSON to map
	var localMap map[string]map[string]string
	json.Unmarshal(file, &localMap)

	// Configure the mongodm connection and specify localisation map
	dbConfig := &mongodm.Config{
		DatabaseHosts: []string{"127.0.0.1"},
		DatabaseName:  DB_NAME,
		Locals:        localMap["it-IT"],
	}

	// Connect and check for error
	db, err := mongodm.Connect(dbConfig)

	if err != nil {

		fmt.Println("Database connection error: %v", err)

	} else {

		controllers.Database = db
	}

	// See https://godoc.org/github.com/zebresel-com/mongodm#Connection.Register
	db.Register(&models.User{}, "users")
	db.Register(&models.Message{}, "messages")

	a := mongodbadapter.NewAdapter("127.0.0.1:27017/" + DB_NAME)
	e := casbin.NewEnforcer("conf/rbac_policy.conf", a)

	// Load the policy from DB.
	e.LoadPolicy()

	// Check the permission.
	e.Enforce("alice", "data1", "read")

	// Modify the policy.
	// e.AddPolicy(...)
	// e.RemovePolicy(...)

	// Save the policy back to DB.
	e.SavePolicy()

	// Start the webserver
	beego.Run()
}
