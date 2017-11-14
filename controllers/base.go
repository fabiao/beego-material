package controllers

import (
	"github.com/astaxie/beego"
	"github.com/fabiao/beego-material/utils"
	response "github.com/zebresel-com/beego-response"
)

const DEFAULT_TAKE int = 10
const DEFAULT_SKIP int = 0

type paging struct {
	skip int
	take int
}

type BaseController struct {
	beego.Controller

	db       utils.DbManageable
	response *response.Response
	paging   paging
}

func (self *BaseController) Prepare() {
	self.db = utils.GetDbManager()
	self.response = response.New(self.Ctx)

	take, takeErr := self.GetInt("take")
	if takeErr != nil || take < 0 {
		take = DEFAULT_TAKE
	}

	skip, skipErr := self.GetInt("skip")
	if skipErr != nil || skip < 0 {
		skip = DEFAULT_SKIP
	}

	self.paging.take = take
	self.paging.skip = skip
}
