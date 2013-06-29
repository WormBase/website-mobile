var BASE_URL = 'http://staging.wormbase.org';

$.support.cors = true;

$.mobile.page.prototype.options.domCache = true;

var Class = function(className, objectId) {
  this.id = objectId;
  this.className = className;
  
  // TODO: Cache this offline through localStorage
  
  // Retrieve list of widgets and default widgets
  var widgetList = [];
  var defaultWidgets = [];
  $.ajax({
          url:      BASE_URL + '/rest/config/sections/species/'     /// TODO: fetch 'resources' as well, (paper, person, etc)
                             + className + '?content-type=application/json', 
          async:    false
  }).done(function(response){
      
      // Extract list of widgets
      for (var widget in response.data.widgets) {
        widgetList.push(new Widget(className, 
                                   objectId, 
                                   response.data.widgets[widget].name,
                                   response.data.widgets[widget].title));
      }

      // Extract list of default widgets
      for (var widget in response.data.default_widgets) {
        defaultWidgets.push(widget);
      } 
  }).fail(function(){
      alert('failed to retrieve class structure');
  });
  this.widgetList = widgetList;
  this.defaultWidgets = defaultWidgets;


  // Make all default widgets visible and populate side panel
  $('#object-page').find('div[data-role=panel]').find('ul').empty();
  $('#object-page').find('div[data-role=content]').empty();
  for (var i = 0; i < this.widgetList.length; i++) {  
    // Create widget list on side panel
    optionsHTML = '<li id="' + this.widgetList[i].widgetName + '-option">'
            + '<a href="#" style="padding: 0 0 0 0;" >'
            + '<label style="border-width: 0 0 0 0; margin: 0 0 0 0;" data-corners="false" >'
            + '<input type="checkbox" />'
            + '<h3>' + this.widgetList[i].widgetTitle + '</h3></label></a></li>';

    if (this.widgetList[i].widgetName == 'overview')
      $('#object-page div[data-role=panel] ul').prepend(optionsHTML);
    else
      $('#object-page div[data-role=panel] ul').append(optionsHTML);

    // check if this is a default widget, if yes show it
    for (var j = 0; j < this.defaultWidgets.length; j++)
      if (this.widgetList[i].widgetName == this.defaultWidgets[j]) {
        this.widgetList[i].show();
        $('#' + this.defaultWidgets[j] + '-option input').prop('checked', true);
      }

    $('#object-page div[data-role=panel] ul').trigger('create').listview('refresh');
  }

} // Class



var Widget = function(className, objectId, widgetName, widgetTitle) {

  this.className = className;
  this.objectId = objectId;
  this.widgetName = widgetName;
  this.widgetTitle = widgetTitle;
  this.visible = false;

} // Widget


Widget.prototype.show = function() {
// TODO: add support for browsers not supporting localStorage ? 

  this.visible = true;

  // Create widget container 
  var widgetContainerHTML = 
                '<div id="' + this.widgetName + '"' 
              + 'data-role="collapsible" '
              + 'data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" ' 
              + 'data-iconpos="right" data-collapsed="false" '
              + 'data-theme="c" data-content-theme="c"> '
              + '<h3>'+ this.widgetTitle +'</h3></div>';

  if (this.widgetName === 'overview')
    $('#object-page div[data-role=content]').prepend(widgetContainerHTML);
  else
    $('#object-page div[data-role=content]').append(widgetContainerHTML);

  $('#object-page div[data-role=content]').trigger('create');
  
  var objectId = this.objectId;
  var widgetName = this.widgetName;

  if (typeof localStorage[this.objectId] === "undefined" 
   || typeof (JSON.parse(localStorage[this.objectId])[this.widgetName]) === "undefined")
    $.ajax({
            url:      BASE_URL + '/rest/widget/' 
                      + this.className + '/' 
                      + this.objectId + '/' 
                      + this.widgetName + '?content-type=application/json',
            async:    false
    }).done(function(response){
      
      var obj = {};
      if (typeof localStorage[objectId] !== "undefined")
        obj = JSON.parse(localStorage[objectId]);

      obj[widgetName] = response.fields;
      localStorage[objectId] = JSON.stringify(obj);

    }).fail(function(){
      // display error in widget box
      $('#' + widgetName + ' .ui-collapsible-content')
        .append('<p>Could not possible to retrieve data</p>');
    });

    // set title in header
    if (this.widgetName === 'overview')
      $('#object-page div[data-role=header] h1')[0].innerHTML 
          = JSON.parse(localStorage[objectId])['overview'].name.data.label;

  // TODO: template caching

  $('#' + widgetName + ' .ui-collapsible-content').empty();
  $.ajax({
    url:  'templates/' + this.className + '/' + this.widgetName + '.handlebars',
    async:false
  }).done(function(fileContent){

    template = Handlebars.compile(fileContent);
    $('#' + widgetName + ' .ui-collapsible-content')
      .append(template(JSON.parse(localStorage[objectId])[widgetName]));

  }).fail(function(){

    // display error in widget box
    $('#' + widgetName + ' .ui-collapsible-content')
      .append('<p>Template file not found</p>');

  });

} // Widget.show()


