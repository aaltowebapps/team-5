class AddTagsToTodos < ActiveRecord::Migration
  def change
    add_column :todos, :tags, :string
    add_index :todos, :tags
  end
end
