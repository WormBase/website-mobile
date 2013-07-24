// Search Result Entry View
// =========================

// Includes file dependencies
define([ "jquery", 
         "backbone","models/SearchResultEntryModel",
         "text!../../templates/app/search-result-entry.html" ], 
    function( $, Backbone, SearchResultEntryModel, EntryTemplate ) {

        var SearchResultEntryView = Backbone.View.extend( {

            // Renders a list item 
            render: function() {

                // Sets the view's template property
                template = _.template( EntryTemplate, { "object": this.model } );

                // Renders the view's template inside of the current listview element
                this.$el.html(template);
                    
                // Maintains chainability
                return this;
            }
        } );

        return SearchResultEntryView;
    } 
);
