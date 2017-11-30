package utils

import (
	"encoding/json"
	"github.com/astaxie/beego"
	"github.com/fabiao/beego-material/models"
	"io/ioutil"
)

const (
	NAV_ROUTES_FILE = "conf/nav_routes.json"
)

type RouteCheckable interface {
	GetRouteBindings() []models.RouteBinding
}

type RouteChecker struct {
	routeBindings []models.RouteBinding
}

var rc RouteCheckable

func GetRouteChecker() RouteCheckable {
	if rc == nil {
		// Load routes
		routeBindings := []models.RouteBinding{}
		file, err := ioutil.ReadFile(NAV_ROUTES_FILE)
		if err != nil {
			beego.Critical("Routes file load failed: ", err)
			panic("Routes file load failed: " + err.Error())
		} else {
			err = json.Unmarshal(file, &routeBindings)
			if err != nil {
				beego.Critical("Routes unmarshalling failed: ", err)
				panic("Routes unmarshalling failed: " + err.Error())
			}
		}

		instance := &RouteChecker{routeBindings: routeBindings}
		rc = instance
	}

	return rc
}

func (self *RouteChecker) GetRouteBindings() []models.RouteBinding {
	return self.routeBindings
}
