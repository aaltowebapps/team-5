require 'sinatra'
require 'json'
require 'haml'

# Disabled manifest for quickier development.
#get '/manifest.appcache' do
#  headers 'Content-Type' => 'text/cache-manifest' # Must be served with this MIME type
#  send_file 'manifest.appcache'
#end

get '/' do
  haml :index, :layout => :layout
end



