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

                this.appView.render();

                // Programatically changes to the home page
                $.mobile.changePage( "#home-page" , { reverse: false, changeHash: false } );
            },

            gotoSearchPage: function() {

                this.appView.search();
            },

            search: function(className, query) {

                this.appView.search(className.toLowerCase(), query);
            },

            history: function() {

                this.appView.history();
            },

            object: function(className, id) {

                this.appView.gotoObject(className.toLowerCase(), id);
            },

            resources: function(type, query) {

                this.appView.browseResources(type, query);
            },

            species: function(genus, specie, className, query) {

                this.appView.browseSpecies(genus, specie, className, query);
            },
        } );

        // Returns the Router class
        return WormbaseRouter;

    } 
);