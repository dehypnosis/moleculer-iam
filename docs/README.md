# Overview

## available oidc endpoints:
discovery                     : http://localhost:9090/.well-known/openid-configuration
authorization                 : http://localhost:9090/oidc/auth
check_session                 : http://localhost:9090/oidc/session/check
code_verification             : http://localhost:9090/oidc/device
device_authorization          : http://localhost:9090/oidc/device/auth
end_session                   : http://localhost:9090/oidc/session/end
introspection                 : http://localhost:9090/oidc/token/introspect
jwks                          : http://localhost:9090/oidc/jwks
pushed_authorization_request  : http://localhost:9090/oidc/request
registration                  : http://localhost:9090/oidc/client/register
revocation                    : http://localhost:9090/oidc/token/revoke
token                         : http://localhost:9090/oidc/token
userinfo                      : http://localhost:9090/oidc/userinfo

## interaction (sign in/out, register, reset password, verify email/phone number, ... other custom implementations)
interaction                   : http://localhost:9090/interaction


## idp actions (moleculer)
...
