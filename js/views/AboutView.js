// About View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "text!../../templates/app/app-menu.html" ],

    function( $, Backbone, AppMenuTemplate ) {

        var AboutView = Backbone.View.extend( {

            el: "#about-page", 

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

        return AboutView;
    } 
);
