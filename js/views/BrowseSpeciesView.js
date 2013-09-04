// Browse Species View
// =============

// Includes file dependencies
define([ "jquery", 
         "backbone",
         "text!../../templates/app/app-menu.html",
         "collections/SpeciesCollection", 
         "pluralize" ], 

    function( $, Backbone, AppMenuTemplate, SpeciesCollection, owl ) {

        // Extends Backbone.View
        var BrowseSpeciesView = Backbone.View.extend( {

            // The View Constructor
            initialize: function() {

                this.collection = new SpeciesCollection();
                this.collection.parent = this;

                this.collection.on("reset", this.render, this);
            },

            el: "#browsing-page",

            fetchGenusList: function(options) {

                this.collection.parse = function(response) {

                    // we need to convert from JSON to array
                    var genusArray = [];
                    for (var specieName in response.data) {

                        genus = response.data[specieName].genus;

                        if ( genus && genusArray.indexOf( genus ) < 0 )
                            genusArray.push( genus );
                    }

                    var array = [];
                    for (var index in genusArray) {
                        array.push( { 'title': genusArray[index], 'name': genusArray[index] } );
                    }

                    return array;
                }

                this.collection.fetch( options );
            },

            fetchSpeciesList: function(genus, options) {

                this.collection.parse = function(response) {

                    var array = [];
                    
                    for (var specieName in response.data) {

                        specie = response.data[specieName];
                        
                        if (genus == specie.genus) {
                            specie.name = specieName;
                            array.push( specie );
                        }
                    }

                    return array;
                }

                this.collection.fetch( options );
            },

            fetchAvailableClassesList: function(specie, options) {

                this.collection.parse = function(response) {

                    var array = [];

                    var availableClasses = response.data[specie].available_classes.class;

                    for (className in availableClasses )
                        array.push( { 'name': availableClasses[className], 'title': owl.pluralize( availableClasses[className] ) } );

                    return array;
                }

                this.collection.fetch( options ); 
            },

            render: function() {

                // Render side app menu
                var $panel = this.$el.find('#menu-panel');
                $panel.html(_.template(AppMenuTemplate));

                if ( $panel.hasClass('ui-panel') )
                    $panel.trigger('create');

                // Render species list
                var $ul = this.$el.find('div[data-role=content] ul');

                $ul.empty();

                this.collection.each( function(model) {
                    $ul.append('<li><a href="'+ window.location.hash +'/' + model.get('name') + '">' + model.get('title') + '</a></li>');
                });

                if ( $ul.hasClass('ui-listview') )
                    $ul.listview('refresh');
                else
                    $ul.trigger('create');

                return this;
            },
        } );

        // Returns the View class
        return BrowseSpeciesView;

    } 
);