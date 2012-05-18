require 'httparty'
require 'json'
require 'builder'

# This class is used to use REST API interface provided by Tracks application.
class TracksApi
  include HTTParty
  format :xml

  DEFAULT_TRACKS_URI = "http://kulti.fi/tracks"
  DEFAULT_USERNAME="feeltask"
  DEFULT_PASSWORD="feeltask"

  # Initialize API with given Tracks username, password and url.
  def initialize(tracks_uri, username, password)
    @base_uri = tracks_uri
    @auth = {:username => username, :password => password}
  end


  # Create todo in Tracks
  def create_todo(todo)
    post_vals={:todo => {:project_id => nil, :context_id => todo.context_id, :description => todo.description}}
    options={:basic_auth => @auth, :body => post_vals}
    Rails.logger.debug "Options for POST: #{options}"
    response=self.class.post("#{@base_uri}/todos.xml", options)
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

  def new_todo()
    Todo.new
  end

  def filter_todos_by_date(todos, date)
    filtered_todos=[]
    date=Time.zone.parse(date) if date.is_a? String
    todos.parsed_response["todos"].each do |todo|
      if date
        if todo
          todo_due = todo["due"] ? todo["due"].utc.in_time_zone("Helsinki").to_date : nil
          if todo_due == date || todo_due
            filtered_todos<<todo
          end
        end
      else
        filtered_todos<<todo
      end
    end
    filtered_todos
  end

end