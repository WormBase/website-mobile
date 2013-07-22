// Widget View
// =============

// Includes file dependencies
define([ "jquery", 
         "backbone", 
         "text!../../templates/app/widget-placeholder.html", 
         "text!../../templates/app/widget-container.html" ], 

    function( $, Backbone, WidgetPlaceholderTemplate, WidgetContainerTemplate ) {

        // Extends Backbone.View
        var WidgetView = Backbone.View.extend( {

            initialize: function() {

                this.model.view = this;

                this.model.on("change:visible", this.toggleVisibility, this);

            },

            // Renders the placeholder for this widget
            render: function() {

                var self = this;

                // render the template
                template = _.template( WidgetPlaceholderTemplate, { "widget": self.model } );

                // append/prepend list item to the parent view
                if (self.model.get('widgetName') == "overview") 
                    self.parent.$el.prepend(template);
                else 
                    self.parent.$el.append(template);

                // now that a placeholder has been placed, assign this view to that placeholder
                self.setElement( "#" + self.model.get('widgetName') );

                // Bind event to open popups after a click on a button
                self.$el.on('vclick', 'button', function() {

                    $("#" + this.id + "Popup").popup('open');
                } );

                this.parent.parent.$el.off().on('mouseenter', '[rel~=tooltip]', function() {

                    target  = $( this );
                    tip     = target.attr( 'title' );
                    tooltip = $( '<div id="tooltip"></div>' );
             
                    if( !tip || tip == '' )
                        return false;
             
                    target.removeAttr( 'title' );
                    tooltip.css( 'opacity', 0 )
                           .html( tip )
                           .appendTo( 'body' );

                    var init_tooltip = function()
                    {
                        if( $( window ).width() < tooltip.outerWidth() * 1.5 )
                            tooltip.css( 'max-width', $( window ).width() / 2 );
                        else
                            tooltip.css( 'max-width', 340 );
             
                        var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                            pos_top  = target.offset().top - tooltip.outerHeight() - 20;
             
                        if( pos_left < 0 )
                        {
                            pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                            tooltip.addClass( 'left' );
                        }
                        else
                            tooltip.removeClass( 'left' );
             
                        if( pos_left + tooltip.outerWidth() > $( window ).width() )
                        {
                            pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                            tooltip.addClass( 'right' );
                        }
                        else
                            tooltip.removeClass( 'right' );
             
                        if( pos_top < 0 )
                        {
                            var pos_top  = target.offset().top + target.outerHeight();
                            tooltip.addClass( 'top' );
                        }
                        else
                            tooltip.removeClass( 'top' );
             
                        tooltip.css( { left: pos_left, top: pos_top } )
                               .animate( { top: '+=10', opacity: 1 }, 50 );
                    };
             
                    init_tooltip();
                    $( window ).resize( init_tooltip );
             
                    var remove_tooltip = function()
                    {
                        tooltip.animate( { top: '-=10', opacity: 0 }, 50, function()
                        {
                            $( this ).remove();
                        });
             
                        target.attr( 'title', tip );
                    };
             
                    target.on( 'mouseleave', remove_tooltip );
                    tooltip.on( 'click', remove_tooltip );
                } );

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
                template = _.template(WidgetContainerTemplate, { "widget": self.model } );
                self.$el.append(template).trigger('create');


                // look for the template file for this widget
                require( ["text!../templates/classes/" + self.model.collection.parent.get('className') + "/" + self.model.get('widgetName') + ".html"], 
                    
                    // on SUCCESS, fetch JSON and render the template
                    function(widgetTemplate) {

                        // could be done better 
                        url = self.model.url.split("=");
                        url[1] = "application/json";
                        self.model.url = url.join("=");
                        self.model.parse = function(response) {return response};

                        self.model.fetch( {

                            success:    function() {

                                if (self.model.get('widgetName') == "overview")
                                    $('#object-page div[data-role=header] h1')[0].innerHTML = self.model.get('fields').name.data.label;
                                
                                widgetContent = _.template(widgetTemplate, { "fields": self.model.get('fields') } );
                                self.$el.find('.ui-collapsible-content').append(widgetContent).trigger('create');

                            },

                            error:      function() {
                                widgetContent = "<p>Error while retrieving widget from the server</p>";
                                self.$el.find('.ui-collapsible-content').append(widgetContent);
                            },
                        } );

                        widgetContent = _.template(widgetTemplate, { "fields": self.model.get('fields') } );
                        self.$el.find('.ui-collapsible-content').append(widgetContent).trigger('create');
                    },

                    // on ERROR, fetch the HTML template from the server
                    function(err) { 

                        self.model.fetch( {

                            dataType:   "html",

                            // on success, put the html in the widget box
                            success:    function() {

                                html = self.model.get('html');

                                processedHtml = self.processWidget( html );

                                self.$el.find('.ui-collapsible-content').html( processedHtml ).trigger('create');

                                //self.processWidget();
                            },

                            // on error, put an error in the widget box
                            error:      function() {
                                widgetContent = "<p>Error while retrieving widget from the server</p>";
                                self.$el.find('.ui-collapsible-content').append(widgetContent);
                            },
                        } );
                    }
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

                // Delete external sequence popup widgets -- might get implemented later
                $dom.find('.slink').remove();

                // Fix URLs
                this.fixLinks($dom);

                // Add tooltips to all elements with a "title" attribute
                $dom.find('*').each( function() {

                    if ( this.title != "" )
                        $(this).attr('rel', 'tooltip');
                } );

                // Reduce font size of some elements
                $dom.find('#fade').each( function() {
                    if ( $(this).css('font-size') == "0.7em" )
                        $(this).css('font-size', '0.6em');
                } );

                // .toggle/.returned elements 
                $dom.find('.toggle span').addClass('ui-icon-arrow-r');
                // Bind .toggle to display .returned
                this.$el.on('vclick', '.toggle', function() {
                    
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
                this.$el.on('vclick', '.ev-more', function() {
                    
                    $(this).prev().toggle();

                    if ( $(this).find('.ui-icon').hasClass('ui-icon-arrow-d') )
                        $(this).find('.ui-icon').removeClass('ui-icon-arrow-d').addClass('ui-icon-arrow-u');
                    else
                        $(this).find('.ui-icon').removeClass('ui-icon-arrow-u').addClass('ui-icon-arrow-d');
                } );

                // Make .detail-box responsive
                $dom.find('.detail-box').each( function() {

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
                    self.$el.on('vclick', '#'+randId, function() {
                        $('#'+randId+'Popup').popup('open');
                    });
                } );

                // Fix tables
                $dom.find('table').attr("data-role", "table")
                                  .attr("data-mode", "columntoggle")
                                  .addClass("ui-body-d", "ui-shadow", "table-stripe", "ui-responsive")
                                  .find('thead tr').addClass("ui-bar-d");


                return $dom.html();
            },


            fixLinks: function($dom) {

                // Fix links
                $dom.find('a').each( function() {

                    // delete the host part of the url
                    link = this.href.replace( window.location.origin + "/", "" );

                    // check whether the url refers to an internal or external resource
                    if (link.indexOf("http://") == -1) { 
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
                            this.href = this.href.replace( window.location.origin, window.BASE_URL );   
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

                    this.src = this.src.replace( window.location.origin, window.BASE_URL );
                } );

                return $dom;
            },

        } );

        // Returns the View class
        return WidgetView;

    } 
);