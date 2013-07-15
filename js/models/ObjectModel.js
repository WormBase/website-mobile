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

        } );

        // Returns the Model class
        return ObjectModel;

    } 
);