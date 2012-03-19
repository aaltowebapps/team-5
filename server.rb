require 'sinatra'
require 'json'

set :public_folder, settings.root

get '/' do
  File.read("index.html")
end
