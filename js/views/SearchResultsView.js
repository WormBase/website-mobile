// Search Results View
// =============

// Includes file dependencies
define([ "jquery", 
         "backbone",
         "collections/SearchResultsCollection", 
         "views/SearchResultEntryView" ], 

    function( $, Backbone, SearchResultsCollection, SearchResultEntryView ) {

        // Extends Backbone.View
        var SearchResultsView = Backbone.View.extend( {

            // Set DOM element corresponding to this view
            el: "#search-result-list",

            // The View Constructor
            initialize: function() {

                // jQM initialization of the listview
                this.$el.trigger('create');

                // create an array of entry views to keep track of children (useful in case of remove)
                this._entryViews = [];

                // Instantiate a Search Results Collection
                this.collection = new SearchResultsCollection();
                this.collection.parent = this;

                // bind this view to the add, remove and reset events of the collection
                this.collection.on('add', this.add, this);
                this.collection.on('reset', this.render, this);

                /// detect when new search terms are given on input
                this.listenTo(this.collection ,"change:searchTerms", this.newSearch);

            },

            // reset this view (empty the search results list)
            render: function() {

                this.$el.empty();
            },

            // Bind DOM events
            events: {

                "vclick #load-more": "loadMore"
            },

            // Load and display the next page of results
            loadMore: function() {

                // Remove the "Load More" item from the listview
                this.$el.find("#load-more").remove();

                // Update page to fetch 
                this.collection.page++;

                // Fetch results
                this.fetchResults();

            },

            // Initiate a new search
            newSearch: function() {

                // Empty the collection 
                this.collection.reset();

                // Reset page to 1
                this.collection.page = 1;

                // Fetch results
                this.fetchResults();
            },

            // Fetch results, triggers 'add' event
            fetchResults: function() {

                var self = this;

                // Show the jQM loading icon
                $.mobile.loading("show");

                // Fetch results from server
                this.collection.fetch( {

                    // this makes Backbone to trigger the 'add' event
                    add: true,

                    // this prevents the collection from deleting all the old values
                    remove: false,

                    // On success, change page to the #search-page
                    success: function(updatedCollection) {

                        // If more results could be displayed, show a "load more" button
                        if (updatedCollection.totalResults > updatedCollection.page * 10) {
                            
                            self.$el.append('<li id="load-more"><a>Load more results</a></li>');
                        }

                        // JQM re-enhance the listview 
                        self.$el.listview('refresh');

                        $.mobile.loading("hide");

                        $.mobile.changePage(self.$el.selector, { changeHash: false } );
                    },

                    // Log the errors
                    error: function() {
                        alert('Error retrieving search results');
                    }
                } );
            },

            // Add an entry to the view
            add: function(entry) {

                // Create a result entry view for each entry that is added 
                var entryView = new SearchResultEntryView( { model: entry } );

                entryView.parent = this;

                // add it to the collection
                this._entryViews.push(entryView);

                // append the result to the view
                this.$el.append( entryView.render().$el.html() );
            },
        } );

        // Returns the View class
        return SearchResultsView;
    } 
);