// Search Page View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "collections/SearchTypesCollection", 
         "views/SearchResultsView",
         "text!../../templates/app/app-menu.html", 
         "text!../../templates/app/search-type-option.html" ],

    function( $, Backbone, SearchTypesCollection, SearchResultsView, AppMenuTemplate, SearchTypeOptionTemplate ) {

        var SearchPageView = Backbone.View.extend( {

            initialize: function() {

                // Initialize the collection for this view (it represents the options in the search dropdown menu)
                this.collection = new SearchTypesCollection();

                // Make this view to render when the collection reset event gets triggered
                this.collection.on('reset', this.render, this);

                // Show the jQM loading icon
                $.mobile.loading("show");

                var self = this;

                // Fetch the data from the server
                this.collection.fetch( {

                        cache: true,
                        expires: false,

                        // Explicitly trigger the collection reset event
                        reset: true,

                        // On success
                        success: function() {
                        
                            // Go to the search page
                            $.mobile.changePage( self.$el.selector , { reverse: false, changeHash: false } );
                        },

                        // On error
                        error: function() {
                        
                            alert('error while initializing the search form');
                        }
                } );
                
                // Initialize the view for the search results list
                this.searchResultsView = new SearchResultsView( { el: "#search-result-list" } );
                this.searchResultsView.parent = this;


                // Render side app menu
                this.$el.append( _.template(AppMenuTemplate, {} ) );

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

                // Render dropdown menu
                var dropdownMenu = this.$el.find('#search-dropdown');

                _.each(this.collection.models, function(model) {

                    template = _.template( SearchTypeOptionTemplate, { "model": model } );

                    dropdownMenu.append(template);
                } );
                    
                // Let jQM refresh the dropdown
                dropdownMenu.selectmenu().selectmenu('refresh');
            },

            newSearch: function(className, query) {

                // Keep search form consistent
                this.$el.find('input[name=search]').val(query);
                
                this.$el.find('#search-dropdown option').filter( function() {
                    
                    return this.id == className;
                } ).prop('selected', true)
                   .parent().selectmenu('refresh');

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
