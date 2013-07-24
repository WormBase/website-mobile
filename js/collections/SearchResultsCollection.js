// Search Results Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/SearchResultEntryModel" ], 
    function( $, Backbone, SearchResultEntryModel ) {

        // Extends Backbone.Router
        var SearchResultsCollection = Backbone.Collection.extend( {

            // The Collection constructor
            initialize: function( models, options ) {

                // Sets the default instance properties
                this.className = "",
                this.query     = "", 
                this.page      = 1

            },

            // Sets the Collection model property to be a SearchResultEntryModel
            model: SearchResultEntryModel,

            // Overriding the Backbone.parse method
            parse: function(response) {

                // keep track of the total number of search results
                this.totalResults = response.count;

                return response.results;

            }, 

            // Define the URL for search
            url: function() {

                return  window.BASE_URL + "/search/" 
                        + this.className + "/" + this.query + "/" + this.page 
                        + "?content-type=application/json";

            }
            
        } );

        // Returns the Model class
        return SearchResultsCollection;

    } 
);