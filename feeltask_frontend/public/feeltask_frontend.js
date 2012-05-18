var selectedDay = new Date();
var Templates = {};
var todos;

var Todo = Backbone.Model.extend({
  defaults:{
    created_at:Date.now
  },
  initialize:function () {
    console.log("New todo initialized.");
  }
});

var Todos = Backbone.Collection.extend({
  model:Todo,
  url:'http://feeltask.cloudfoundry.com/todos.json',
  initialize:function () {
    console.log("New todo list initialized.");
  }
});

$(function () {
  //Load the templates and store them in a global variable
  $('script[type="text/x-handlebars-template"]').each(function () {
    Templates[this.id] = Handlebars.compile($(this).html());
  });

  //View for rendering one todo
  var ItemView = Backbone.View.extend({
    tagName:"li",
    events:{
      "blur [contenteditable]":"saveValues"
    },
    initialize:function () {
      this.model.bind('change', this.render, this);
      this.template = Templates.todo;
    },
    render:function () {
      $(this.el).addClass("item_row").html(this.template(this.model.toJSON()));
      return this;
    },
    saveValues:function () {
      this.model.save({
        title:this.$("[data-name='title']").html(),
        content:this.$("[data-name='content']").html()
      }, {silent:true});
    }
  });

  //View for rendering the list of todos
  var ListView = Backbone.View.extend({
    el:$("#todosList"),
    events:{
    },
    initialize:function () {
      this.collection.bind('reset', this.render, this);
      this.collection.bind('all', this.render, this);
    },
    render:function () {
      var el = this.$el;
      el.empty();
      this.collection.each(function (item) {
        var itemView = new ItemView({model:item});
        el.append(itemView.render().el);
      });
      this.$el.listview('refresh');
      this.$el.find('.item_btn').button();

      return this;
    }
  });

  //Instantiate the views
  var listView = new ListView({collection:todos});
})

function toggleAddEntry() {
  if ($('#addEntry').is(':hidden')) {
    $('#addEntry').slideDown();
    $('#addLink').attr("data-theme", "b").removeClass("ui-btn-up-a").addClass("ui-btn-up-b");
  }
  else {
    $('#addEntry').slideUp();
    $('#addLink').attr("data-theme", "a").removeClass("ui-btn-up-b").addClass("ui-btn-up-a");
  }
}

$(document).bind('pageinit', function () {
  console.log("Pageinit for document started.");
  todos = new Todos();

  $('#home_title').html("Today, " + Date.today().toString("dddd d.M.yyyy"));

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
    console.log("Fetching tasks for date " + ISODateString(selectedDay));
    todos.fetch({data:{date:ISODateString(selectedDay)}});
    //loadTodos();
  });

  $("#jump").live('pageshow', function (event, ui) {
    // TODO: Implement month loading here.
    $('#jump_month_title').html(Date.today().toString("MMM yyyy"));
  });

  $("#show").live('pageshow', function (event, ui) {
    var todo_id = sessionStorage.getItem("id");
    console.log("Showing todo id=" + todo_id + " Previous page was:" + ui.prevPage);
    $("#show_title").html("Showing todo " + todo_id);
  });

  $('#addLink').click(function () {
    toggleAddEntry();
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
  $("#add_entry_form").submit(function (event) {
    console.log("Added new task...");
    event.preventDefault();
    toggleAddEntry();
    return false;
  });
});
