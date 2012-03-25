$(document).ready(function () {

  $.getJSON("/todos.json",
          function (data) {
            var output = '';
            $.each(data.todos, function (index, todo) {
              output += '<li>' + todo.description + '</li>';
            });
            $('#todos').append(output).listview('refresh');
          });
});