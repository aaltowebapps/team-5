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

function onDeviceMotion(event) {
  var ctx = document.getElementById("c").getContext("2d");
  var accel = event.accelerationIncludingGravity;
  $("#sliderX").val(Math.round(accel.x)).slider("refresh");
  $("#sliderY").val(Math.round(accel.y)).slider("refresh");
  $("#sliderZ").val(Math.round(accel.z)).slider("refresh");
  var angle = Math.atan2(accel.y, accel.x)
  ctx.clearRect(0, 0, 100, 100);
  ctx.beginPath();
  ctx.arc(50, 50, 5, 0, 2 * Math.PI, false);
  ctx.moveTo(50, 50);
  ctx.lineTo(50 - 50 * Math.cos(angle), 50 + 50 * Math.sin(angle));
  ctx.stroke();
}

$(document).ready(function () {
  window.addEventListener("devicemotion", onDeviceMotion, false);
  loadTodos();
});

