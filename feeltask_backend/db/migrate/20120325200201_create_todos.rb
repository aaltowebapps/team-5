class CreateTodos < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.integer :context_id, :project_id, :recurring_todo_id, :user_id
      t.string :description, :state
      t.text :notes
      t.datetime :due, :completed_at, :show_from
      t.timestamps
    end
  end
end
