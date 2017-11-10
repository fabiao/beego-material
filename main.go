package main

import (
	"github.com/astaxie/beego"
	_ "github.com/fabiao/beego-material/routers" // Routes auto-initializer
	"github.com/fabiao/beego-material/utils"
)

func main() {
	// Bootstrap routines
	if utils.AppBootstrap() {
		// Start the webserver
		beego.Run()
	}
}
