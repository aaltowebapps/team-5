class TodosController < ApplicationController

  respond_to :json


  # GET /todos.json
  def index
    #@todos = Todo.all
    # TODO: Combine fetched todos with our database?
    @todos = TracksAPI.new("http://kulti.fi/tracks", "feeltask", "feeltask").todos
    respond_with @todos
  end

  # GET /todos/1.json
  def show
    @todo = TracksAPI.new("http://kulti.fi/tracks", "feeltask", "feeltask").todo(params[:id])
    respond_with @todo
  end

  # GET /todos/new.json
  def new
    @todo = Todo.new
    respond_with @todo
  end

  # POST /todos.json
  def create
    @todo = Todo.new(params[:todo])
    respond_to do |format|
      if @todo.save
        format.json { render :json => @todo, :status => :created, :location => @todo }
      else
        format.json { render :json => @todo.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /todos/1.json
  def update
    @todo = TracksAPI.new("http://kulti.fi/tracks", "feeltask", "feeltask").todo(params[:id])

    respond_to do |format|
      if @todo.update_attributes(params[:todo])
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
