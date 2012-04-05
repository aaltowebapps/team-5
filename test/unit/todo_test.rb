require 'test_helper'

class TodoTest < ActiveSupport::TestCase
  test "factory should work" do
    assert_not_nil FactoryGirl.create(:todo)
  end
end
