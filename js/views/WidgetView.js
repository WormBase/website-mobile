// Widget View
// =============

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "text!../../templates/app/widget-placeholder.html", 
         "text!../../templates/app/widget-container.html",
         "spin", 
         "jquerySpin" ], 

    function( $, Backbone, WidgetPlaceholderTemplate, WidgetContainerTemplate ) {

        // Extends Backbone.View
        var WidgetView = Backbone.View.extend( {

            initialize: function() {

                this.model.view = this;

                this.model.on("change:visible", this.toggleVisibility, this);
            },

            // Renders the placeholder for this widget
            render: function() {

                // render the template
                template = _.template( WidgetPlaceholderTemplate, { "widget": this.model } );

                // append/prepend list item to the parent view
                if (this.model.get('widgetName') == "overview") 
                    this.parent.$el.prepend(template);
                else 
                    this.parent.$el.append(template);

                // now that a placeholder has been placed, assign this view to that placeholder
                this.setElement( "#" + this.model.get('widgetName') );

                // Bind event to open popups after a click on a button
                this.$el.on('vmouseup', 'button', function() {

                    $("#" + this.id + "Popup").popup('open');
                } );

                WBMobile.views.object.$el.off('mouseenter', "[rel~=tooltip]")
                                      .on('mouseenter', '[rel~=tooltip]', 
                                        WBMobile.utils.tooltipCallback);

                // Maintains chainability
                return this;
            },

            toggleVisibility: function() {

                if (this.model.get('visible') == true)
                    this.show();
                else
                    this.hide();
            },

            show: function() {

                var self = this;

                // create the boxes for the widgets
                template = _.template(WidgetContainerTemplate, { "widget": this.model } );
                this.$el.html(template).trigger('create');

                var widgetBox = this.$el.find('.ui-collapsible-content');
                
                widgetBox.spin();

                var onErr = function(err) {

                    self.model.fetch( {

                        cache: true,
                        expires: false,

                        dataType:   "html",

                        // on success, put the html in the widget box
                        success:    function() {

                            html = self.model.get('html');

                            processedHtml = self.processWidget( html );

                            widgetBox.spin(false).html( processedHtml ).trigger('create');
                        },

                        // on error, put an error in the widget box
                        error:      function() {

                            widgetContent = "<p>Error while retrieving widget from the server</p>";

                            widgetBox.spin(false).html(widgetContent);
                        },
                    } );
                }

                // look for the template file for this widget
                require( ["text!../templates/classes/" + this.model.collection.parent.get('className') + "/" + this.model.get('widgetName') + ".html"], 

                    // on SUCCESS, fetch JSON and render the template
                    function(widgetTemplate) {

                        if (widgetTemplate != "") {
                            // could be done better 
                            url = self.model.url.split("=");
                            url[1] = "application/json";
                            self.model.url = url.join("=");
                            self.model.parse = function(response) {return response};

                            self.model.fetch( {

                                success: function() {

                                    if (self.model.get('widgetName') == "overview")
                                        $('#object-page div[data-role=header] h1')[0].innerHTML = self.model.get('fields').name.data.label;
                                    
                                    widgetContent = _.template(widgetTemplate, { "fields": self.model.get('fields') } );
                                    widgetBox.append(widgetContent).trigger('create');
                                },

                                error: function() {
                                    widgetContent = "<p>Error while retrieving widget from the server</p>";
                                    widgetBox.append(widgetContent);
                                },
                            } );

                            widgetContent = _.template(widgetTemplate, { "fields": self.model.get('fields') } );
                            widgetBox.append(widgetContent).trigger('create');
                        }
                        else
                            onErr();
                    },

                    // on ERROR, fetch the HTML template from the server
                    onErr

                );
            },

            hide: function() {

                this.$el.children("div").remove();
            },

            processWidget: function(html) {

                var self = this;

                // Create a jQuery object for the html string 
                var div = document.createElement('div');
                div.innerHTML = html;
                $dom = jQuery(div);

                // Delete all <script> tags in the dom
                $dom.find('script').remove();

                // Delete CytoscapeWeb components (they require flash)
                $dom.find('#cyto_legend').remove();
                $dom.find('#cytoscapeweb').remove();

                // Delete external sequence popup widgets -- might get implemented later
                $dom.find('.slink').remove();

                // Remove stars in references widget
                $dom.find('.load-star').remove();

                // Remove search count summary in References widget
                $dom.find('#search-count-summary').remove();

                // Remove sequence download (buttons and content)
                $dom.find('.sequence-download').remove();
                $dom.find('.generate-file-download').remove();

                //  Strain -> natural isolates, remove google map (possible to implement later)
                $dom.find('#google-map-inline').remove();

                // Remove BLAST details popup
                $dom.find('#blast-details').remove();

                // Fix URLs
                this.fixLinks($dom);

                // Add tooltips to all span elements with a "title" attribute
                $dom.find('span').each( function() {

                    if ( this.title != "" )
                        $(this).attr('rel', 'tooltip');
                } );

                // Reduce font size of some elements
                $dom.find('#fade').each( function() {
                    if ( $(this).css('font-size') == "0.7em" )
                        $(this).css('font-size', '0.6em');
                } );

                // .toggle/.returned elements 
                $dom.find('.toggle').next().css('display', 'none');
                $dom.find('.toggle span').addClass('ui-icon-arrow-r')
                // Bind .toggle to display .returned
                this.$el.on('vmouseup', '.toggle', function() {
                    
                    // Assuming next element is always the .returned
                    $(this).next().toggle();

                    if ( $(this).find('span').hasClass('ui-icon-arrow-r') ) 
                        $(this).find('span').removeClass('ui-icon-arrow-r').addClass('ui-icon-arrow-d');                        
                    else 
                        $(this).find('span').removeClass('ui-icon-arrow-d').addClass('ui-icon-arrow-r');
                } );

                // Fix evidence .ev-more
                $dom.find('.ev-more').each( function() {

                    $(this).prev().css('display', 'none');
                    
                    $(this).find('.ui-icon').addClass('ui-icon-arrow-d');
                } );
                this.$el.on('vmouseup', '.ev-more', function() {
                    
                    $(this).prev().toggle();

                    if ( $(this).find('.ui-icon').hasClass('ui-icon-arrow-d') )
                        $(this).find('.ui-icon').removeClass('ui-icon-arrow-d').addClass('ui-icon-arrow-u');
                    else
                        $(this).find('.ui-icon').removeClass('ui-icon-arrow-u').addClass('ui-icon-arrow-d');
                } );

                // Make .detail-box responsive
                $dom.find('.detail-box').each( function() {

                    if ( $(this).find('.field').length > 2) {

                        // necessary to link button/popup
                        var randId = Math.floor(Math.random() * 1000);

                        // Create button
                        $(this).before('<a class="detail-box-button" id="'+randId+'" data-mini="true" data-role="button">Details</a>');

                        // Create popup
                        $(this).clone().insertBefore(this);
                        $(this).prev().attr('data-role', 'popup')
                                      .attr('id', randId+'Popup')
                                      .toggle();

                        // bind click event
                        self.$el.on('vmouseup', '#'+randId, function() {
                            $('#'+randId+'Popup').popup('open');
                        });
                    }
                    else {
                        $(this).addClass('detail-box-small');
                    }
                } );

                // Fix "Read more"
                $dom.find('.text-min').each( function() {

                    $(this).wrapInner('<div class="text-min-expand" />')
                           .append('<div class="more"> <div class="ui-icon ui-icon-arrow-d" style="margin-top: 0.2em"> </div> </div>');
                } );
                this.$el.on('vmouseup', '.more', function() {

                    $(this).prev().toggleClass("text-min-expand");

                    if ( $(this).find('.ui-icon').hasClass('ui-icon-arrow-d') )
                        $(this).find('.ui-icon').removeClass('ui-icon-arrow-d').addClass('ui-icon-arrow-u');
                    else
                        $(this).find('.ui-icon').removeClass('ui-icon-arrow-u').addClass('ui-icon-arrow-d');
                } );

                // Fix "load results" on references widget
                $dom.find('.load-results').each( function() {

                    var url = $(this).attr('href').split('/');

                    $(this).before('<a href="#search/' + url[2] + '/' + url[3] + '" data-role="button" data-mini="true">See more results</a>');
                } ). remove();

                // Make tables responsive
                $dom.find('table').each( function() {

                    $(this).attr("data-role", "table")
                           .addClass("table-stroke")
                           .find('thead tr').addClass("ui-bar-d");

                    var noOfColumns = $(this).find('thead tr th').length;

                    if ( noOfColumns <= 3 )
                        $(this).addClass('table-3');
                    else if (noOfColumns >= 8)
                        $(this).addClass('table-8');
                    else
                        $(this).addClass('table-' + noOfColumns);

                    $(this).find('thead tr').prepend('<th></th>');

                    var toggleTextElement;
                    switch (this.id) {
                        
                        case "table_natural_isolates_by":   toggleTextElement = 2;
                                                            break;

                        case "table_motif_details_by":      toggleTextElement = 2;
                                                            break;
                        default:                            toggleTextElement = 1;
                                                            break;
                    }

                    if ( this.id == "table_natural_isolates_by" ) 
                        toggleTextElement = 2;
                    else 
                        toggleTextElement = 1;
                    
                    $(this).find('tbody tr').each( function() {

                        toggleText = $(this).find('td:nth-child('+ toggleTextElement +')').text();

                        $(this).addClass("returned")
                               .prepend('<td></td>')
                               .before('<tr class="toggle"><td><span style="float:left" class="ui-icon ui-icon-arrow-r"></span>' 
                                        + toggleText
                                        + '</td></tr>');
                    } );


                } );

                // Displaying sequences - remove breaks, use css instead
                $dom.find('.sequence-container br:not(:first)').remove();
                
                // Remove css prop "white-space: nowrap on some elements" 
                $dom.find('div').filter( function() {
                    return this.style.whiteSpace == 'nowrap'
                } ).css('white-space', '');

                return $dom.html();
            },


            fixLinks: function($dom) {

                // Fix links
                $dom.find('a').each( function() {

                    // delete the host part of the url
                    link = this.href.replace( window.location.origin + "/", "" );

                    // check whether the url refers to an internal or external resource
                    if (link.indexOf("http://") == -1 && link.indexOf("https://") == -1) { 
                        // internal - modify url accordingly

                        var urlComponents = link.split("/");

                        var action = null,
                            className = null, 
                            object = null;

                        if (urlComponents[0] == "species" || urlComponents[0] == "resources" ) {

                            action = "#object/";
                                               
                            if (urlComponents.length == 3) {
                           
                                className = urlComponents[1];
                                object = urlComponents[2];
                            }
                            else if (urlComponents.length == 4) {

                                className = urlComponents[2];
                                object = urlComponents[3];
                            }
                        }
                        else if (urlComponents[0] == "search") {

                            action = "#search/";
                            className = urlComponents[1];
                            object = urlComponents[2];
                        } 

                        if (object !== null) {

                            this.href = window.location.origin + window.location.pathname 
                                      + action + className + "/" + object;
                        }
                        else {

                            // for all unsupported urls - open the desktop website
                            this.href = this.href.replace( window.location.origin, WBMobile.defaults.WEBSITE_URL );   
                            this.target = "_system"; 
                        }
                    }
                    else {
                        // external
                        // modify "a" tag to indicate that it's an external resource
                        this.target = "_system";
                    }
                } );

                // Fix URLs for images
                $dom.find('img').each( function() {

                    this.src = this.src.replace( window.location.origin, WBMobile.defaults.WEBSITE_URL );
                } );

                return $dom;
            },

        } );

        // Returns the View class
        return WidgetView;

    } 
);