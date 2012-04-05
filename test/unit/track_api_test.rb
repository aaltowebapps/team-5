require 'test_helper'

class TracksApiTest < ActiveSupport::TestCase

  setup do
    @api=TracksApi.new(TracksApi::DEFAULT_TRACKS_URI, TracksApi::DEFAULT_USERNAME, TracksApi::DEFULT_PASSWORD)
  end

  test "init" do
    assert_not_nil(@api)
  end

  test "todo list" do
    todos=@api.todos
    assert_not_nil todos
  end

  test "todo show" do
    todos=@api.todos
    first_todo=todos.to_hash['todos'][0]
    assert_not_nil first_todo
  end

  test "todo new" do
    new_todo=@api.new_todo
    assert_not_nil new_todo
  end

end
