// In case we forget to take out console statements. IE becomes very unhappy when we forget. Let's not make IE unhappy
if (typeof(console) === 'undefined') {
  var console = {}
  console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function () {
  };
}

/* use a function for the exact format desired... */
function ISODateString(d) {
  function pad(n) {
    return n < 10 ? '0' + n : n
  }

  return d.getUTCFullYear() + '-'
          + pad(d.getUTCMonth() + 1) + '-'
          + pad(d.getUTCDate()) + 'T'
          + pad(d.getUTCHours()) + ':'
          + pad(d.getUTCMinutes()) + ':'
          + pad(d.getUTCSeconds()) + 'Z'
}

var loadTodos = function () {
  console.log("Loading todos from backend...");
  var output = '';
  $.getJSON("http://feeltask.cloudfoundry.com/todos.json?date="+ISODateString(new Date()),
          function (data) {
            var count = 0;
            console.log("Todos returned, rendering...");
            $.each(data.todos, function (index, todo) {
              output += '<li><a href="#show" onClick="sessionStorage.setItem(\'id\',' + todo.id + ');">' + todo.description + '</a></li>';
              count = count + 1;
            });
            $('#todosList').append(output);
            $('#todosList').listview('refresh');
            console.log("Todos returned, rendered " + count + " todos.");

          });
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

  $("#home").live('pageshow', function (event, ui) {
    console.log("Home show. Previous page was:" + ui.prevPage);
    loadTodos();
  });

  $(this).ajaxStart(function () {
    $.mobile.showPageLoadingMsg();
  });

  $(this).ajaxStop(function () {
    $.mobile.hidePageLoadingMsg();
  });


  $("#show").live('pageshow', function (event, ui) {
    var todo_id = sessionStorage.getItem("id");
    console.log("Showing todo id=" + todo_id + " Previous page was:" + ui.prevPage);
    $("#show_title").html("Showing todo " + todo_id);
  });

});
