// Filtered Search View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "collections/SearchTypesCollection", 
         "views/SearchResultsView",
         "text!../../templates/app/app-menu.html", 
         "text!../../templates/app/search-type-option.html" ],

    function( $, Backbone, SearchTypesCollection, SearchResultsView, AppMenuTemplate, SearchTypeOptionTemplate ) {

        var FilteredSearchView = Backbone.View.extend( {

            initialize: function() {

                var self = this;
                
                // Initialize the view for the search results list
                this.searchResultsView = new SearchResultsView( { el: "#search-result-list" } );
                this.searchResultsView.parent = this;

                // Render side app menu
                this.$el.append( _.template(AppMenuTemplate, {} ) );

            },

            // Defines the HTML element for this view
            el: "#filter-page",

            events: {
                
                "change #filter-search":       "updateSearchQuery",
            },

            updateSearchQuery: function() {

                // Get the new parameters from the search form
                var newQuery = this.$el.find("#filter-search").val();

                newHash = window.location.hash.split('/');

                if (newHash[0] == "#species")
                    if (newHash.length == 4)
                        newHash.push(newQuery);
                    else 
                        newHash[4] = newQuery;

                else if (newHash[0] == "#resources")

                    if (newHash.length == 2)
                        newHash.push(newQuery);
                    else
                        newHash[2] = newQuery;

                // Redirect to the URL that corresponds to the search with new params 
                window.location.hash = newHash.join('/');
            },

            newSearch: function(className, specie , query, options) {

                // Keep search form consistent
                this.$el.find('input[name=search]').val(query);

                this.searchResultsView.collection.className = className; 
                this.searchResultsView.collection.query = query;
                this.searchResultsView.collection.specie = specie

                // trigger an event to make the view update
                this.searchResultsView.collection.trigger('change:searchTerms');
            }

        } );

    return FilteredSearchView;

    } 
);
