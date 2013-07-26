// Search Types Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone" ], 
    function( $, Backbone ) {

        // Extends Backbone.Router
        var SearchTypesCollection = Backbone.Collection.extend( {

            // Overriding the Backbone.parse method
            parse: function(response) {

                return response.data.option;
            }, 

            // Define the URL for search
            url: function() {

                return window.BASE_URL + "/rest/config/search_dropdown?content-type=application/json"
            },

            // For caching purposes
            getCacheKey: function() {

                return "SearchDropdown";
            },
        } );

        // Returns the Model class
        return SearchTypesCollection;
    } 
);