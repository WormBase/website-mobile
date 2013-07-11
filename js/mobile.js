// Sets the require.js configuration for the application.
require.config( {

      // 3rd party script alias names
      paths: {

            // Core Libraries
            "jquery":         "libs/jquery-1.10.1.min",
            "jquerymobile":   "libs/jquery.mobile-1.3.1.min",
            "underscore":     "libs/underscore-min",
            "backbone":       "libs/backbone-min",
            "text":           "libs/text"

      },

      // Sets the configuration for third party scripts that are not AMD compatible
      shim: {

            "backbone": {
                  "deps": [ "underscore", "jquery" ],
                  "exports": "Backbone"  //attaches "Backbone" to the window object
            }

      }, 

      // For development purposes , this prevents require.js from caching scripts
      urlArgs: "timestamp=" + (new Date()).getTime()

} );

// Includes File Dependencies
require([ "jquery", "backbone", "routers/mobileRouter" ], function( $, Backbone, MobileRouter ) {

    $( document ).on( "mobileinit",

        // Set up the "mobileinit" handler before requiring jQuery Mobile's module
        function() {

            // Prevents all anchor click handling including the addition of active button state and alternate link bluring.
            $.mobile.linkBindingEnabled = false;

            // Disabling this will prevent jQuery Mobile from handling hash changes
            $.mobile.hashListeningEnabled = false;
        }
    )


    require( [ "jquerymobile" ], function() {

            // set to true if server cannot handle HTTP PUT or HTTP DELETE
            Backbone.emulateHTTP = true;

            // set to true if server cannot handle application/json requests
            Backbone.emulateJSON = false;

        // Instantiates a new Backbone.js Mobile Router
        this.router = new MobileRouter();

    } );
} );