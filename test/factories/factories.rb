saved_single_instances = {}
#Find or create the model instance
single_instances = lambda do |factory_key|
  begin
    saved_single_instances[factory_key].reload
  rescue NoMethodError, ActiveRecord::RecordNotFound
    #was never created (is nil) or was cleared from db
    saved_single_instances[factory_key] = FactoryGirl.create(factory_key) #recreate
  end

  return saved_single_instances[factory_key]
end

# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  factory :todo do
    due {Date.today.advance(:days => 6)}
    description "do something"
    state "open"
    context_id 1
  end

end


