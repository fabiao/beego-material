package models

type Paging struct {
	Skip        int    `json:"skip"`
	Limit       int    `json:"limit"`
	Rows        int    `json:"rows"`
	SearchField string `json:"searchField"`
	SearchValue string `json:"searchValue"`
}
