package controllers

import (
	"github.com/astaxie/beego"
	response "github.com/zebresel-com/beego-response"
	"net/http"
	"strings"
)

const DEFAULT_TAKE int = 10
const DEFAULT_SKIP int = 0

type paging struct {
	skip int
	take int
}

type BaseController struct {
	beego.Controller

	response *response.Response
	paging   paging
}

func (self *BaseController) Prepare() {
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

func (self *BaseController) ServeContents(contents map[string]interface{}) {
	for n, c := range contents {
		self.response.AddContent(n, c)
	}
	self.response.SetStatus(http.StatusOK)
	self.response.ServeJSON()
}

func (self *BaseController) ServeContent(contentName string, content interface{}) {
	self.ServeContents(map[string]interface{}{contentName: content})
}

func (self *BaseController) ServeError(errorCode int, errorMessage string) {
	self.response.AddContent("error", errorMessage)
	self.response.SetStatus(errorCode)
	self.response.ServeJSON()
}

func (self *BaseController) ServeErrors(errorCode int, errorMessages []string) {
	self.response.AddContent("error", strings.Join(errorMessages, "\n"))
	self.response.SetStatus(errorCode)
	self.response.ServeJSON()
}
