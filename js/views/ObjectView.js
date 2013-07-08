// Object View
// =============

// Includes file dependencies
define([ "jquery", 
         "backbone",
         "models/ObjectModel",
         "views/WidgetsAreaView" ], 

    function( $, Backbone, ObjectModel, WidgetsAreaView ) {

        // Extends Backbone.View
        var ObjectView = Backbone.View.extend( {

            // The View Constructor
            initialize: function() {
                var self = this;

                this.model = new ObjectModel();
                this.model.parentView = this;
                
                this.model.widgetsList.on("reset", this.render, this);

                this.areaView = new WidgetsAreaView();
                this.areaView.parentView = this;

                this.model.on("change:id", this.changeObject, this);

                this.model.widgetsList.on("change:visible", this.visibilityHasChanged, this);

                this.$el.find('ul').delegate("li","click", function() {

                    var widgetName = $(this)[0].id.split('-')[0];
                    
                    // find the widget in the collection
                    var widget = self.model.widgetsList.find( function(widget) { 
                        return widget.get('widgetName') == widgetName; 
                    } );

                    self.toggleVisibility(widget);

                } );
            },

            toggleVisibility: function(widget) {    

                widget.set( {visible: !widget.get('visible') } );
            },

            visibilityHasChanged: function(widget) {

                if (widget.get('visible') == true) 
                    this.areaView.show(widget);
                else                     
                    this.areaView.hide(widget);
            },

            el: "#object-page",


            changeObject: function() {

                $.mobile.loading("show");

                this.model.widgetsList.fetch({
                    
                    reset: true,

                    className: this.model.get('className'),

                    success: function() {
                        $.mobile.changePage("#object-page", { reverse: false, changeHash: false } );
                    },

                    error: function() {
                        console.log('error');
                    }
                });

            },
            
            // Renders all of the models on the UI
            render: function() {

                var self = this;
                
                var widgets = this.model.widgetsList.models;

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
                    }
                );

                // Maintains chainability
                return this;

            }

        } );

        // Returns the View class
        return ObjectView;

    } 
);