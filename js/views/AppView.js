// App View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "views/HomeView",
         "views/SearchPageView", 
         "views/ObjectView", 
         "views/BrowseResourcesView",
         "views/BrowseSpeciesView",
         "views/FilteredSearchView" ],

    function( $, Backbone, HomeView, SearchPageView, ObjectView, BrowseResourcesView, BrowseSpeciesView, FilteredSearchView ) {

        var AppView = Backbone.View.extend( {

            el: "body", 

            initialize: function() {

                var self = this;

                this.homeView = new HomeView();
                this.homeView.parent = this;

                this.browseSpeciesView = new BrowseSpeciesView();
                this.browseSpeciesView.parent = this;

                this.browseResourcesView = new BrowseResourcesView();
                this.browseResourcesView.parent = this;

                this.filteredView = new FilteredSearchView();
                this.filteredView.parent = this;

                this.options = {

                    cache: true,
                    expires: false,

                    reset: true,

                    success: function() {

                        $.mobile.loader('hide');
                        $.mobile.changePage( self.browseSpeciesView.$el.selector, { changeHash: false, allowSamePageTransition: true } );
                    },

                    error: function() {
                        alert('error');
                    },
                };
            },

            // calling this method without arguments will bring the user to the search page
            search: function(className, query) {

                if (this.searchPageView == undefined) {

                    this.searchPageView = new SearchPageView(); 
                    this.searchPageView.parent = this;
                }

                else if (className == undefined || query == undefined) 
                    $.mobile.changePage(this.searchPageView.$el.selector, { reverse: false, changeHash: false } );

                if (className != undefined && query != undefined)

                    this.searchPageView.newSearch(className, query);
            },

            gotoObject: function(className, id) {

                if (this.objectView == undefined) {

                    this.objectView = new ObjectView();
                    this.objectView.parent = this;
                }

                this.objectView.model.set( {className: className, id: id} );

                $.mobile.changePage(this.objectView.$el.selector, { reverse: false, changeHash: false } );
            },

            browseResources: function(type, query) {

                $.mobile.loader('show');

                if ( type == null )
                    this.browseResourcesView.collection.fetch( this.options );
                else if ( query == null )
                    this.filteredView.newSearch( type, 'all', '*');
                else 
                    this.filteredView.newSearch( type, 'all', query);
            },

            browseSpecies: function(genus, specie, className, query) {

                $.mobile.loader('show');

                if ( genus == null )
                    this.browseSpeciesView.fetchGenusList( this.options );
                else if ( specie == null )
                    this.browseSpeciesView.fetchSpeciesList( genus, this.options );
                else if ( className == null )
                    this.browseSpeciesView.fetchAvailableClassesList( specie, this.options );
                else if ( query == null )
                    this.filteredView.newSearch( className, specie, '*' );
                else 
                    this.filteredView.newSearch( className, specie, query);
            },
        } );

        return AppView;
    } 
);
