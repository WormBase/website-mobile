// Object Model
// ==============

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "collections/WidgetsCollection" ],

    function( $, Backbone, WidgetsCollection ) {

        // The Model constructor
        var ObjectModel = Backbone.Model.extend( {

            initialize: function() {
                
                this.widgets = new WidgetsCollection();
                this.widgets.parent = this;
            },

            url: function() {

                return window.BASE_URL + '/rest/widget/' 
                      + this.get('className') + '/' + this.get('id') 
                      + '/overview?content-type=application/json';
            },

            getCacheKey: function() {

                return "Object" + ":" + this.get('className') + ":" + this.get('id');
            },
        } );

        // Returns the Model class
        return ObjectModel;

    } 
);