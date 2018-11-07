package controllers

import (
	"net/http"
	"net/url"
	"strings"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"
	"github.com/fabiao/beego-material/backend/models"
	"github.com/fabiao/beego-material/backend/utils"
)

func init() {
	var FilterAuthenticated = func(ctx *context.Context) {
		authHeader := ctx.Request.Header.Get("Authorization")
		token := strings.TrimSpace(strings.Replace(authHeader, "Bearer", "", -1))
		et := utils.EasyToken{}
		isValid, userId, err := et.ValidateToken(token)
		if err != nil {
			utils.New(ctx).CustomError(http.StatusUnauthorized, 0, err.Error())
			return
		}
		if !isValid {
			utils.New(ctx).CustomError(http.StatusUnauthorized, 0, "Invalid authorization token found")
			return
		}

		ctx.Input.SetData("currentUserId", userId)
	}

	// Auth namespaces
	beego.InsertFilter("/users/*", beego.BeforeRouter, FilterAuthenticated)
	ns := beego.NewNamespace("/users",
		beego.NSRouter("/", &UserController{}, "get:GetAny;post:Create;put:Update"),
		beego.NSRouter("/:userId", &UserController{}, "get:Get"),
		beego.NSRouter("/current", &UserController{}, "get:GetCurrent;put:UpdateCurrent"),
		beego.NSRouter("/allowedPaths", &RouteController{}, "get:GetAllowedPaths"),
		beego.NSRouter("/nav-items", &RouteController{}, "get:GetNavItems"),
	)
	beego.AddNamespace(ns)

	beego.InsertFilter("/orgs/*", beego.BeforeRouter, FilterAuthenticated)
	ns = beego.NewNamespace("/orgs",
		beego.NSRouter("/", &OrganizationController{}, "get:GetAny;post:Create;put:Update"),
		beego.NSRouter("/:orgId", &OrganizationController{}, "get:Get"),
	)
	beego.AddNamespace(ns)

	/*beego.InsertFilter("/message/*", beego.BeforeRouter, FilterAuthenticated)
	ns = beego.NewNamespace("/message",
		beego.NSRouter("/", &MessageController{}, "get:GetAny;post:Create;put:UpdateUser"),
		beego.NSRouter("/:id", &MessageController{}, "get:Get"),
	)
	beego.AddNamespace(ns)*/

	// Public routes
	beego.Router("/signin", &AccountController{}, "post:Signin")
	beego.Router("/signup", &AccountController{}, "post:Signup")
	beego.Router("/routes", &AccountController{}, "get:GetRouteBindings")

	beego.DelStaticPath("/static")
	beego.SetStaticPath("/", "frontend")
}

type RouteController struct {
	AuthenticatedController
}

func (self *RouteController) GetAllowedPaths() {
	rm := utils.GetRoleManager()
	roles := rm.GetUserRoles(self.currentUserId)
	allowedPaths := []string{}
	for _, r := range roles {
		roleAllowedPaths := rm.GetRoleAllowedPaths(r)
		allowedPaths = append(allowedPaths, roleAllowedPaths...)
	}

	self.ServeContent("allowedPaths", allowedPaths)
}

func (self *RouteController) GetNavItems() {
	route := self.GetString("route")
	route, err := url.PathUnescape(route)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	pathname := self.GetString("pathname")
	pathname, err = url.PathUnescape(pathname)
	if err != nil {
		self.ServeError(http.StatusBadRequest, err.Error())
		return
	}

	rm := utils.GetRoleManager()
	roles := rm.GetUserRoles(self.currentUserId)
	allowedPaths := []string{}
	for _, r := range roles {
		roleAllowedPaths := rm.GetRoleAllowedPaths(r)
		allowedPaths = append(allowedPaths, roleAllowedPaths...)
	}

	rc := utils.GetRouteChecker()
	routeBindings := rc.GetRouteBindings()
	navItems := []*models.Route{{
		"/",
		"Home",
		"home",
		false,
	}}
	for _, rb := range routeBindings {
		found := false
		for _, k := range rb.Keys {
			if k == route {
				navItems = rb.Values
				found = true
				break
			}
		}
		if found {
			break
		}
	}

	// Route expression is replaces by real path value (redux-little-router rules!)
	if pathname != route {
		for _, ni := range navItems {
			ni.To = strings.Replace(ni.To, route, pathname, 1)
		}
	}

	self.ServeContent("navItems", navItems)
}
