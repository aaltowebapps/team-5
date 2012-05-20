# FeelTask frontend

Working @ http://feeltask_front.cloudfoundry.com/

## Installation

If you aren't using rvm, then you need to have ruby environment, preferably ruby-1.9.2.

1. git clone this
1. bundle install

You are ready!

## Run

Write in terminal/command line:
shotgun

More information about shotgun, see <http://ruby.about.com/od/sinatra/a/sinatra5.htm>

## Test in cloud

This is installed in <http://feeltask_front.cloudfoundry.com/>

You can also install it yourselves, if you have for example Cloudfoundry.com environment ready.

Update, use vmc update <appname>
to push first time, use vmc push <appname>

## Documentation

Feeltask front is feel and touch based todo management app for mobile devices. It uses unique Feeltask backend that provides todo information from variety sources.

### Target usage

Mobile, first hand specialized for iOS devices.

### Libraries used

* Underscore
* BackboneJS
* jQuery Mobile
* jQuery
* Handlebars
* Animate
* DateJS
* Noisy

### Sensors used

1. Device Motion API - For shake - accelerometer sensors
1. jQuery Mobile swipe left and right - touch sensors
1. Geolocation

