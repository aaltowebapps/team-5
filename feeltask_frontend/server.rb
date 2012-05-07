require 'sinatra'
require 'json'
require 'haml'
require 'manifesto.rb'
require 'rubygems'
require 'bundler'

# Disabled manifest for quickier development.
#get '/manifest.appcache' do
#  headers 'Content-Type' => 'text/cache-manifest' # Must be served with this MIME type
#  send_file 'manifest.appcache'
#end

get '/' do
  haml :index, :layout => :layout
end

get '/manifest.appcache' do
  headers 'Content-Type' => 'text/cache-manifest' # Must be served with this MIME type
  Manifesto.cache :timestamp => false
end


