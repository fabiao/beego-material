package controllers

import (
	"net/http"
	"strings"

	"github.com/astaxie/beego"
	response "github.com/zebresel-com/beego-response"
)

const DEFAULT_SKIP int = 10
const DEFAULT_LIMIT int = 0

type paging struct {
	skip        int
	limit       int
	searchField string
	searchValue string
}

type BaseController struct {
	beego.Controller

	response *response.Response
	paging   paging
}

func (self *BaseController) Prepare() {
	self.response = response.New(self.Ctx)

	skip, err := self.GetInt("skip")
	if err != nil || skip < 0 {
		skip = DEFAULT_SKIP
	}

	limit, err := self.GetInt("limit")
	if err != nil || limit < 0 {
		limit = DEFAULT_LIMIT
	}

	self.paging.skip = skip
	self.paging.limit = limit
	self.paging.searchField = self.GetString("searchField")
	self.paging.searchValue = self.GetString("searchValue")
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
