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
                var $panel = this.$el.find('#menu-panel');
                $panel.html(_.template(AppMenuTemplate));

                if ( $panel.hasClass('ui-panel') )
                    $panel.trigger('create');
            },
        } );

        return HomeView;
    } 
);
