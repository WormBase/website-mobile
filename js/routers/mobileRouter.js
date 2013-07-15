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

                // Instantiates a new App View
                this.appView = new AppView();
                this.appView.parent = this;

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();
            },

            // Backbone.js Routes
            routes: {

                "":                             "home",

                "home":                         "home",

                "search":                       "gotoSearchPage",

                "search/:className/:query":     "search",

                "object/:className/:id":        "object"
            },

            // Home method
            home: function() {

                // Programatically changes to the home page
                $.mobile.changePage( "#home" , { reverse: false, changeHash: false } );
            },

            gotoSearchPage: function() {

                this.appView.search();
            },

            search: function(className, query) {

                this.appView.search(className.toLowerCase(), query);
            },

            object: function(className, id) {

                this.appView.gotoObject(className.toLowerCase(), id);
            }

        } );

        // Returns the Router class
        return WormbaseRouter;

    } 
);