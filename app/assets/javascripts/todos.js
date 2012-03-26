var loadTodos = function () {
  console.log("Loading todos");
  var output = '';
  $.getJSON("/todos.json",
          function (data) {
            $.each(data.todos, function (index, todo) {
              output += '<li>' + todo.description + '</li>';
            });
          });
  $('#todos').append(output).find('ul').listview('refresh');
};

$(document).ready(function () {
  loadTodos();
});