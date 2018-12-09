package middleware

import (
	"doc-manager/common"
	"doc-manager/core/jwt"
	"doc-manager/model"
	"github.com/gin-gonic/gin"
	"net/http"
)


func JWTAuthMiddleware() gin.HandlerFunc  {
	return func(c *gin.Context) {
		aRes := model.NewResponse()
		token := c.Request.Header.Get(common.KeyUserToken)
		if token == "" {
			aRes.SetErrorInfo(http.StatusUnauthorized, "请求未携带token，无权限访问")
			c.JSON(http.StatusUnauthorized,aRes)
			c.Abort()
			return
		}
		claims ,err := jwt.ParseToken(token)
		if err != nil {
			if err == jwt.TokenExpired {
				aRes.SetErrorInfo(http.StatusUnauthorized, "授权已过期")
				c.JSON(http.StatusUnauthorized, aRes)
				c.Abort()
				return
			}
			aRes.SetErrorInfo(http.StatusUnauthorized, err.Error())
			c.JSON(http.StatusUnauthorized, aRes)
			c.Abort()
			return
		}
		c.Set(common.KeyJWTClaims,claims)
	}
}
