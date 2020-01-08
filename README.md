# moleculer-iam

Centralized IAM module for moleculer.
Including a certified OIDC provider and an Identity provider for user profile, credentials, and custom claims management.
Custom claims could be defined/updated by declarative schema which contains claims validation and migration strategy.

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
        - [x] token management
            - [x] login
            - [x] logout / change account
        - [x] account management
            - [x] find email
            - [x] reset password
            - [x] phone verification
            - [x] email verification
            - [x] registration
- [x] 0.2.x Alpha
    - [x] Identity Provider
        - [x] Storage
            - [x] In-Memory adapter (for testing and development)
            - [x] RDBMS adapter (MySQL, PostgreSQL, ...)
        - [x] OIDC scope and claims definition
            - [x] Declarative claims schema
            - [x] Robust migration support for versioned claims
            - [x] Battery included OIDC scopes
                - openid
                - profile (name, picture)
                - email (email, email_verified)
                - phone (phone_number, phone_number_verified)
                - gender
                - birthdate
        - [x] Dynamic scope grant without definition (eg. repo:read, calendar:create, whatever:dynamic:permissions)
        - [x] Federation
            - [x] OAuth
                - [x] Google (OIDC)
                - [x] Facebook
                - [x] KakaoTalk
- [] 0.3.x Beta
    - [] OAuth 2.0 and OpenID Connect Core 1.0 Provider
        - [] (Refactor interaction codes)
        - [] Device flow
    - [] Identity Provider
        - [] 2FA
    - [] Web client application components
        - [] manage profile
        - [] manage session
        - [] manage credentials
        - [] manage devices
        - [] manage connected services
        - [] remove account
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

