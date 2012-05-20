var selectedDay = new Date();
var Templates = {};
var todos;
var listView;

var Todo = Backbone.Model.extend({
  defaults:{
    created_at:Date.now
  },
  url:function () {
    var end = this.id ? '/todos/' + this.id + '.json' : '/todos.json';
    return 'http://0.0.0.0:3000' + end;
  },
  initialize:function () {
  }
});

var Todos = Backbone.Collection.extend({
  model:Todo,
  url:"http://0.0.0.0:3000/todos.json",
  initialize:function () {
  }
});

function toggleTodoCompleted(item) {
  var item_id = item.find(".item_row_id").html();
  var item = todos.get(item_id);
  if (item.get("state") == "completed") {
    // Mark as active
    item.set({state:"active", completed_at:null});
    item.save();
    console.log("item id " + item_id + " marked as open.");
  }
  else {
    // Mark as completed
    item.set({state:"completed", completed_at:new Date().toISOString()});
    item.save();
    console.log("item id " + item_id + " marked as completed.");
  }
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
    var todo = todos.get(id);
    if (todo != undefined) {
      console.log("Submit called for edit item id '" + id + "':" + todo);
      todo.set("description", desc);
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
  //View for rendering one todo
  var ItemView = Backbone.View.extend({
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
      click:function (event) {
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
      if (this.model.get("state") == "completed") {
        $(this.el).find(".item_row_text").addClass("completed")
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
  var ListView = Backbone.View.extend({
    el:$("#todosList"),
    events:{
      "click .item_btn_delete":function (event) {
        console.debug("Clicked delete");
      },
      "click .item_btn_edit":function (event) {
        var target = $(event.currentTarget);
        console.debug("Clicked edit");
        var id = target.data("id");
        var item = this.collection.get(id);
        var desc = item.get("description");
        $("#edit_id").val(id);
        $("#edit_description").val(desc);
        $.mobile.changePage("#edit");
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
  // Instantiate the views
  listView = new ListView({collection:todos});

  $('#home_title').html(selectedDay.toString("dddd d.M.yyyy"));

  $('#addEntry').noisy({
    'intensity':5,
    'size':'200',
    'opacity':0.04,
    'fallback':'',
    'monochrome':true
  }).css('background-color', '#1b1c1e');

  $("#jump").live('pageshow', function (event, ui) {
    // TODO: Implement month loading here.
    $('#jump_month_title').html(Date.today().toString("MMM yyyy"));
  });

  $(this).ajaxStart(function () {
    $.mobile.showPageLoadingMsg();
  });

  $(this).ajaxStop(function () {
    $.mobile.hidePageLoadingMsg();
  });

  console.log("Fetching tasks for date " + ISODateString(selectedDay));
  todos.fetch({data:{date:ISODateString(selectedDay)}});

});
