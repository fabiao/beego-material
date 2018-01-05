package controllers

import (
	"fmt"
	"math"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/astaxie/beego"
	response "github.com/zebresel-com/beego-response"
)

const DEFAULT_SKIP int = 0
const DEFAULT_LIMIT int = 10

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
	if err != nil || limit <= 0 {
		limit = DEFAULT_LIMIT
	}

	self.paging.skip = skip
	self.paging.limit = limit
	self.paging.searchField = self.GetString("searchField")
	self.paging.searchValue = self.GetString("searchValue")
}

func (self *BaseController) CreatePaging(skip int, limit int, records int, currentRecords int) (*response.Paging, error) {
	paging := &response.Paging{}

	var previousSkip, previousLimit, nextSkip, nextLimit int
	var hasPrevious, hasNext bool = true, true

	if skip == 0 {
		hasPrevious = false
	} else if skip > records {
		previousSkip = records - limit
		previousLimit = limit

		if previousSkip < 0 {
			previousSkip = 0
		}
	} else if limit > skip {
		previousSkip = 0
		previousLimit = skip
	} else {
		previousSkip = skip - limit
		previousLimit = limit
	}

	if skip+limit >= records {
		hasNext = false
	} else {
		nextSkip = skip + limit
		nextLimit = limit
	}

	requestURI := self.Ctx.Request.RequestURI

	nextUrl := ""
	previousUrl := ""

	// Check if url has params to keep old ones
	if strings.Contains(requestURI, "?") {

		limitReg := regexp.MustCompile(response.PARAM_LIMIT + "=[0-9]*")
		skipReg := regexp.MustCompile(response.PARAM_SKIP + "=[0-9]*")

		// Limit exists
		if strings.Contains(requestURI, response.PARAM_LIMIT+"=") {

			nextUrl = limitReg.ReplaceAllString(requestURI, response.PARAM_LIMIT+"="+strconv.Itoa(nextLimit))
			previousUrl = limitReg.ReplaceAllString(requestURI, response.PARAM_LIMIT+"="+strconv.Itoa(previousLimit))

			paging.First = limitReg.ReplaceAllString(requestURI, response.PARAM_LIMIT+"="+strconv.Itoa(limit))
			paging.Last = limitReg.ReplaceAllString(requestURI, response.PARAM_LIMIT+"="+strconv.Itoa(limit))

		} else { // Add limit param manually

			nextUrl = fmt.Sprintf("%s&%s=%s", requestURI, response.PARAM_LIMIT, strconv.Itoa(nextLimit))
			previousUrl = fmt.Sprintf("%s&%s=%s", requestURI, response.PARAM_LIMIT, strconv.Itoa(previousLimit))

			paging.First = fmt.Sprintf("%s&%s=%s", requestURI, response.PARAM_LIMIT, strconv.Itoa(limit))
			paging.Last = fmt.Sprintf("%s&%s=%s", requestURI, response.PARAM_LIMIT, strconv.Itoa(limit))
		}

		// Skip exists
		if strings.Contains(requestURI, response.PARAM_SKIP+"=") {

			nextUrl = skipReg.ReplaceAllString(nextUrl, response.PARAM_SKIP+"="+strconv.Itoa(nextSkip))
			previousUrl = skipReg.ReplaceAllString(previousUrl, response.PARAM_SKIP+"="+strconv.Itoa(previousSkip))

			paging.First = skipReg.ReplaceAllString(paging.First, response.PARAM_SKIP+"="+strconv.Itoa(0))
			paging.Last = skipReg.ReplaceAllString(paging.Last, response.PARAM_SKIP+"="+strconv.Itoa(previousSkip))

		} else { // Add skip param manually

			nextUrl = fmt.Sprintf("%s&%s=%s", nextUrl, response.PARAM_SKIP, strconv.Itoa(nextSkip))
			previousUrl = fmt.Sprintf("%s&%s=%s", previousUrl, response.PARAM_SKIP, strconv.Itoa(previousSkip))

			paging.First = fmt.Sprintf("%s&%s=%s", paging.First, response.PARAM_SKIP, strconv.Itoa(0))
			paging.Last = fmt.Sprintf("%s&%s=%s", paging.Last, response.PARAM_SKIP, strconv.Itoa(records-limit))
		}

	} else { // Otherwise build custom url without replacing

		previousUrl = fmt.Sprintf("%s?%s=%s&%s=%s", requestURI, response.PARAM_SKIP, strconv.Itoa(previousSkip), response.PARAM_LIMIT, strconv.Itoa(previousLimit))
		nextUrl = fmt.Sprintf("%s?%s=%s&%s=%s", requestURI, response.PARAM_SKIP, strconv.Itoa(nextSkip), response.PARAM_LIMIT, strconv.Itoa(nextLimit))

		paging.First = fmt.Sprintf("%s?%s=%s&%s=%s", requestURI, response.PARAM_SKIP, strconv.Itoa(0), response.PARAM_LIMIT, strconv.Itoa(limit))
		paging.Last = fmt.Sprintf("%s?%s=%s&%s=%s", requestURI, response.PARAM_SKIP, strconv.Itoa(records-limit), response.PARAM_LIMIT, strconv.Itoa(limit))
	}

	if hasPrevious {
		paging.Previous = previousUrl
	}

	if hasNext {
		paging.Next = nextUrl
	}

	paging.RecordsTotal = records
	paging.RecordsPage = currentRecords

	if limit <= 0 {
		limit = DEFAULT_LIMIT
	}
	paging.Pages = int(math.Ceil(float64(records) / float64(limit)))

	if skip >= records {
		paging.CurrentPage = 0
	} else {
		paging.CurrentPage = paging.Pages - int(math.Ceil(float64(records-skip)/float64(limit))) + 1
	}

	if paging.Pages == paging.CurrentPage {
		paging.Last = requestURI
	}

	return paging, nil
}

func (self *BaseController) ServeContents(contents map[string]interface{}) {
	for n, c := range contents {
		if n == "pagination" {
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
	self.response.AddContent("error", errorMessage)
	self.response.SetStatus(errorCode)
	self.response.ServeJSON()
}

func (self *BaseController) ServeErrors(errorCode int, errorMessages []string) {
	self.response.AddContent("error", strings.Join(errorMessages, "\n"))
	self.response.SetStatus(errorCode)
	self.response.ServeJSON()
}
