package models

type Address struct {
	Street  string `json:"street" bson:"street" maxLen:"255" valid:"MaxSize(255)"`
	ZipCode string `json:"zipCode" bson:"zipCode" maxLen:"16" valid:"ZipCode;MaxSize(16)"`
	City    string `json:"city" bson:"city" maxLen:"255" valid:"MaxSize(255)"`
}
