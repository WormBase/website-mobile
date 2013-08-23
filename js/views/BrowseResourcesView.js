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

                // Render side app menu
                this.$el.append( _.template( AppMenuTemplate, {} ) );

                var self = this;

                this.collection = new ResourceTypesCollection();
                this.collection.parent = this;

                this.collection.on("reset", this.render, this);
            },

            el: "#browsing-page",

            render: function() {

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