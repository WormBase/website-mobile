// Object View
// =============

// Includes file dependencies
define([ "jquery", 
         "backbone",
         "models/ObjectModel",
         "views/WidgetsPanelView",
         "views/WidgetsAreaView" ], 

    function( $, Backbone, ObjectModel, WidgetsPanelView, WidgetsAreaView ) {

        // Extends Backbone.View
        var ObjectView = Backbone.View.extend( {

            // The View Constructor
            initialize: function() {

                var self = this;

                this.model = new ObjectModel();
                this.model.parent = this;

                this.panelView = new WidgetsPanelView();
                this.panelView.parent = this;

                this.areaView = new WidgetsAreaView();
                this.areaView.parent = this;

                this.model.widgets.on("reset", this.reset, this);

                this.model.on("change:id", this.changeObject, this);

                // Bind event to open the panel
                this.$el.find('#openPanelButton').on("vclick", function() {

                    self.panelView.$el.panel('open');
                } );
            },

            el: "#object-page",

            toggleVisibility: function(widget) {    

                widget.set( {visible: !widget.get('visible') } );
            },

            changeObject: function() {

                var self = this;

                $.mobile.loading("show");

                this.model.fetch( {

                    cache: true,
                    expires: false,

                    reset: true,

                    success: function() {

                        self.model.widgets.fetch({
                            
                            cache:true,
                            expires: false,

                            reset: true,

                            success: function() {

                                $.mobile.loading('hide');

                                $.mobile.changePage( self.$el , { reverse: false, changeHash: false } );
                            },

                            error: function() {
                                alert('error');
                            }
                        });

                    },
                } );

            },

            // renders options on the panel and placeholders on the areaview
            render: function() {

                // put title in header
                this.$el.find('div[data-role=header] h1').html( this.model.get('fields').name.data.label );

                this.panelView.render();
                this.areaView.render();

                return this;
            },

            reset: function() {

                this.panelView.reset();
                this.areaView.reset();

                this.render();
            }
  
        } );

        // Returns the View class
        return ObjectView;

    } 
);