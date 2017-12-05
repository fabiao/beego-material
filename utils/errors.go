package utils

import "github.com/astaxie/beego/validation"

func ToErrorStrings(errors []error) []string {
	res := make([]string, len(errors))
	for i, v := range errors {
		res[i] = v.Error()
	}
	return res
}

func ToValidationErrorStrings(errors []*validation.Error) []string {
	res := make([]string, len(errors))
	for i, v := range errors {
		res[i] = (*v).Error()
	}
	return res
}
