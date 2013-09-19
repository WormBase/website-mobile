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
         "views/FilteredSearchView",
         "views/HistoryView",
         "views/AboutView" ],

    function( $, 
              Backbone, 
              HomeView, 
              SearchPageView, 
              ObjectView, 
              BrowseResourcesView, 
              BrowseSpeciesView, 
              FilteredSearchView, 
              HistoryView, 
              AboutView ) {

        var AppView = Backbone.View.extend( {

            el: "body", 

            initialize: function() {

                $.mobile.loader('show');

                this.options = {

                    cache: true,
                    expires: false,

                    reset: true,

                    success: function() {

                        $.mobile.loader('hide');
                        $.mobile.changePage( "#browsing-page", { changeHash: false, reverse: false } );
                    },

                    error: function() {
                        alert('error');
                    },
                };

                // Menu panel swipe to open
                this.$el.on('swiperight', function(event) {
                    $(event.target).parents('div[data-role=page]').find('#menu-panel').panel('open');
                } );
                this.$el.on('swipeleft', function() { 
                    $(event.target).parents('div[data-role=page]').find('#menu-panel').panel('close');
                } );
            },

            home: function() {

                WBMobile.views.home = WBMobile.views.home || new HomeView();

                $.mobile.changePage( WBMobile.views.home.$el.selector, { changeHash: false } );
            },

            // calling this method without arguments will bring the user to the search page
            search: function(className, query) {

                WBMobile.views.searchPage = WBMobile.views.searchPage || new SearchPageView();

                if (className == undefined || query == undefined) 
                    $.mobile.changePage( WBMobile.views.searchPage.$el.selector, { reverse: false, changeHash: false } );
                else 
                    WBMobile.views.searchPage.newSearch(className, query);
            },

            gotoObject: function(className, id) {

                WBMobile.views.object = WBMobile.views.object || new ObjectView();

                WBMobile.views.object.model.set( {className: className, id: id} );

                $.mobile.changePage( WBMobile.views.object.$el.selector, { reverse: false, changeHash: false } );
            },

            browseResources: function(type, query) {

                WBMobile.views.filter = WBMobile.views.filter || new FilteredSearchView();

                WBMobile.views.browseResources = WBMobile.views.browseResources || new BrowseResourcesView();

                if ( type == null )
                    WBMobile.views.browseResources.collection.fetch( this.options );
                else if ( query == null )
                    WBMobile.views.filter.newSearch( type, 'all', '*');
                else 
                    WBMobile.views.filter.newSearch( type, 'all', query);
            },

            browseSpecies: function(genus, specie, className, query) {

                WBMobile.views.filter = WBMobile.views.filter || new FilteredSearchView();

                WBMobile.views.browseSpecies = WBMobile.views.browseSpecies || new BrowseSpeciesView();

                if ( genus == null )
                    WBMobile.views.browseSpecies.fetchGenusList( this.options );
                else if ( specie == null )
                    WBMobile.views.browseSpecies.fetchSpeciesList( genus, this.options );
                else if ( className == null )
                    WBMobile.views.browseSpecies.fetchAvailableClassesList( specie, this.options );
                else if ( query == null )
                    WBMobile.views.filter.newSearch( className, specie, '*' );
                else 
                    WBMobile.views.filter.newSearch( className, specie, query);
            },

            history: function() {

                WBMobile.views.history = WBMobile.views.history || new HistoryView();

                $.mobile.changePage( WBMobile.views.history.$el.selector, { reverse: false, changeHash: false } );
            },

            about: function() {

                WBMobile.views.about = WBMobile.views.about || new AboutView();

                $.mobile.changePage( WBMobile.views.about.$el.selector, { changeHash: false })
            },
        } );

        return AppView;
    } 
);
