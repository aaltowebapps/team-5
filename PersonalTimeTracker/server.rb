require 'sinatra'

get '/' do
  File.read "index.html"
end

get '/timetracker.appcache' do
  File.read "timetracker.appcache"
end

