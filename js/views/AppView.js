// App View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "views/SearchPageView", 
         "views/ObjectView",
         "text!../../templates/app/recent-element-item.html" ],

    function( $, Backbone, SearchPageView, ObjectView, RecentElementItemTemplate ) {

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
            },

            render: function() {

                var ul = this.$el.find('#home-page div[data-role=content] ul');

                ul.empty();

                var cache = JSON.parse( localStorage['backboneCache'] );

                var cachedObjects = []; 

                for (var key in cache) {

                    splittedKey = key.split(":");

                    if (splittedKey[0] == "Object") {

                        cachedObjects.push( cache[key] );
                    }
                }

                cachedObjects.sort( function(a, b) {

                    keyA = a.lastAccessedOn;
                    keyB = b.lastAccessedOn;
                    if(keyA > keyB) return -1;
                    if(keyA < keyB) return 1;
                    return 0;
                } );

                _.each(cachedObjects, function(object) {

                    template = _.template( RecentElementItemTemplate, { 'object': object.value.fields.name.data } );

                    ul.append(template);
                } );

                ul.listview('refresh');
            },
        } );

        return AppView;
    } 
);
