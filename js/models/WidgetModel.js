// Widget Model
// =================

define( [ "jquery", "backbone" ], function( $, Backbone) {

    var WidgetModel = Backbone.Model.extend( {

        // Constructor
        initialize: function() {

            this.set( { widgetName: this.get('name') } );
            this.set( { name: this.get('id') } );

            // Define the URL representing this widget on the server (this.url is used by the 'fetch' method)
            this.url = window.BASE_URL + '/rest/widget/' 
                      + this.collection.parent.get('className') + '/' 
                      + this.collection.parent.get('id') + '/' 
                      + this.get('widgetName') + '?content-type=text/html';

            this.parse = function(response) {
                return { "html": response};
            };
        },

        // Define default attributes
        defaults: {
            visible: false,
        },

        // For caching purposes
        getCacheKey: function() {

            return 'Widget'
                    + ':' + this.collection.parent.get('className')
                    + ':' + this.collection.parent.get('id')
                    + ':' + this.get('widgetName')
        },

    } );

    return WidgetModel;

} );