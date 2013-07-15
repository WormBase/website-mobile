// Widget Model
// =================

define( [ "jquery", "backbone" ], function( $, Backbone) {

    var WidgetModel = Backbone.Model.extend( {

        // Constructor
        initialize: function() {

            // Define the URL representing this widget on the server (this.url is used by the 'fetch' method)
            this.url = BASE_URL + '/rest/widget/' 
                      + this.collection.parent.get('className') + '/' 
                      + this.collection.parent.get('id') + '/' 
                      + this.get('name') + '?content-type=application/json';

            this.set( { widgetName: this.get('name') } );
            this.set( { name: this.get('id') } );
        },

        // Define default attributes
        defaults: {
            visible: false,
        },

    } );

    return WidgetModel;

} );