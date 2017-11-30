package main

import (
	"github.com/astaxie/beego"
	_ "github.com/fabiao/beego-material/controllers"
	"github.com/fabiao/beego-material/utils"
)

func main() {
	// Bootstrap routines
	if utils.AppBootstrap() {
		// Start the webserver
		beego.Run()
	}
}
