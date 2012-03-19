$(document).ready(function () {


  $.get('http://kulti.fi/tracks/todos.xml?callback=?',
          function (xml) {
            $(xml).find("todo").each(function () {
              $("#todos ul").append("<li><a href=\"#\"><span class=\"tab\">" + $(this).attr("description") + "</span></a></li>");
            });
          });

});