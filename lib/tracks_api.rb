require 'httparty'
require 'json'

class TracksAPI
  include HTTParty
  format :xml
  base_uri 'kulti.fi/tracks'

  def initialize(username, password)
    @auth = {:username => username, :password => password}
  end


  def todos(options={})
    options.merge!({:basic_auth => @auth})
    self.class.get("/todos.xml", options)
  end
end