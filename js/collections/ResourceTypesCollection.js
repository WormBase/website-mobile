// Resource Types Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone" ], 
    function( $, Backbone ) {

        // Extends Backbone.Router
        var ResourceTypesCollection = Backbone.Collection.extend( {

            // Overriding the Backbone.parse method
            parse: function(response) {

                // we need to convert from JSON to array
                var array = [];
                for (var typeName in response.data) {
                    response.data[typeName].name = typeName;
                    array.push(response.data[typeName]);
                }
                
                return array;
            }, 

            // Define the URL for search
            url: function() {

                return window.BASE_URL + "/rest/config/sections/resources?content-type=application/json"
            },

            // For caching purposes
            getCacheKey: function() {

                return "ResourceTypes";
            },
        } );

        // Returns the Model class
        return ResourceTypesCollection;
    } 
);