package utils

import (
	"encoding/json"
	"errors"
	"github.com/astaxie/beego"
	"github.com/zebresel-com/mongodm"
	"gopkg.in/mgo.v2"
	"io/ioutil"
)

const (
	DB_HOST = "127.0.0.1:27017"
	DB_NAME = "beego-material"
)

type DbManageable interface {
	RegisterModel(document mongodm.IDocumentBase, modelName string, collectionName string, uniqueIndices [][]string) (*mongodm.Model, error)
}

type DbManager struct {
	db *mongodm.Connection
}

var dbm DbManageable

func GetDbManager() DbManageable {
	if dbm == nil {
		// Configure the mongodm connection and specify localisation map
		dbConfig := &mongodm.Config{
			DatabaseHosts: []string{DB_HOST},
			DatabaseName:  DB_NAME,
		}

		// Specify, if available, localisation file for automatic validation output
		file, err := ioutil.ReadFile("locals/locals.json")
		if err != nil {
			beego.Error("Localization file load failed: ", err)
		} else {
			// Unmarshal JSON to map
			var localMap map[string]map[string]string
			err = json.Unmarshal(file, &localMap)
			if err != nil {
				beego.Error("Local map unmarshalling failed: ", err)
			}

			dbConfig.Locals = localMap["it-IT"]
		}

		// Connect and check for error
		db, err := mongodm.Connect(dbConfig)
		if err != nil {
			beego.Error("Database connection failed: ", err)
			return nil
		}

		beego.Info("Database connection established")
		dbm = &DbManager{db}
	}

	return dbm
}

func (self *DbManager) RegisterModel(document mongodm.IDocumentBase, modelName string, collectionName string, uniqueIndices [][]string) (*mongodm.Model, error) {
	self.db.Register(document, collectionName)
	model := self.db.Model(modelName)
	if model == nil {
		return model, errors.New(modelName + " model creation failed")
	}

	for _, k := range uniqueIndices {
		err := model.EnsureIndex(
			mgo.Index{
				Key:        k,
				Unique:     true,
				DropDups:   false,
				Background: true,
			})
		if err != nil {
			return model, err
		}
	}

	beego.Info(modelName + " model registered")
	return model, nil
}
