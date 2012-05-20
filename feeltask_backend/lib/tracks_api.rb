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

  # Update todo in Tracks
  def update_todo(todo)
    values={:todo => {:id => todo.id, :state => todo.state, :project_id => nil, :context_id => todo.context_id,
                      :description => todo.description, :completed_at => todo.completed_at}}
    options={:basic_auth => @auth, :body => values}
    Rails.logger.debug "Options for PUT: #{options}"
    response=self.class.put("#{@base_uri}/todos/#{todo.id}.xml", options)
    if response.success? && response.code == 200
      todo_hash=response.parsed_response['todo']
      todo=Todo.find(todo_hash['id']) rescue nil
      todo=Todo.new(todo_hash) unless todo
      todo.id=todo_hash['id']
      todo.save!
      return todo
    else
      return nil
    end
  end

  # Create todo in Tracks.
  # @return [Todo] New todo.
  def create_todo(todo)
    post_vals={:todo => {:project_id => nil, :context_id => todo.context_id, :description => todo.description}}
    options={:basic_auth => @auth, :body => post_vals}
    Rails.logger.debug "Options for POST: #{options}"
    response=self.class.post("#{@base_uri}/todos.xml", options)
    if response.success? && response.code == 201
      todo_id=get_id_from_location(response.response['location'])
      todo=get_todo(todo_id)
    else
      return nil
    end
    todo
  end

  def get_id_from_location(url)
    # Like http://kulti.fi/tracks/todos/79
    url.split("/").last
  end

  # Retrieve todos from Tracks. Also saves them to local database.
  # @param options [Hash]
  # @return [Array] of todos.
  def todos(options={})
    todo_list=[]
    options.merge!({:basic_auth => @auth})
    response=self.class.get("#{@base_uri}/todos.xml", options)
    if response.success?
      response.parsed_response['todos'].each do |todo_hash|
        todo=Todo.find(todo_hash['id']) rescue nil
        todo=Todo.new(todo_hash) unless todo
        todo.id=todo_hash['id']
        todo.save!
        todo_list<<todo
      end
      return todo_list
    else
      return nil
    end
  end

  # Retrieve given todo with id from Tracks.
  # @param options [Hash]
  # @return [HTTParty::Response]
  def get_todo(id, options={})
    return nil unless id
    options.merge!({:basic_auth => @auth})
    response=self.class.get("#{@base_uri}/todos/#{id}.xml", options)
    if response.success?
      todo_hash=response.parsed_response['todo']
      todo=Todo.find(todo_hash['id']) rescue nil
      todo=Todo.new(todo_hash) unless todo
      todo.id=todo_hash['id']
      todo.save!
      return todo
    else
      return nil
    end
  end

  def new_todo()
    Todo.new
  end

  # Filter todo array with given deadline date. Inlude those that has same or past date or nil date.
  def filter_todos_by_date(todos, date)
    filtered_todos=[]
    date=Time.zone.parse(date) if date.is_a? String
    todos.each do |todo|
      if date
        if todo
          todo_due=nil
          todo_due=todo.due.in_time_zone("Helsinki") unless todo.due.blank?
          if todo_due.blank? || todo_due == date || todo_due < date
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