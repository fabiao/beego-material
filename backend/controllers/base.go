package controllers

import (
	"net/http"
	"strings"
	response "github.com/fabiao/beego-material/backend/utils"

	"github.com/astaxie/beego"

	"github.com/fabiao/beego-material/backend/models"
)

const DEFAULT_SKIP int = 0
const DEFAULT_LIMIT int = 10

type BaseController struct {
	beego.Controller

	response *response.Response
	paging   models.Paging
}

func (self *BaseController) Prepare() {
	self.response = response.New(self.Ctx)

	skip, err := self.GetInt("skip")
	if err != nil || skip < 0 {
		skip = DEFAULT_SKIP
	}

	limit, err := self.GetInt("limit")
	if err != nil || limit <= 0 {
		limit = DEFAULT_LIMIT
	}

	self.paging.Skip = skip
	self.paging.Limit = limit
}

func (self *BaseController) ServeContents(contents map[string]interface{}) {
	for n, c := range contents {
		if n == "pagination" { // Bypass behaviour of AddContent (skips "pagination" and "error" keys)
			data := *self.response.Data()
			data["pagination"] = c
		} else {
			self.response.AddContent(n, c)
		}
	}
	self.response.SetStatus(http.StatusOK)
	self.response.ServeJSON()
}

func (self *BaseController) ServeContent(contentName string, content interface{}) {
	self.ServeContents(map[string]interface{}{contentName: content})
}

func (self *BaseController) ServeError(errorCode int, errorMessage string) {
	data := *self.response.Data()
	data["error"] = errorMessage
	self.response.SetStatus(errorCode)
	self.response.ServeJSON()
}

func (self *BaseController) ServeErrors(errorCode int, errorMessages []string) {
	self.ServeError(errorCode, strings.Join(errorMessages, "\n"))
}
