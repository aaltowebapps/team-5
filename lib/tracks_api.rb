require 'httparty'
require 'json'

class TracksAPI
  include HTTParty
  format :xml

  # Initialize API with given Tracks username, password and url.
  def initialize(tracks_uri, username, password)
    @base_uri = tracks_uri
    @auth = {:username => username, :password => password}
  end


  # Retrieve todos from Tracks.  
  # @param options [Hash]
  # @return [HTTParty::Response]
  def todos(options={})
    options.merge!({:basic_auth => @auth})
    response=self.class.get("#{@base_uri}/todos.xml", options)
    if response.success?
      return response
    else
      return nil
    end
  end

  # Retrieve given todo with id from Tracks.
  # @param options [Hash]
  # @return [HTTParty::Response]
  def todo(id, options={})
    return nil unless id
    options.merge!({:basic_auth => @auth})
    response=self.class.get("#{@base_uri}/todos/#{id}.xml", options)
    if response.success?
      return response
    else
      return nil
    end
  end

end