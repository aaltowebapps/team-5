# FeelTask

This is FeelTask by team 5.

## Frontend

Frontend implementation uses jquery and jquery-mobile.

## Backend

Backend application is built with Ruby on Rails (v3.2.2)
Backend gives REST api to use with tasks.


## Usage

This application can be installed on any server, including Heroku, Cloundfoundry etc.

This is used as mobile service and connects the mobile interface to certain Tracks installation. Connection is done by JSONP REST api. BAckend then connects to Tracks XML REST API and returns information back.

### Requirements

* MySQL as database
* Ruby 1.9.2
* Rails 3.2.2
* Tracks installation somewhere.


## Installation

### Install to CloudFoundry

Cloudfoundry has free cloud service for deploying apps.

1. Goto link below and register.
1. vmc gem is used for communicating to cloudfoundry. this should be installed with bundle install.

#### Links

* http://start.cloudfoundry.com/getting-started.html
* http://start.cloudfoundry.com/frameworks/ruby/rails-3-1.html


