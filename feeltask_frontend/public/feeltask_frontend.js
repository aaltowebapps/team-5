/**
 * This file includes all code for implementing feeltask front.
 *
 */

var selectedDay = new Date();
var Templates = {};
var todos;
var days;
var ListView;
var listView;
var ItemView;
var DayView;
var DayListView;
var dayListView;

// Creating models for backbone
var Todo = Backbone.Model.extend({
  defaults:{
    created_at:Date.now
  },
  url:function () {
    var end = this.id ? '/todos/' + this.id + '.json' : '/todos.json';
    return 'http://feeltask.cloudfoundry.com' + end;
  },
  initialize:function () {
  }
});

var Todos = Backbone.Collection.extend({
  model:Todo,
  url:"http://feeltask.cloudfoundry.com/todos.json",
  initialize:function () {
  }
});

var Day = Backbone.Model.extend({
  defaults:{
    id:null
  },
  initialize:function () {
  }
});

var Days = Backbone.Collection.extend({
  model:Day,
  initialize:function () {
  }
});

// Get item from given li element.
function get_li_item(liElem) {
  var id = liElem.find(".item_row_id").html();
  var item = todos.get(id);
  return item;
}

// toggle to do completed or active. With given li-element.
function toggleTodoCompleted(item_li) {
  var item = get_li_item(item_li);
  var id = item.get("id");
  if (item.get("state") == "completed") {
    // Mark as active
    item.set({state:"active", completed_at:null});
    item.save();
    console.log("item id " + id + " marked as open.");
  }
  else {
    // Mark as completed
    item.set({state:"completed", completed_at:new Date().toISOString()});
    item.save();
    console.log("item id " + id + " marked as completed.");
  }
}

// This is called when phone is shaked.
function mobileShakeEvent() {
  console.log("mobile shaked!");
  fetchTodos();
}

$(function () {
  //Load the templates and store them in a global variable
  $('script[type="text/x-handlebars-template"]').each(function () {
    Templates[this.id] = Handlebars.compile($(this).html());
  });

  // Submitting edited item
  $("#edit_todo_form").submit(function (event) {
    event.preventDefault();
    var id = $("#edit_id").val();
    var desc = $("#edit_description").val();
    var loc = $("#edit_location").val();
    var todo = todos.get(id);
    if (todo != undefined) {
      console.log("Submit called for edit item id '" + id + "':" + todo);
      todo.set({description:desc, location:loc});
      todo.save();
      //todos.fetch();
      $.mobile.changePage("#home");
    } else {
      console.error("todo not found? id" + id);
    }
    return false;
  });

  $('#addLink').click(function () {
    toggleAddEntry();
  });

  // Replacing submit for doing new todo.
  $("#add_entry_form").submit(function (event) {
    console.log("Added new task...");
    var new_todo = new Todo({description:$("#new_desc").val()})
    new_todo.save();
    todos.add(new_todo);
    event.preventDefault();
    toggleAddEntry();
    return false;
  });
  
  $('#showRoute').click(function () {
  	if ($('#route').is(':hidden')) {
  	    $('#map').slideUp();
	    $('#route').slideDown();
	    $('#showDirections').attr("data-theme", "b").removeClass("ui-btn-up-a").addClass("ui-btn-up-b");
	  }
	  else {
	    $('#route').slideUp();
	    $('#map').slideDown();
	    $('#showDirections').attr("data-theme", "a").removeClass("ui-btn-up-b").addClass("ui-btn-up-a");
	  }
  });

})

function fetchTodos() {
  $('#home_title').html(selectedDay.toString("dddd d.M.yyyy"));
  console.log("Fetching tasks for date " + ISODateString(selectedDay));
  todos.fetch({data:{date:ISODateString(selectedDay)}});
}

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

  initViews();

  $('#addEntry').noisy({
    'intensity':5,
    'size':'200',
    'opacity':0.04,
    'fallback':'',
    'monochrome':true
  }).css('background-color', '#1b1c1e');

  $("#jump").live('pagebeforeshow', function (event, ui) {
    drawMonth();
  });

  //$("#jump").live('pageshow', function (event, ui) {
  //  drawMonth();
  //});

  $(this).ajaxStart(function () {
    $.mobile.showPageLoadingMsg();
  });

  $(this).ajaxStop(function () {
    $.mobile.hidePageLoadingMsg();
  });

  fetchTodos();
});


