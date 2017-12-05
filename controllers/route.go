package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"
	"github.com/fabiao/beego-material/utils"
	response "github.com/zebresel-com/beego-response"
	"net/http"
	"strings"
)

func init() {
	var FilterAuthenticated = func(ctx *context.Context) {
		authHeader := ctx.Request.Header.Get("Authorization")
		token := strings.TrimSpace(strings.Replace(authHeader, "Bearer", "", -1))
		et := utils.EasyToken{}
		isValid, userId, err := et.ValidateToken(token)
		if err != nil {
			response.New(ctx).CustomError(http.StatusUnauthorized, 0, err.Error())
			return
		}
		if !isValid {
			response.New(ctx).CustomError(http.StatusUnauthorized, 0, "Invalid authorization token found")
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
