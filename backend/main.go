package main

import (
	"github.com/astaxie/beego"
	_ "github.com/fabiao/beego-material/backend/controllers"
	"github.com/fabiao/beego-material/backend/utils"
)

func main() {
	// Bootstrap routines
	if utils.AppBootstrap() {
		// Start the webserver
		beego.Run()
	}
}
