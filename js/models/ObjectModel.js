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
                
                this.widgetsList = new WidgetsCollection();
                this.widgetsList.parent = this;
            },

        } );

        // Returns the Model class
        return ObjectModel;

    } 
);