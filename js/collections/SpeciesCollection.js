// Species Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone" ], 
    function( $, Backbone ) {

        // Extends Backbone.Router
        var SpeciesCollection = Backbone.Collection.extend( {

            // Define the URL for search
            url: function() {

                return WBMobile.defaults.BASE_URL + "/rest/config/sections/species_list?content-type=application/json"
            },

            // For caching purposes
            getCacheKey: function() {

                return "SpeciesList";
            },
        } );

        // Returns the Model class
        return SpeciesCollection;
    } 
);