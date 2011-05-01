/*
 * HTML Slideshow
 * Author: Rob Flaherty | rob@ravelrumba.com
 * Copyright (c) 2010 Rob Flaherty 
 * MIT Licensed: http://www.opensource.org/licenses/mit-license.php
 */
/*global location $ setTimeout */ 
var changeSlide;
(function() {
    
    //Initialize variables and cache jQuery objects
    var currentSlide = 1,
        slideHash = location.hash,
        deck = $('#deck'),
        slideCount = $('#deck > section').size(),
        prevButton = $('#prev-btn'),
        nextButton = $('#next-btn'),
        slideNumber = $('#slide-number');
    
    //Main "change slide" function
    changeSlide = function(id) {
        var previousSlide = currentSlide;
        currentSlide = id;
        var slideID = '#slide' + id;        
        deck.find('.slide-selected').removeClass('slide-selected');
        $(slideID).addClass('slide-selected');
        
        //Update menu bar
        slideNumber.html(currentSlide);
        
        //Update hash      
        location.hash = id;
        
        //Trigger newSlide event
        var slideElement = $(slideID)[0];
        $('html').trigger("newSlide", [id, previousSlide, slideElement]);
        
        //Hide arrows on first and last slides
        if ((id !== 1) && (id !== slideCount)) {
            prevButton.css('visibility', 'visible');
            nextButton.css('visibility', 'visible');
        } else if (id === 1) {
            prevButton.css('visibility', 'hidden');
        } else if (id === slideCount) {
            nextButton.css('visibility', 'hidden');
        }
    };

    var sliderInit = function(options) {
        
        //Add ids and classes to slides
        $('#deck > section').each(function(index,el){
            $(el).attr('id', 'slide' + (index +1));
            $(el).addClass('slide');     
        });

        //Set total slide count in header
        $('#slide-total').html(slideCount);
        
        //Check for hash and validate value    
        if (slideHash && (parseInt((slideHash.substring(1)), 10) <= slideCount)) {
            currentSlide = slideHash.replace('#','');
        }

        //Hide menubar if hideMenu === true
        if(options.hideMenu === true) {
            setTimeout(function(){
                $('header').fadeTo(300,0);
            }, 1500);

            $('header').hover(function(){
                $('header').fadeTo(300,1);
            },
            function(){
                $('header').fadeTo(300,0);
            });
        }
        
        //Set initial slide
        changeSlide(currentSlide);
        
    };
       
    //Next slide
    function prevSlide() {
        if (currentSlide > 1) {
            changeSlide(currentSlide - 1);
        }     
    }
    
    //Previous slide
    function nextSlide() {
        if (currentSlide < slideCount) {
            changeSlide(currentSlide + 1); 
        }
    }
    
    //Reveal "actions"
    function showActions() {        
        var actions = $('.slide-selected').find('.action');            
        
        //If actions exist
        if (actions.length > 0) {
            actions.first().removeClass('action').addClass('action-on').fadeIn(250);
            
            //Number of current action
            var actionOns = $('.slide-selected').find('.action-on'),
                actionNumber = actionOns.length;
            
            //Trigger newAction event
            $('html').trigger("newAction", actionNumber );
        } else {
            nextSlide();
        }
    }
    
    //Keyboard controls
    function keyControls(event) {
        switch(event.keyCode) {
        //fn-left, fn-up keys
        case 33:
        case 36:
        changeSlide(1);
        break;
        //fn-right, fn-down keys
        case 34:
        case 35:
        changeSlide(slideCount);
        break;
        //Left and up keys
        case 37:
        case 38:
        prevSlide();
        break;
        //Right, down, and spacebar keys
        case 32:
        case 39:
        case 40:
        showActions();
        break;
        default: console.log("ignored key " + event.keyCode);
        }
    }    
    
    //Bind control events
    prevButton.bind('click', prevSlide);
    nextButton.bind('click', showActions);
    $('html').bind('keydown', keyControls);
    
    //Do our business when the DOM is ready
    $(function(){
        sliderInit({hideMenu: true});
    });
    
}());