// Browse Resources View
// =============

// Includes file dependencies
define([ "jquery", 
         "backbone",
         "text!../../templates/app/app-menu.html",
         "collections/ResourceTypesCollection",
         "pluralize" ], 

    function( $, Backbone, AppMenuTemplate, ResourceTypesCollection, owl ) {

        // Extends Backbone.View
        var BrowseResourcesView = Backbone.View.extend( {

            // The View Constructor
            initialize: function() {

                this.collection = new ResourceTypesCollection();
                this.collection.parent = this;

                this.collection.on("reset", this.render, this);
            },

            el: "#browsing-page",

            render: function() {

                // Render side app menu
                var $panel = this.$el.find('#menu-panel');
                $panel.html(_.template(AppMenuTemplate));

                if ( $panel.hasClass('ui-panel') )
                    $panel.trigger('create');

                // Render resources list
                var $ul = this.$el.find('div[data-role=content] ul');

                $ul.empty();

                this.collection.each( function(model) {

                    if ( model.get('display_in_dropdown') == "yes" )
                        $ul.append('<li><a href="#resources/' + model.get('name') + '">' + owl.pluralize(model.get('title')) + '</a></li>');
                });

                if ( $ul.hasClass('ui-listview') )
                    $ul.listview('refresh');
                else
                    $ul.trigger('create');

                return this;
            },
        } );

        // Returns the View class
        return BrowseResourcesView;

    } 
);