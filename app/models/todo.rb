class Todo < ActiveRecord::Base

  validates_presence_of :description, :state, :context_id

end
