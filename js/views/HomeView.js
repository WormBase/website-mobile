// Home View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "text!../../templates/app/app-menu.html" ],

    function( $, Backbone, AppMenuTemplate ) {

        var HomeView = Backbone.View.extend( {

            el: "#home-page", 

            initialize: function() {

                this.render();
            },

            render: function() {

                // Render side app menu
                this.$el.append( _.template(AppMenuTemplate, {} ) );
                this.$el.trigger('create');
            },
        } );

        return HomeView;
    } 
);
