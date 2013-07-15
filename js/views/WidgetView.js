// Widget View
// =============

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "text!../../templates/app/widget-placeholder.html", 
         "text!../../templates/app/widget-container.html" ], 

    function( $, Backbone, WidgetPlaceholderTemplate, WidgetContainerTemplate ) {

        // Extends Backbone.View
        var WidgetView = Backbone.View.extend( {

            initialize: function() {

                this.model.view = this;

                this.model.on("change:visible", this.toggleVisibility, this);

            },

            // Renders the placeholder for this widget
            render: function() {

                var self = this;

                // render the template
                template = _.template( WidgetPlaceholderTemplate, { "widget": self.model } );

                // append/prepend list item to the parent view
                if (self.model.get('widgetName') == "overview") 
                    self.parent.$el.prepend(template);
                else 
                    self.parent.$el.append(template);

                // now that a placeholder has been placed, assign this view to that placeholder
                self.setElement( "#" + self.model.get('widgetName') );

                // Bind event to open popups after a click on a button
                self.$el.on('vclick', 'button', function() {

                    $("#" + this.id + "Popup").popup('open');
                } );

                this.parent.parent.$el.off().on('mouseenter', '[rel~=tooltip]', function() {

                    target  = $( this );
                    tip     = target.attr( 'title' );
                    tooltip = $( '<div id="tooltip"></div>' );
             
                    if( !tip || tip == '' )
                        return false;
             
                    target.removeAttr( 'title' );
                    tooltip.css( 'opacity', 0 )
                           .html( tip )
                           .appendTo( 'body' );

                    var init_tooltip = function()
                    {
                        if( $( window ).width() < tooltip.outerWidth() * 1.5 )
                            tooltip.css( 'max-width', $( window ).width() / 2 );
                        else
                            tooltip.css( 'max-width', 340 );
             
                        var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                            pos_top  = target.offset().top - tooltip.outerHeight() - 20;
             
                        if( pos_left < 0 )
                        {
                            pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                            tooltip.addClass( 'left' );
                        }
                        else
                            tooltip.removeClass( 'left' );
             
                        if( pos_left + tooltip.outerWidth() > $( window ).width() )
                        {
                            pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                            tooltip.addClass( 'right' );
                        }
                        else
                            tooltip.removeClass( 'right' );
             
                        if( pos_top < 0 )
                        {
                            var pos_top  = target.offset().top + target.outerHeight();
                            tooltip.addClass( 'top' );
                        }
                        else
                            tooltip.removeClass( 'top' );
             
                        tooltip.css( { left: pos_left, top: pos_top } )
                               .animate( { top: '+=10', opacity: 1 }, 50 );
                    };
             
                    init_tooltip();
                    $( window ).resize( init_tooltip );
             
                    var remove_tooltip = function()
                    {
                        tooltip.animate( { top: '-=10', opacity: 0 }, 50, function()
                        {
                            $( this ).remove();
                        });
             
                        target.attr( 'title', tip );
                    };
             
                    target.on( 'mouseleave', remove_tooltip );
                    tooltip.on( 'click', remove_tooltip );
                } );

                // Maintains chainability
                return this;
            },

            toggleVisibility: function() {

                if (this.model.get('visible') == true)
                    this.show();
                else
                    this.hide();
            },

            show: function() {

                var self = this;

                // create the boxes for the widgets
                template = _.template(WidgetContainerTemplate, { "widget": self.model } );
                self.$el.append(template).trigger('create');

                // Retrieve all the fields for this widget from the server
                self.model.fetch( {

                    success: function() {

                        // set the title in the header
                        if (self.model.get('widgetName') == "overview")
                           $('#object-page div[data-role=header] h1')[0].innerHTML = self.model.get('fields').name.data.label;

                        // look for the template file for this widget
                        require( ["text!../templates/classes/" + self.model.collection.parent.get('className') + "/" + self.model.get('widgetName') + ".html"], 
                            // on success, render it
                            function(widgetTemplate) {

                                widgetContent = _.template(widgetTemplate, { "fields": self.model.get('fields') } );
                                self.$el.find('.ui-collapsible-content').append(widgetContent).trigger('create');
                            },

                            // on error, print error message
                            function(err) { 

                                widgetContent = "<p>The template file for this widget has not been implemented yet.</p>";
                                self.$el.find('.ui-collapsible-content').append(widgetContent);
                            }
                        );
                    },

                    error: function() {

                        widgetContent = "<p>Error while retrieving widget from the server</p>";
                        self.$el.find('.ui-collapsible-content').append(widgetContent);
                    },

                } );
    


            },

            hide: function() {

                this.$el.children("div").remove();
            },


        } );

        // Returns the View class
        return WidgetView;

    } 
);