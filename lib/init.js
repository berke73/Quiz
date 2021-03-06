//fonction pour compatibilité ie, relocalisé ?
if(!Array.indexOf){  
Array.prototype.indexOf = function(obj){  
    for(var i=0; i<this.length; i++){  
        if(this[i]==obj){  
            return i;  
        }  
    }  
    return -1;  
 }  
} 


// Prevent the backspace key from navigating back.
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD')) 
             || d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }

    if (doPrevent) {
        event.preventDefault();
    }
});

$(document).on("keydown", function (e) {
    if (e.which === 8 && !$(e.target).is("input, textarea")) {
        e.preventDefault();
    }
});

(function($){

$.fn.ctrl = function(key, callback) {
    if(typeof key != 'object') key = [key];
    callback = callback || function(){ return false; }
    return $(this).keydown(function(e) {
        var ret = true;
        $.each(key,function(i,k){
            if(e.keyCode == k.toUpperCase().charCodeAt(0) && e.ctrlKey) {
                ret = callback(e);
            }
        });
        return ret;
    });
};


$.fn.disableSelection = function() {
    $(window).ctrl(['a','s','c']);
    return this.each(function() {           
        $(this).attr('unselectable', 'on')
               .css({'-moz-user-select':'none',
                    '-o-user-select':'none',
                    '-khtml-user-select':'none',
                    '-webkit-user-select':'none',
                    '-ms-user-select':'none',
                    'user-select':'none'})
               .each(function() {
                    $(this).attr('unselectable','on')
                    .bind('selectstart',function(){ return false; });
               });
    });
};

})(jQuery);

//init
$(document).ready(function(){
	
	$(document).bind("contextmenu",function(e){

        e.preventDefault();

    });
	
	$(':not(input,select,textarea)').disableSelection();
	
	$("input:button").button();
	$("popup_ok").button();
	//$("input:button").css({width:'125px', height:'35px', padding:'5px'});
	$("#review_quiz").css({width:'200px', height:'35px', padding:'5px'});
	
	$("input:radio").buttonset();
	
	$('#question_prev').hover(function(){
		playQuizSoundHover();
	},
	function(){}
	);
	
	$('#question_next').hover(function(){
		playQuizSoundHover();
	},
	function(){}
	);
	
	$("#question_validate").hover(function(){
		playQuizSoundHover();
	},
	function(){}
	);
	
	$('#review_quiz').hover(function(){
		playQuizSoundHover();
		// pour parcourir le tableau de navigation quizNavigation il faut remettre le pointeur à 0
		pointeurNavigation = 0;
	},
	function(){}
	);
	
	$('#question_prev').click(function(){
		playQuizSoundSelect();	
		if(pointeurNavigation != 0){
			previousSlide(quizNavigation[pointeurNavigation-1]);	
		}		
	});
	
	$('#question_next').click(function(){
		playQuizSoundSelect();	
			
		// vérifier si on est en train de reviser le quiz 
		// si oui, on parcours le tableau de navigation			
		if(quizReviewed){
			console.log("pointeurNavigation = " + pointeurNavigation);
			nextSlide(quizNavigation[pointeurNavigation]);
			pointeurNavigation++;
		}
		// sinon on crée le parcours de navigation
		else{			
			quizNavigation.push(currentSlide+1);
			pointeurNavigation++;
			nextSlide(currentSlide+1);			
		}
		
	});
	
	$('#question_validate').click(function(){
		validateAnswer();
	});
	
	$('#review_quiz').click(function(){
		playQuizSoundSelect();
		reviewQuiz();
	});
	
	$("a[rel^='fancybox']").fancybox({
		'zoomOpacity'			: true,
		'centerOnScroll'		: false,
		'padding'				: 0,
		'transitionIn'			:'elastic',
		'transitionOut'			:'elastic',
		'overlayOpacity'		: 0.7,
		'overlayColor'			:'#D3D3D3',
		'zoomSpeedIn'			: 300,
		'zoomSpeedOut'			: 300,
		'maxWidth'				: 650,
		'maxHeight'             : 650,
		'arrows'				: false
	});	
	
	
	
	
	// POUR LES VIDÉOS DANS UN FANCYBOX
	var $monVideo = $('a.video');
	$monVideo.fancybox({
		padding: 0,
		margin: 0,
		overlayColor: '#111',
		autoScale: false,
		width: 640,
		height: 360,		
		beforeClose:function(){				
					
			for(var i=0;i<$monVideo.length;i++){				
				var indexFancy = $monVideo[i].toString().indexOf('fancy_');
				var id = $monVideo[i].toString().substr(indexFancy+6);
				if($.browser.mozilla){					
					jwplayer(id).stop();	
				}
				else{					
					$('#'+id).stop();
				}				
				
			}
			
			/*if($.browser.mozilla){
				$('a.video').each(function(){
					
					//console.log("id = " + $(this).attr('id'));				
					var id = $(this).attr('id').substr(4);
					console.log("stopping moz video " + id);	
					//console.log("id moz = " + id);
					//console.log("player state dans fancy= " + jwplayer(id).getState());
					jwplayer(id).stop();	
				});		
			}*/			
						
		}
	});	

	$.fancybox.next = function(){return null;};
	$.fancybox.prev = function(){return null;};	
	
	
});
