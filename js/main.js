var BASE_URL = 'http://staging.wormbase.org';

$.support.cors = true;

$.mobile.page.prototype.options.domCache = true;

function search(className, query, page){
  page = (typeof page === "undefined") ? "1" : page;
  return $.ajax(BASE_URL + '/search/' 
                + className + '/' + query + '/' + page 
                + '?content-type=application/json');
} // search


var Class = function(className, objectId) {
  this.id = objectId;
  this.className = className;
  
  // TODO: Cache this offline through localStorage
  
  // Retrieve list of widgets and default widgets
  var widgetList = [];
  var defaultWidgets = [];
  $.ajax({
          url:      BASE_URL + '/rest/config/sections/species/' 
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
  for (var i = 0; i < this.widgetList.length; i++) {  
    // Create widget list on side panel
    $('#object-page').find('div[data-role=panel]').find('ul')
      .append('<li id="' + this.widgetList[i].widgetName + '"><a href="#" style="padding: 0 0 0 0;" >'
            + '<label style="border-width: 0 0 0 0; margin: 0 0 0 0;" data-corners="false" >'
            + '<input type="checkbox"/>'
            + '<h3>' + this.widgetList[i].widgetTitle + '</h3></label></a></li>')
      .listview('refresh').trigger('create');
    
    // check if this is a default widget, if yes show it
    for (var j = 0; j < this.defaultWidgets.length; j++)
      if (this.widgetList[i].widgetName == this.defaultWidgets[j])
        this.widgetList[i].show();
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
// TODO: add support for browsers not supporting localStorage

  this.visible = true;

  $('#object-page').find('div[data-role=content]')
        .append('<div id="' + this.objectId + '_' + this.widgetName + '"' 
              + 'data-role="collapsible" '
              + 'data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" ' 
              + 'data-iconpos="right" data-collapsed="false" '
              + 'data-theme="c" data-content-theme="c"> '
              + '<h3>'+ this.widgetTitle +'</h3></div>').trigger('create');
  
  // TODO: toggle checkbox on left panel
  
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
      
      //widgetName = response.uri.split('/').pop();

      var obj = {};
      if (typeof localStorage[objectId] !== "undefined")
        obj = JSON.parse(localStorage[objectId]);

      obj[widgetName] = response.fields;
      localStorage[objectId] = JSON.stringify(obj);

    }).fail(function(){
      // display error in widget box
      $('#' + objectId + '_' + widgetName + ' .ui-collapsible-content')
        .append('<p>Could not possible to retrieve data</p>');
    });

    // set title in header
    if (this.widgetName === 'overview')
      $('#object-page div[data-role=header] h1')[0].innerHTML 
          = JSON.parse(localStorage[objectId])['overview'].name.data.label;

  // TODO: template caching

  $.ajax({
    url:  'templates/' + this.className + '/' + this.widgetName + '.handlebars',
    async:false
  }).done(function(fileContent){

    template = Handlebars.compile(fileContent);
    $('#' + objectId + '_' + widgetName + ' .ui-collapsible-content')
      .append(template(JSON.parse(localStorage[objectId])[widgetName]));

  }).fail(function(){

    // display error in widget box
    $('#' + objectId + '_' + widgetName + ' .ui-collapsible-content')
      .append('<p>Template file not found</p>');

  });

} // Widget.show()


Widget.prototype.hide = function() {
  this.visible = false;

  // TODO: clear the div where the widget was placed in

} // Widget.hide()


/*
function getWidget(className, objectId, widgetName){
  return $.ajax(BASE_URL + '/rest/widget/' 
                + className + '/' + objectId + '/' + widgetName 
                + '?content-type=application/json');
} // getWidget

function getField(className, objectId, fieldName){
  return $.ajax(BASE_URL + '/rest/field/' 
                + className + '/' + objectId + '/' + fieldName 
                + '?content-type=application/json');
} // getField
*/


// All jQuery event handlers go inside this
$(document).on('pageinit', function() {

  // TODO: add search for other class types, add multi page support
  $('input[name=search]').on('change', function(){
    query = $('input[name=search]').val();
    if (query != '')
      search('gene', query)
        .done(function(response){
          $('#search-results-list').empty();
          if (response.count > 0) {

            for (var i = 0; i < response.results.length; i++) {
              item = response.results[i];
              $('#search-results-list')
                  .append('<li id="' + item.name.id 
                        + '" myclass="' + item.name.class + '">' // bad
                        + '<a href="#object-page"><h3>' 
                        + item.name.label + '</h3>'
                        + '<p>' + item.name.taxonomy + ' - ' + item.name.class
                        + '</p></a></li>');
            }
            $('#search-results-list').listview('refresh');
          }
          else
            $('#search-results-list').append('<h3>No results</h3>');
        })
        .fail(function(){ console.log('failed to load search results'); });
  }); // input[name=search] > change


  $('#search-results-list').delegate('li', 'vclick', function(){
    console.log(this.id);
    // TODO: handle page change to search result
  });

  // TODO: make event handler for the widgets side panel

  // just a test
  $('#object-page').on('pagebeforeshow', function(){
    gene = new Class('gene', 'WBGene00015146');
    console.log(gene);
  }); 
  
}); // document > pageinit
