# moleculer-iam

Centralized IAM module for moleculer.
Including a certified OIDC provider and an Identity provider for user profile, credentials, and custom claims management feature.
Custom claims could be defined/updated by declarative schema which contains claims validation and migration strategy.
Also including default interaction React.js application for login/logout/registration and other OP interactions, and the account management React.js application.  

[![Build Status](https://travis-ci.org/qmit-pro/moleculer-iam.svg?branch=master)](https://travis-ci.org/qmit-pro/moleculer-iam)
[![Coverage Status](https://coveralls.io/repos/github/qmit-pro/moleculer-iam/badge.svg?branch=master)](https://coveralls.io/github/qmit-pro/moleculer-iam?branch=master)
[![David](https://img.shields.io/david/qmit-pro/moleculer-iam.svg)](https://david-dm.org/qmit-pro/moleculer-iam)
[![Known Vulnerabilities](https://snyk.io/test/github/qmit-pro/moleculer-iam/badge.svg)](https://snyk.io/test/github/qmit-pro/moleculer-iam)
[![NPM version](https://img.shields.io/npm/v/moleculer-iam.svg)](https://www.npmjs.com/package/moleculer-iam)
[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

![Project Architecture Diagram](./docs/diagram.svg)


# Features
- Identity Provider
    - based on RDBMS
    - declarative claims schema definition for validation
    - dynamic update for claims schema and scope
    - versioned claims with robust claims schema migration support
    - each identities are cached as JSON value for performance
    - support complex query for fetching identity
    - basic OpenID claims battery included
    - ready for distributed system
- OpenID Connect Provider
    - based on `panva/node-oidc-provider`
    - OpenID certified library
    - ready for basic interactions for below react app
    - federation presets for google and facebook, kakaotalk based on passport, also extendable
    - support i18n; for now ko-KR, en-US
- Moleculer integrated actions and events
    - manage IDP claims schema and identity
    - manage OP client and other models 
- React App for OP interaction rendering
    - based on `react-native-ui-kitten` and `react-navigation`
    - session based
    - support i18n; for now ko-KR, en-US 
    - support login/logout/register/findEmail/resetPassword/verifyEmail/verifyPhone/consent
    - support theming and various customization option without rebuild from server configuration
    - this whole app can be replaced to custom one from server configuration

# Usage
## 1. Documents
- [Features and details: ./docs](./docs)

## 2. Examples
- [MoleculerJs: ./src/examples](./examples)

## 3. Quick Start
```
yarn add moleculer-iam
```
...


# Development
## build
- `yarn build-all`

## 1. moleculer-iam
### OIDC Provider + IDP + Moleculer service
- `yarn workspace moleculer-iam dev [example=simple]` - Start development with [./examples](./examples) (nodemon with ts-node)
- `yarn workspace moleculer-iam lint` - Run TSLint
- `yarn workspace moleculer-iam build`- Transpile ts to js 
- `yarn workspace moleculer-iam deps`- Update dependencies
- `yarn workspace moleculer-iam test` - Run tests & generate coverage report
- `yarn workspace moleculer-iam test --watch` - Watch and run tests

## 2. moleculer-iam-app-renderer
### React Application for OIDC interactions with browser
- `yarn workspace moleculer-iam-app-renderer dev` - Start Server Application development (webpack)
- `yarn workspace moleculer-iam-app-renderer build`- Transpile client-side ts/tsx to js 
- `yarn workspace moleculer-iam-app-renderer build-server`- Transpile server-side ts to js
- `yarn workspace moleculer-iam-app-renderer test` - Run tests


# Release Road-map
- [x] 0.1.x Pre-alpha
    - [x] OAuth 2.0 and OpenID Connect Core 1.0 Provider
        - [x] hack `oidc-provider` module to be programmable
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
    - [x] Application Renderer (React.js)
        - [x] token management
            - [x] login
            - [x] logout / change account
            - [x] consent
        - [x] account management
            - [x] find email
            - [x] reset password
            - [x] phone verification
            - [x] email verification
            - [x] registration
- [] 0.3.x Beta
    - [] OAuth 2.0 and OpenID Connect Core 1.0 Provider
        - [x] Refactor `panva/oidc-provider` related codes
        - [] test and support Device code flow, also QR code
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


# Contribution
Please send pull requests improving the usage and fixing bugs, improving documentation and providing better examples, or providing some testing, because these things are important.


# License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).


# Contact
Copyright (c) 2019 QMIT Inc.

