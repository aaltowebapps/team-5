# FeelTask backend

This is FeelTask backend application. It provides REST API for todos and other things related to todos. It can be used as combining source of different todo systems.

Backend application is built with Ruby on Rails (v3.2.2).

## Usage

This application can be installed on any server, including Heroku, Cloundfoundry etc.

This is used as mobile service and connects the mobile interface to certain Tracks installation. Connection is done by JSON REST api. Backend then connects to Tracks XML REST API and returns information back.

### Requirements

* MySQL as database
* Ruby 1.9.2
* Rails 3.2.2
* Tracks installation somewhere. Currently on private server at kulti.fi/tracks.

## Installation

* You need Ruby 1.9.2. If you have rvm installed, there is ready rvmrc which makes easier to set up correct ruby.
* You need mySQL database installed
* You need to setup config/database.yml correct to run locally.

Then you can continue:

1. bundle install

And you are ready!

To run locally, write:

rails s

### Install to CloudFoundry

Cloudfoundry has free cloud service for deploying apps.

1. Goto link below and register.
1. vmc gem is used for communicating to cloudfoundry. this should be installed with bundle install.

When updating to cloudfoundry, use

bundle exec rake assets:precompile; vmc update feeltask

#### Links

* http://start.cloudfoundry.com/getting-started.html
* http://start.cloudfoundry.com/frameworks/ruby/rails-3-1.html

