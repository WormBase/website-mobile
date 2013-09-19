// Mobile Router
// =============

// Includes file dependencies
define([ "jquery","backbone", "../views/AppView" ], 

    function( $, Backbone, AppView ) {

        // Extends Backbone.Router
        var WormbaseRouter = Backbone.Router.extend( {

            // The Router constructor
            initialize: function() {

                // Base url for APIs
                window.BASE_URL = "http://staging.wormbase.org";

                window.WEBSITE_URL = "http://www.wormbase.org";

                // Instantiates a new App View
                WBMobile.views.appView = new AppView();

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();
            },

            // Backbone.js Routes
            routes: {

                "":                                          "home",

                "home":                                      "home",

                "history":                                   "history",

                "search":                                    "gotoSearchPage",

                "search/:className/:query":                  "search",

                "object/:className/:id":                     "object",

                "resources(/:type)(/:query)(/)":             "resources",

                "species(/:genus)(/:specie)(/:className)(/:query)(/)":   "species",

            },

            // Home method
            home: function() {

                WBMobile.views.appView.home();

                // Programatically changes to the home page
                $.mobile.changePage( "#home-page" , { reverse: false, changeHash: false } );
            },

            gotoSearchPage: function() {

                WBMobile.views.appView.search();
            },

            search: function(className, query) {

                WBMobile.views.appView.search(className.toLowerCase(), query);
            },

            history: function() {

                WBMobile.views.appView.history();
            },

            object: function(className, id) {

                WBMobile.views.appView.gotoObject(className.toLowerCase(), id);
            },

            resources: function(type, query) {

                WBMobile.views.appView.browseResources(type, query);
            },

            species: function(genus, specie, className, query) {

                WBMobile.views.appView.browseSpecies(genus, specie, className, query);
            },
        } );

        // Returns the Router class
        return WormbaseRouter;

    } 
);