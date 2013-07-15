// Widgets Panel View
// =============

// Includes file dependencies
define([ "jquery", "backbone"], 

    function( $, Backbone ) {

        // Extends Backbone.View
        var WidgetsPanelView = Backbone.View.extend( {

            el: "#widgets-panel",

            // Renders all of the widgets options on the UI
            render: function() {

                var self = this;
                
                var widgets = this.parent.model.widgets.models;

                // create the options in the panel
                require( ["text!../templates/app/widget-panel-option.html"], 
                    function(WidgetPanelOption) {
                        
                        _.each( widgets, function(widget) {

                            // render the template
                            this.template = _.template( WidgetPanelOption, { "widget": widget } );

                            // append the rendered tempate to the panel
                            var ul = self.$el.find('ul');

                            // append/prepend list item to the ul
                            if (widget.get('widgetName') == "overview") 
                                ul.prepend(this.template);
                            else 
                                ul.append(this.template);

                            // if this widget is visible by default
                            if (widget.get('visible')) {

                                widget.trigger('change:visible', widget);

                                // make the checkbox appear checked
                                $('#' + widget.get('widgetName') + '-option input').prop('checked', true);
                            }

                            $('#' + widget.get('widgetName') + '-option').trigger('create');

                        } );

                        self.$el.find('ul').listview();
                        self.$el.trigger( "updatelayout" );
                    }
                );

                // Maintains chainability
                return this;

            }, 

            reset: function() {

                this.$el.find('ul').empty();
            },

        } );

        // Returns the View class
        return WidgetsPanelView;

    } 
);