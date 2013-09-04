// Recents View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "text!../../templates/app/app-menu.html", 
         "text!../../templates/app/recent-element-item.html" ],

    function( $, Backbone, AppMenuTemplate, RecentElementItemTemplate ) {

        var RecentsView = Backbone.View.extend( {

            el: "#recents-page", 

            initialize: function() {

                this.render();
            },

            render: function() {

                // Render side app menu
                var $panel = this.$el.find('#menu-panel');
                $panel.html(_.template(AppMenuTemplate));

                if ( $panel.hasClass('ui-panel') )
                    $panel.trigger('create');

                // Populate the home screen with recents list
                var $ul = this.$el.find('div[data-role=content] ul');

                $ul.empty();

                try {
                    var cache = JSON.parse( localStorage['backboneCache'] );
                } 
                catch (e) {
                    var cache = {};
                }

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

                    $ul.append(template);
                } );

                //$ul.listview('refresh');

            },
        } );

        return RecentsView;
    } 
);