Widget.prototype.hide = function() {

  this.visible = false;

  $('#' + this.widgetName).remove();

} // Widget.hide()



var object;

var searchClass;
var searchQuery;
var resultsPage;

// All jQuery event handlers go inside this
$(document).on('pageinit', function() {


  var search = function(className, query, page){
    page = (typeof page === "undefined") ? "1" : page;
    $.ajax({
            url:  BASE_URL + '/search/' 
                           + className + '/' + query + '/' + page 
                           + '?content-type=application/json'
    }).done(function(response){
      if (response.count > 0) 
        for (var i = 0; i < response.results.length; i++) {
            item = response.results[i];
            $('#search-results-list')
                .append('<li id="' + item.name.class + '-' + item.name.id + '">'
                      + '<a href="#"><h3>' 
                      + item.name.label + '</h3>'
                      + '<p>' + item.name.taxonomy + ' - ' + item.name.class
                      + '</p></a></li>');
        }
      else
        $('#search-results-list').append('<li><h3>No results</h3></li>');

      if (response.count > response.page * 10)
        $('#search-results-list').append('<li id="load-more"><a href="#">Load More</a></li>')

      $('#search-results-list').listview('refresh');
    }).fail(function(){ 
      alert('failed to load search results'); 
    });
  } // search

  var startNewSearch = function() {
    $('#search-results-list').empty();
    searchQuery = $('input[name=search]').val();
    if (searchQuery != '')
    {
      searchClass = $('#search-dropdown').find(":selected")[0].id;
      resultsPage = 1;
      search(searchClass, searchQuery, resultsPage);
    }
  } // startNewSearch

  $('input[name=search]').on('change', startNewSearch); // search box > change
  $('#search-dropdown').on('change', startNewSearch); // search dropdown > change

  $('#search-results-list').off().delegate('li', 'vclick', function(){
    if (this.id === "load-more") {
      resultsPage++;
      $('#search-results-list #load-more').remove();
      search(searchClass, searchQuery, resultsPage);
    
    } else {
      $.mobile.changePage('#object-page', { allowSamePageTransition: true });

      splittedID = this.id.split('-')
      className = splittedID.shift();
      objectId  = splittedID.join('-');
      object = new Class(className, objectId);
    }
  }); // #search-results-list li > vclick

  $('#object-page div[data-role=panel] ul').off().delegate('span.ui-btn-inner', 'click', function(){
    widgetName = $(this).parents('li')[0].id.split('-')[0];
    for (var i = 0; i < object.widgetList.length; i++)
      if (object.widgetList[i].widgetName == widgetName)
        if (object.widgetList[i].visible == false)
          object.widgetList[i].show();
        else
          object.widgetList[i].hide();  
  }); // widgets-panel-list > click
 
  // Populate search dropdown menu
  $('#search-page').on('pagebeforeshow', function(){    
    $('#search-dropdown').empty();
    $.ajax({
      url:  BASE_URL + '/rest/config/search_dropdown?content-type=application/json'
    }).done(function(response){
      $('#search-dropdown').empty();
      for (var i = 0; i < response.data.option.length; i++)
        $('#search-dropdown').append('<option id="' 
                                    + response.data.option[i].id + '">' 
                                    + response.data.option[i].title + '</option>')
                             .selectmenu('refresh');
    }).fail(function(){
      alert('Failed to populate dropdown search menu');
    });
  }); // #search-page > beforeshow


}); // document > pageinit