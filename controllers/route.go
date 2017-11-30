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
	beego.InsertFilter("/user/*", beego.BeforeRouter, FilterAuthenticated)
	userNS := beego.NewNamespace("/user",
		beego.NSRouter("/all", &UserController{}, "get:GetAll"),
		beego.NSRouter("/allowedPaths", &RouteController{}, "get:GetAllowedPaths"),
		beego.NSRouter("/", &UserController{}, "get:Get;post:Create;put:Update"),
	)
	beego.AddNamespace(userNS)

	beego.InsertFilter("/message/*", beego.BeforeRouter, FilterAuthenticated)
	messageNS := beego.NewNamespace("/message",
		beego.NSRouter("/", &MessageController{}, "get:GetAll;post:Create;put:Update"),
		beego.NSRouter("/:id", &MessageController{}, "get:Get"),
	)
	beego.AddNamespace(messageNS)

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
