// App View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "views/SearchPageView", 
         "views/ObjectView" ],

    function( $, Backbone, SearchPageView, ObjectView ) {

        var AppView = Backbone.View.extend( {

            el: "body", 

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
            }

        } );

        return AppView;
    } 
);
