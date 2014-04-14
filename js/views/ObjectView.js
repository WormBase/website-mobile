// Object View
// =============

// Includes file dependencies
define([ "jquery", 
         "backbone",
         "models/ObjectModel",
         "views/WidgetsPanelView",
         "views/WidgetsAreaView",
         "text!../../templates/app/app-menu.html" ], 

    function( $, Backbone, ObjectModel, WidgetsPanelView, WidgetsAreaView, AppMenuTemplate ) {

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

                this.$el.on('swipeleft', function() { 
                    if($.mobile.activePage.find('#menu-panel').hasClass('ui-panel-closed')){
                        self.panelView.$el.panel('open');
                    }
                } );
                this.$el.on('swiperight', function() {
                    if($.mobile.activePage.find('#menu-panel').hasClass('ui-panel-closed')){
                        self.panelView.$el.panel('close');
                    }
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

                // Render side app menu
                var $panel = this.$el.find('#menu-panel');
                $panel.html(_.template(AppMenuTemplate));

                if ( $panel.hasClass('ui-panel') )
                    $panel.trigger('create');


                // put title in info box
                var data = this.model.get('fields').name.data;
                var boxContent = "";

                if (data.taxonomy != "all")
                    boxContent += data.taxonomy + " » ";

                if(data.class == "wbprocess"){
                    boxContent += "topics" + " » " + data.label;
                }else{
                    boxContent += data.class + " » " + data.label;
                }

                this.$el.find('#info-box').html( boxContent );

                // render widgets panel and area
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