// Initializing views
function initViews() {
  // Setup instances for backbone collections
  todos = new Todos();
  days = new Days({id:1, dayno:"1"});

  //View for rendering one to do
  ItemView = Backbone.View.extend({
    tagName:"li",
    events:{
      swipeleft:function (event) {
        var target = $(event.currentTarget);
        console.debug("swiped left " + target.className);
        var buttons = target.find('.buttonContainer');
        if (buttons.is(':visible')) {
          console.debug("Hiding buttons");
          buttons.hide('fast');
        }
        else {
          console.debug("Showing buttons");
          buttons.show('fast');
        }
      },
      swiperight:function (event) {
        var target = $(event.currentTarget);
        console.debug("swiped right");
        toggleTodoCompleted(target);
      }
    },
    initialize:function () {
      this.model.bind('change', function () {
        //console.log("item view noticed change in model." + this.model.get("id"));
        this.render;
      }, this);
      this.template = Templates.todo;
    },
    render:function () {
      $(this.el).addClass("item_row").html(this.template(this.model.toJSON()));
      // Mark as done if needed.
      if ((this.model.get("state") == "completed" ) && (this.model.get("completed_at") != null )) {
        $(this.el).find(".item_row_text").addClass("completed");
      }
      // Hide icon map if location doesn't exist
      var loc = this.model.get("location");
      if ((loc == undefined) || (loc == null) || (loc == "")) {
        $(this.el).find(".item_btn_map").hide();
      }
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
  ListView = Backbone.View.extend({
    el:$("#todosList"),
    events:{
      "click .item_btn_delete":function (event) {
        var target = $(event.currentTarget);
        console.debug("Clicked delete");
        if (confirm("Are you sure?")) {
          var item = get_li_item(target.parents("li"));
          if (item.get("state") == "active") {
            toggleTodoCompleted(target.parents("li"));
          }
          todos.remove(item);
        }
      },
      "click .item_btn_edit":function (event) {
        var target = $(event.currentTarget);
        console.debug("Clicked edit");
        var id = target.data("id");
        var item = this.collection.get(id);
        var desc = item.get("description");
        var loc = item.get("location");
        $("#edit_id").val(id);
        $("#edit_description").val(desc);
        $("#edit_location").val(loc);
        $.mobile.changePage("#edit");
      },
      "click .item_btn_map":function (event) {
        var target = $(event.currentTarget);
        var id = target.data("id");
        var item = this.collection.get(id);
        console.debug("Clicked map for item id " + item.get("id"));
        $.mobile.changePage("#directions");
        // TODO: Implement map show
      }
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

  //View for rendering one to do
  DayView = Backbone.View.extend({
    tagName:"div",
    events:{
      click:function (event) {
        var target = $(event.currentTarget);
        var date = target.find("a").data("date");
        console.debug("Clicked day " + date);
        selectedDay = Date.parseExact(date, "d.M.yyyy");
        fetchTodos();
        $.mobile.changePage("#home");
      }
    },
    initialize:function () {
      this.model.bind('change', function () {
        this.render;
      }, this);
      this.template = Templates.jump_day;
    },
    render:function () {
      $(this.el).html(this.template(this.model.toJSON()));
      var date = Date.parseExact(this.model.get("date"), "d.M.yyyy");
      if (Date.today().compareTo(date) == 0) {
        $(this.el).find("a").addClass("current")
      }
      return this;
    }
  });

  //View for rendering the list of todos
  DayListView = Backbone.View.extend({
    el:$("#weeks"),
    events:{
    },
    initialize:function () {
      this.collection.bind('reset', this.render, this);
      this.collection.bind('all', this.render, this);
    },
    render:function () {
      var el = this.$el;
      el.empty();
      this.collection.each(function (day) {
        var dayView = new DayView({model:day});
        el.append(dayView.render().el);
      });
      return this;
    }
  });

  // Instantiate the views
  listView = new ListView({collection:todos});
  dayListView = new DayListView({collection:days});
}