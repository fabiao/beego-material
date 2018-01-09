## Beego-material

The project goal is to implement a modern admin web application base with a dynamic menu navigation, user session management, rbac role system.

#Backend part is implemented in go with dependencies:
- beego
- jwt
- mongodm/mgo-v2
- casbin/casbin mongodb adapter
- x/crypto/scrypt

#Frontend part is implemented with react:
- react
- redux
- redux-little-router
- react-md
- axios

Some components has been selected beacause they update redux store instead of react state. For example redux-little-router is a pure redux based router and his state is updated via dispatch and full state can be retrieved from redux store.