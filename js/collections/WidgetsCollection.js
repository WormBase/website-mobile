// Widgets Collection
// ====================

// Include file dependencies
define([ "jquery", "backbone", "models/WidgetModel" ], 
    function( $, Backbone, WidgetModel ) {

        // Extends Backbone.Collection
        var WidgetsCollection = Backbone.Collection.extend( {

            model: WidgetModel,

            url: function() {

                return window.BASE_URL + "/rest/config?class=" 
                                       + this.parent.get('className')
                                       + "&content-type=application/json";
            },

            // Overriding parse method
            parse: function(response) {

                // Extract list of default widgets
                var defaultWidgets = [];
                for (var widgetName in response.data.default_widgets)
                    defaultWidgets.push(widgetName);

                // we need to convert from JSON to array
                var array = [];
                for (var widgetName in response.data.widgets) {

                    // if this is a default widget, set attribute visible = true
                    response.data.widgets[widgetName].visible = 
                                    (defaultWidgets.indexOf(widgetName) != -1) 
                                        ? true : false;
                    
                    array.push(response.data.widgets[widgetName]);
     
                }
                
                return array;
            },


/*          Temporary: use this method only if staging or dev servers are not available

            // Overriding Backbone.fetch method
            fetch: function(options) {
                
                // As in the backbone source
                options = options ? _.clone(options) : {};
                if (options.parse === void 0) options.parse = true;
                var success = options.success;
                var collection = this;
                options.success = function(resp) {
                var method = options.reset ? 'reset' : 'set';
                collection[method](resp, options);
                if (success) success(collection, resp, options);
                    collection.trigger('sync', collection, resp, options);
                };
                //return this.sync('read', this, options);
                
                // MY CODE
                // Define my own URL (fetching from 'species')
                options.url = window.BASE_URL + "/rest/config/sections/species/" 
                            + options.className + "?content-type=application/json";

                options.async = false;
                
                // do the request
                var xhr = this.sync('read', this, options);

                // if the previous request haven't found the class
                if (xhr.responseJSON.data == null) {

                    // redefine the url (now fetch from 'resources')
                    options.url = options.url.replace("species", "resources");

                    // re-do the request
                    xhr = this.sync('read', this, options)
                }

                return xhr;
            },
*/
            
        } );

        return WidgetsCollection;

    }
);
 