// Search Result Entry View
// =========================

// Includes file dependencies
define([ "jquery", "backbone","models/SearchResultEntryModel" ], 
    function( $, Backbone, SearchResultEntryModel ) {

        var SearchResultEntryView = Backbone.View.extend( {

            events: {

                "vclick": "viewObject",

            },

            viewObject: function() {    

                // Redirect to the object page -- sorry, not a very good implementation
                this.parent.parent.parent.gotoObject(this.model.get('name').class, this.model.get('name').id);
            },

            // Renders a list item 
            render: function() {

                var self = this;

                require( ["text!../templates/app/search-result-entry.html"], function(entryTemplate) {

                    // Sets the view's template property
                    template = _.template( entryTemplate, { "object": self.model } );

                    // Renders the view's template inside of the current listview element
                    self.el.innerHTML = template;
                    
                } );

                // Maintains chainability
                return this;
            }
        } );

        return SearchResultEntryView;
    } 
);
