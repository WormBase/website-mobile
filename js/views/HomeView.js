// Home View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "text!../../templates/app/app-menu.html", 
         "text!../../templates/app/recent-element-item.html" ],

    function( $, Backbone, AppMenuTemplate, RecentElementItemTemplate ) {

        var HomeView = Backbone.View.extend( {

            el: "#home-page", 

            initialize: function() {

                this.render();
            },

            render: function() {

                // Render side app menu
                this.$el.append( _.template(AppMenuTemplate, {} ) );
                this.$el.trigger('create');

                // Populate the home screen with recents list
                var ul = this.$el.find('div[data-role=content] ul');

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

        return HomeView;
    } 
);
