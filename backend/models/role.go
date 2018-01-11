package models

type Route struct {
	To         string `json:"to"`
	Label      string `json:"label"`
	Icon       string `json:"icon"`
	IsBackward bool   `json:"isBackward"`
}

type RouteBinding struct {
	Keys   []string `json:"keys"`
	Values []*Route `json:"values"`
}
