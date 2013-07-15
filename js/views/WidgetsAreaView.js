// Widgets Area View
// =============

// Includes file dependencies
define([ "jquery", "backbone", "views/WidgetView"], 

    function( $, Backbone, WidgetView ) {

        // Extends Backbone.View
        var WidgetsAreaView = Backbone.View.extend( {

            // The View Constructor
            initialize: function() {

                this.widgetViews = [];
            },

            el: "#widgets-area",

            // renders the widgets placeholders
            render: function() {

                var self = this;

                _.each(this.parent.model.widgets.models, function(model) {
    
                    var newWidgetView = new WidgetView( { model: model } );
                    newWidgetView.parent = self;

                    newWidgetView.render();

                    self.widgetViews.push( newWidgetView );     
                } );

                return this;
            },

            reset: function() {

                this.$el.empty();
            },
        } );

        // Returns the View class
        return WidgetsAreaView;

    } 
);