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
  var output = '';
  $.getJSON("http://feeltask.cloudfoundry.com/todos.json?date=" + ISODateString(new Date()),
          function (data) {
            var count = 0;
            $.each(data.todos, function (index, todo) {
              output += '<li class="item_row" data-theme="c" data-icon="false"><a href="#show" class="item_row_text" onClick="sessionStorage.setItem(\'id\',' + todo.id + ');" data-transition="slide">' + todo.description + '</a>';
              output += '<div class="buttonContainer">';
              output += '<a href="#edit" class="item_btn" data-role="button" data-inline="true" data-mini="true" onClick="sessionStorage.setItem(\'id\',' + todo.id + ');">Edit</a>';
              output += '<a href="#delete" class="item_btn" data-role="button" data-theme="b" data-inline="true" data-mini="true" onClick="sessionStorage.setItem(\'id\',' + todo.id + ');">Delete</a>';
              output += '</div></li>';
              count = count + 1;
            });
            $('#todosList').html(output);
            $('#todosList').listview('refresh');
            $('#todosList .item_btn').button();
          });
};


$(document).bind('pageinit', function () {
  console.log("Pageinit for document started.");

  $('#home_title').html("Today, "+Date.today().toString("dddd d.M.yyyy"));

  $('#addEntry').noisy({
    'intensity':5,
    'size':'200',
    'opacity':0.04,
    'fallback':'',
    'monochrome':true
  }).css('background-color', '#1b1c1e');

  $(this).ajaxStart(function () {
    $.mobile.showPageLoadingMsg();
  });

  $(this).ajaxStop(function () {
    $.mobile.hidePageLoadingMsg();
  });

  $("#home").live('pageshow', function (event, ui) {
    loadTodos();
  });

  $("#show").live('pageshow', function (event, ui) {
    var todo_id = sessionStorage.getItem("id");
    console.log("Showing todo id=" + todo_id + " Previous page was:" + ui.prevPage);
    $("#show_title").html("Showing todo " + todo_id);
  });

  $('#addLink').click(function () {
    if ($('#addEntry').is(':hidden')) {
      $('#addEntry').slideDown();
      $('#addLink').attr("data-theme", "b").removeClass("ui-btn-up-a").addClass("ui-btn-up-b");
    }
    else {
      $('#addEntry').slideUp();
      $('#addLink').attr("data-theme", "a").removeClass("ui-btn-up-b").addClass("ui-btn-up-a");
    }
  });

  $('.item_row').live('swipeleft', function () {
    console.log("swiped left " + $(this));
    var buttons = $(this).find('.buttonContainer');
    if (buttons.is(':visible')) {
      console.log("Hiding buttons");
      buttons.hide('fast');
    }
    else {
      console.log("Showing buttons");
      buttons.show('fast');
    }

  });

  $('.item_row').live('swiperight', function () {
    console.log("swiped right " + $(this));
    var lbl = $(this).find('.item_row_text');
    if (lbl.hasClass("completed")) {
      lbl.removeClass("completed");
    }
    else {
      lbl.addClass("completed");
    }

  });
});
