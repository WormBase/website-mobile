// Search Page View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "collections/SearchTypesCollection", 
         "views/SearchResultsView" ],

    function( $, Backbone, SearchTypesCollection, SearchResultsView ) {

        var SearchPageView = Backbone.View.extend( {

            initialize: function() {

                // Initialize the collection for this view (it represents the options in the search dropdown menu)
                this.collection = new SearchTypesCollection();

                // Make this view to render when the collection reset event gets triggered
                this.collection.on('reset', this.render, this);

                // Show the jQM loading icon
                $.mobile.loading("show");

                // Fetch the data from the server
                this.collection.fetch( {

                        // Explicitly trigger the collection reset event
                        reset: true,

                        // On success
                        success: function() {
                        
                            // Go to the search page
                            $.mobile.changePage( "#search-page", { reverse: false, changeHash: false } );
                        
                        },

                        // On error
                        error: function() {
                        
                            alert('error while initializing the search form');
                        
                        }
                } );
                
                // Initialize the view for the search results list
                this.searchResultsView = new SearchResultsView( { el: "#search-result-list" } );
                this.searchResultsView.parent = this;

            },

            // Defines the HTML element for this view
            el: "#search-page",

            events: {

                "change input[name=search]":   "updateSearchParams",

                "change #search-dropdown":     "updateSearchParams"
            },

            updateSearchParams: function() {

                // Get the new parameters from the search form
                var newClassName = this.$el.find("#search-dropdown :selected")[0].id;
                var newQuery = this.$el.find("input[name=search]").val();

                // Redirect to the URL that corresponds to the search with new params 
                window.location.hash = "search/" + newClassName + "/" + newQuery;
                
            },

            render: function() {
                
                var self = this;

                require( ["text!../templates/app/search-type-option.html"], function(SearchTypeOption) { 

                    _.each(self.collection.models, function(model) {

                        template = _.template( SearchTypeOption, { "model": model } );

                        self.$el.find('#search-dropdown').append(template);
                    } );
                    
                    // Let jQM refresh the dropdown
                    self.$el.find('#search-dropdown').selectmenu().selectmenu('refresh');
                }); 
            },

            newSearch: function(className, query) {

                // Assign new className and query string to the collection object
                this.searchResultsView.collection.className = className;
                this.searchResultsView.collection.query = query;

                // trigger an event to make the view update
                this.searchResultsView.collection.trigger('change:searchTerms');
            }

        } );

    return SearchPageView;

    } 
);
