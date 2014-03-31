// Widgets Collection
// ====================

// Include file dependencies
define([ "jquery", "backbone", "models/WidgetModel" ], 
    function( $, Backbone, WidgetModel ) {

        // Extends Backbone.Collection
        var WidgetsCollection = Backbone.Collection.extend( {

            model: WidgetModel,

            url: function() {

                return WBMobile.defaults.BASE_URL + "/rest/config?class=" 
                                       + this.parent.get('className')
                                       + "&content-type=application/json";
            },

            // Overriding parse method
            parse: function(response) {
                // Extract list of default widgets
                var defaultWidgets = ['overview'];
                for (var widgetName in response.data.default_widgets)
                    defaultWidgets.push(widgetName);

                // Override default widgets
                if(response.data.title=="Protein")
                    defaultWidgets.push("homology");

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

            // For caching purposes
            getCacheKey: function() {

                return 'ObjectMeta' + ':' + this.parent.get('className')
            },
            
        } );

        return WidgetsCollection;

    }
);
 
