package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"
	"github.com/fabiao/beego-material/controllers"
	response "github.com/zebresel-com/beego-response"
	"net/http"
)

func init() {
	var FilterAuthenticated = func(ctx *context.Context) {

		/**
		 * It is necessary to allow the /login route if you have one.
		 * Until now I did not found a better solution than:
		 *
		 * if strings.Contains(ctx.Request.URL.Path, "/api/login") {
		 *     return
		 *  }
		 *
		 * Fit the comparison to your needs!
		 */

		isAuthorized := true
		response := response.New(ctx)

		if isAuthorized {
			/**
			 * Maybe add a user object here on valid login/authorization for other controllers
			 * e.g. ctx.Input.SetData("user", user)
			 *
			 * In baseController::Prepare you could access the user with:
			 *
			 * if user, ok := self.Ctx.Input.GetData("user").(*models.User); ok {
			 *     self.user = user
			 * }
			 */
		} else {
			/**
			 * This would result in:
			 *
			 * {
			 *  "error": {
			 *      "code": 401,
			 *      "message": "Unauthorized"
			 *      }
			 *  }
			 */
			response.Error(http.StatusUnauthorized)
		}
	}

	// Auth namespaces
	beego.InsertFilter("/user/*", beego.BeforeRouter, FilterAuthenticated)
	userNS := beego.NewNamespace("/user",
		beego.NSRouter("/token", &controllers.UserController{}, "get:GetToken"),
		beego.NSRouter("/all", &controllers.UserController{}, "get:GetAll"),
		beego.NSRouter("/", &controllers.UserController{}, "get:Get;post:Create;put:Update"),
	)
	beego.AddNamespace(userNS)

	beego.InsertFilter("/message/*", beego.BeforeRouter, FilterAuthenticated)
	messageNS := beego.NewNamespace("/message",
		beego.NSRouter("/", &controllers.MessageController{}, "get:GetAll;post:Create;put:Update"),
		beego.NSRouter("/:id", &controllers.MessageController{}, "get:Get"),
	)
	beego.AddNamespace(messageNS)

	// Public routes
	beego.Router("/signin", &controllers.AccountController{}, "post:Signin")
	beego.Router("/signup", &controllers.AccountController{}, "post:Signup")

	beego.DelStaticPath("/static")
	beego.SetStaticPath("/", "frontend")
}
