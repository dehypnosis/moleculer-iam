# moleculer-iam

Centeralized IAM module for moleculer. Including default OIDC provider for user profile and custom claims (for ABAC, also simple role system for RBAC available) management, custom claims are supported by scheme validation and versioned migration. Either can be composed with remote OIDC providers like G-Suite. Basic authentication and authorization features for OIDC/OAuth2 are supported. Can operate mutiple realms, including admin, user, service-account realms are set by default.

[![Build Status](https://travis-ci.org/qmit-pro/moleculer-iam.svg?branch=master)](https://travis-ci.org/qmit-pro/moleculer-iam)
[![Coverage Status](https://coveralls.io/repos/github/qmit-pro/moleculer-iam/badge.svg?branch=master)](https://coveralls.io/github/qmit-pro/moleculer-iam?branch=master)
[![David](https://img.shields.io/david/qmit-pro/moleculer-iam.svg)](https://david-dm.org/qmit-pro/moleculer-iam)
[![Known Vulnerabilities](https://snyk.io/test/github/qmit-pro/moleculer-iam/badge.svg)](https://snyk.io/test/github/qmit-pro/moleculer-iam)
[![NPM version](https://img.shields.io/npm/v/moleculer-iam.svg)](https://www.npmjs.com/package/moleculer-iam)
[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)


# Release Road-map
- [x] 0.1.x Pre-alpha
    - [x] OAuth 2.0 and OpenID Connect Core 1.0 Provider
        - [x] hack `oidc-provider` module to be programmable
    - [x] Web client application (React.js / responsive)
        - token management
            - login
            - logout / change account
        - account management
            - registration
            - profile
            - password
            - removal
        - extendable component
- [] 0.2.x Alpha
    - [] Identity Provider
        - [] Storage
            - [] In-Memory adapter (for testing)
            - [] Redis adapter
            - [] MySQL adapter
        - [] Basic scope: openid, profile, email, address, phone, offline_access
        - [] Custom scope extension
            - [] Declarative claims schema and migration support
            - [] Declarative group management
            - [] Declarative role management
        - [] Federation
            - [] OAuth
                - Google
                - Facebook
                - KakaoTalk
    - [] Web client application components
        - client management
        - session management
- [] 0.3.x Beta
    - [] OAuth 2.0 and OpenID Connect Core 1.0 Provider
       - [] Device flow
    - [] Identity Provider
        - [] Federation
            - [] Custom federation for legacy services which not support OAuth
        - [] 2FA
        - [] Account verification
            - email
            - phone
    - [] Web client application components
        - account management
            - email verification
            - phone number verification
        - device management
- [] 1.0.x First Stable Release
    - [] Rate limiter
    - [] IP filter
    - [] Documentation
    - [] `moleculer-api` integration example

# Usage
## 1. Documents
- [Features and details: ./docs](./docs)

## 2. Examples
- [MoleculerJs: ./src/examples](./examples)

## 3. Quick Start
```
npm install moleculer-iam --save
```
...

# Development
## 1. NPM Scripts
- `npm run dev [example=moleculer]` - Start development (nodemon with ts-node)
- `npm run dev-app` - Start Client Application development (webpack)
- `npm run build`- Transpile ts and tsx to js for both server and client 
- `npm run lint` - Run TSLint for both server and client
- `npm run deps`- Update dependencies
- `npm test` - Run tests & generate coverage report
- `npm test -- --watch` - Watch and run tests
- `npm test-app` - Run tests for client
- `npm test-app -- --watch` - Watch and run tests for client


# Contribution
Please send pull requests improving the usage and fixing bugs, improving documentation and providing better examples, or providing some testing, because these things are important.


# License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).


# Contact
Copyright (c) 2019 QMIT Inc.

