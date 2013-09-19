
define( ['backbone', 'utils'], function( Backbone, utils ) {
           
    $(function(){

        window.WBMobile = window.WBMobile || {

            views: {
                // here we keep a reference of views objects we initialize only if the view represents a page
                // except for AppView
            },

            routers:{

            },

            utils: utils,

            defaults: {
                BASE_URL:       "http://staging.wormbase.org",
                WEBSITE_URL:    "http://www.wormbase.org",
            }
        }
    });
} );
