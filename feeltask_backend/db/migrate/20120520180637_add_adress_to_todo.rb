class AddAdressToTodo < ActiveRecord::Migration
  def change
    add_column :todos, :location, :string
  end
end
