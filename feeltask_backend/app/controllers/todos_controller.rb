class TodosController < ApplicationController
  protect_from_forgery :except => [:create, :update]
  respond_to :json


  # GET /todos.json
  def index
    tracks_api=TracksApi.new("http://kulti.fi/tracks", "feeltask", "feeltask")
    date=params[:date].to_date rescue nil
    @todos = tracks_api.filter_todos_by_date(tracks_api.todos, date)
    respond_with @todos
  end

  # GET /todos/1.json
  def show
    @todo = TracksApi.new("http://kulti.fi/tracks", "feeltask", "feeltask").get_todo(params[:id])
    respond_with @todo
  end

  # GET /todos/new.json
  def new
    @todo = TracksApi.new("http://kulti.fi/tracks", "feeltask", "feeltask").new_todo
    respond_with @todo
  end

  # POST /todos.json
  def create
    if params[:todo]
      @todo = Todo.new(params[:todo])
    else
      @todo = Todo.new(:description => params[:description])
    end
    @todo.state = "active"
    @todo.context_id = 4
    api=TracksApi.new("http://kulti.fi/tracks", "feeltask", "feeltask")
    respond_to do |format|
      if @todo.save
        api.create_todo(@todo)
        format.json { render :json => @todo, :status => :created, :location => @todo }
      else
        format.json { render :json => @todo.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /todos/1.json
  def update
    api=TracksApi.new("http://kulti.fi/tracks", "feeltask", "feeltask")
    @todo = api.get_todo(params[:id])
    respond_to do |format|
      if @todo.update_attributes(params[:todo])
        api.update_todo(@todo)
        format.json { head :no_content }
      else
        format.json { render :json => @todo.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /todos/1
  # DELETE /todos/1.json
  def destroy
    @todo = Todo.find(params[:id])
    @todo.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end
end
