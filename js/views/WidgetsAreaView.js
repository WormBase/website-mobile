// Widgets Area View
// =============

// Includes file dependencies
define([ "jquery", "backbone"], 

    function( $, Backbone ) {

        // Extends Backbone.View
        var WidgetsAreaView = Backbone.View.extend( {

            // The View Constructor
            initialize: function() {

            },

            el: "#widgets-area",

            show: function(widget) {

                $el = this.$el;

                // create the boxes for the widgets
                require( ["text!../templates/app/widget-container.html"], 
                    function(WidgetContainer) {
                        
                        template = _.template(WidgetContainer, { "widget": widget } );

                        if (widget.get('widgetName') == "overview")
                            $el.prepend(template);
                        else
                            $el.append(template);

                        $el.trigger('create');
                    }
                );

                // Retrieve all the fields for this widget from the server
                widget.fetch( {

                    success: function() {

                        // set the title in the header
                        if (widget.get('widgetName') == "overview")
                           $('#object-page div[data-role=header] h1')[0].innerHTML = widget.get('fields').name.data.label;

                        // look for the template file for this widget
                        require( ["text!../templates/classes/" + widget.collection.parent.get('className') + "/" + widget.get('widgetName') + ".html"], 

                            // on success, render it
                            function(widgetTemplate) {

                                widgetContent = _.template(widgetTemplate, { "widget": widget.get('fields') } );
                                $el.find("#" + widget.get('widgetName') + ' .ui-collapsible-content').append(widgetContent);
                            },

                            // on error, print error message
                            function(err) { 

                                widgetContent = "<p>The template file for this widget has not been implemented yet.</p>";
                                $el.find("#" + widget.get('widgetName') + ' .ui-collapsible-content').append(widgetContent);
                            }
                        );
                    },

                    error: function() {

                        widgetContent = "<p>Error while retrieving widget from the server</p>";
                        $el.find("#" + widget.get('widgetName') + ' .ui-collapsible-content').append(widgetContent);
                    },

                } );
    


            },

            hide: function(widget) {

                this.$el.find("#" + widget.get('widgetName')).remove();
            },

        } );

        // Returns the View class
        return WidgetsAreaView;

    } 
);