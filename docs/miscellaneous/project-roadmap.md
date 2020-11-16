# Project Roadmap

* [x] 0.1.x Pre-alpha
  * [x] OIDC Provider
    * [x] hack `oidc-provider` module to be programmable
* [x] 0.2.x Alpha
  * [x] Identity Provider
    * [x] Storage
    * [x] In-Memory adapter \(for testing and development\)
    * [x] RDBMS adapter \(MySQL, PostgreSQL, ...\)
    * [x] OIDC scope and claims definition
    * [x] Declarative claims schema
    * [x] Robust migration support for versioned claims
    * [x] Battery included OIDC scopes
      * openid
      * profile \(name, picture\)
      * email \(email, email\_verified\)
      * phone \(phone\_number, phone\_number\_verified\)
      * gender
      * birthdate
    * [x] Dynamic scope grant without definition \(eg. repo:read, calendar:create, whatever:dynamic:permissions\)
  * [x] Federation
    * [x] OAuth
    * [x] Google \(OIDC\)
    * [x] Facebook
    * [x] KakaoTalk
  * [x] Application Renderer \(React.js\)
    * [x] token management
    * [x] login
    * [x] logout / change account
    * [x] consent
    * [x] account management
    * [x] find email
    * [x] reset password
    * [x] phone verification
    * [x] email verification
    * [x] registration
* \[\] 0.3.x Beta
  * \[\] Application renderer simple test cases
  * \[\] OIDC Provider
    * \[\] test and support Device code flow, also QR code
  * \[\] Identity Provider
    * \[\] 2FA
  * \[\] Account manager application
    * \[\] manage profile/session/credentials/devices/grants
* \[\] 1.0.x First Stable Release
  * \[\] Rate limiter
  * \[\] IP filter
  * \[\] Documentation
  * [x] `moleculer-api` integration example

