path = File.expand_path("../", __FILE__)

require 'rubygems'
require 'sinatra'
require "#{path}/server"
require 'rack/deflater'

run Sinatra::Application