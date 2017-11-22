package models

type Route struct {
	Path string `json:"path" bson:"path"`
	Icon string `json:"icon" bson:"icon"`
}

type Role struct {
	Name   string  `json:"name" bson:"name"`
	Routes []Route `json:"routes" bson:"routes"`
}
