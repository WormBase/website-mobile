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

            // The View Constructor
            initialize: function() {

                // jQM initialization of the listview
                this.$el.trigger('create');

                // create an array of entry views to keep track of children
                this._entryViews = [];

                // Instantiate a Search Results Collection
                this.collection = new SearchResultsCollection();
                this.collection.parent = this;

                // bind this view to the add, remove and reset events of the collection
                this.collection.on('add', this.add, this);
                this.collection.on('remove', this.remove, this);
                this.collection.on('reset', this.reset, this);

                /// detect when new search terms are given on input
                this.listenTo(this.collection ,"change:searchTerms", this.newSearch);

            },

            el: "#search-result-list",

            // Add an entry to the view
            add: function(entry) {

                // Create a result entry view for each entry that is added 
                var entryView = new SearchResultEntryView({
                    tagName: 'li',
                    model: entry
                });

                entryView.parent = this;

                // add it to the collection
                this._entryViews.push(entryView);

                // If the view has been rendered, then we immediately append the rendered search result
                //if (this._rendered) {
                    this.$el.append(entryView.render().$el.html()).listview('refresh');
                    //this.$el.listview();
               // }
            },

            // Remove an entry from the view
            remove: function(entry) {
                
                var viewToRemove = _(this._entryViews).select(function(cv) { return cv.model === entry; })[0];

                this._entryViews = _(this._entryViews).without(viewToRemove);
     
                if (this._rendered) $(viewToRemove.el).remove();
            },

            // Resets this view (empty the search results list)
            reset: function() {

                this.$el.empty();

            },

            // Renders all of the models on the UI
            render: function() {
                
                // We keep track of the rendered state of the view
                this._rendered = true;
             
                $(this.el).empty();
             
                // Render each result entry View and append them.
                _(this._entryViews).each(function(entry) {
                  this.$el('ul').append(entry.render().el);
                });
             
                // Maintains chainability
                return this;
                
            },


            newSearch: function() {

                var self = this;

                // Empty the collection of results
                this.collection.reset();

                // Show the jQM loading icon
                $.mobile.loading("show");

                // Fetch results from server
                this.collection.fetch({

                    // This makes Backbone to trigger the 'add' event
                    add: true,

                    // On success, change page to the #search-page
                    success: function(result) {

                        $.mobile.loading("hide");

                        //$.mobile.changePage( "#search-page", { reverse: false, changeHash: false } ); 
                    },

                    // Log the errors
                    error: function(result) {
                        alert('error');
                    }
                });

            }


        } );

        // Returns the View class
        return SearchResultsView;

    } 
);