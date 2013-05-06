//GET url pars
shape_types=['Triangle','Star','Circle','Square'];
shape_colours=['Red','Green','Blue','Yellow'];
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gup(name) {
	var regexS = "[\\?&amp;]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var tmpURL = window.location.href;
	var results = regex.exec(tmpURL); 
	if (results==null)   
		return null;
 	return results[1];
}

//
// This method decodes the query parameters that were URL-encoded
//
function checkSlide(){
	correct=true;
	if ($('.task_container .item.active .span5').children('textarea').length>0){
		if ($('.task_container .item.active .span5').children('textarea').val().trim().length==0)
			correct=false;
		if ($('.task_container .item.active .span5 input:radio:checked').length==0)
			correct=false;
		if ($('.task_container .item.active .span5 select:eq(0)').val()==0)
			correct=false;	
		if ($('.task_container .item.active .span5 select:eq(1)').val()==0)
			correct=false;	
	}
	return correct;		
}


function decode(strToDecode) {
	var encoded = strToDecode;     
	if (encoded==null)
		return "";
	return unescape(encoded.replace(/\+/g, " "));
}

$(document).ready(function() {
	var i;
	$('form').submit(function(){
		if (!checkSlide())
			alert('Not all the fields are filled');
		return checkSlide();	
	});
	$.get('template/instructions.html?id='+getRandomInt(0, 99999), function(instructions_html) {
	var instructions = doT.template(instructions_html);
	
	$.get('template/task.html?id='+getRandomInt(0, 99999), function(template_html) {
	var template = doT.template(template_html);
	var pagination='<div class="pagination">';
	//pagination+='<li class="previous change-task"><a href="#myCarousel" data-slide="prev">previous domain</a></li>';
	//pagination+='<li class="previous change-task"><a href="#myCarousel" >-</a></li>';
	//Slide generation for instructions
	var data = {};
	data.shape_message = ''
	data.shape_type = shape_types[getRandomInt(0, 3)];
	data.shape_colour = shape_colours[getRandomInt(0, 3)];
	
	previous_shape_type=data.shape_type;
	previous_shape_colour=data.shape_colour;
	$('.task_container').append(instructions(data));	
	$('.task_container .item').addClass('active');
	//pagination+='<li class="item0 item active"><a href="#">Instructions</a></li>';
	//Slide generation for domains
	for ( i = 1; i <= 10; i++) {
		console.log(gup('domain' + (i+1)));
		if (gup('domain' + i) != null) {
			var data = {};
			data.shape_message = (gup('domain' + (i+1)) != null) ? '': 'No more shapes';
			data.domain_id = i;
			data.previous_shape_type=previous_shape_type;
			data.previous_shape_colour=previous_shape_colour;
			data.domain_name = gup('domain' + i);
			data.shape_type = (gup('domain' + (i+1)) != null) ? shape_types[getRandomInt(0, 3)]: '';;
			data.shape_colour = (gup('domain' + (i+1)) != null) ? shape_colours[getRandomInt(0, 3)]: '';;
			$('.task_container').append(template(data));	
			
			previous_shape_type=data.shape_type;
			previous_shape_colour=data.shape_colour;
			//pagination+='<li class="item'+i+' item"><a href="#">'+i+'</a></li>';
		}
	}
	//$("select").dropkick();
	
	//$('.task_container .item').last().append('<p class="center"><input type="submit" id="submitButton" class="btn btn-large btn-success" value="I classified all domains. Submit the results"></p>');
	$('.carousel').carousel({interval:false});
	
	pagination+='<div class="next change-task"><a href="#" class=" btn btn-large btn-primary">next domain</a></div>';
	pagination+='</div>';
	$('.bottom-controls').append(pagination);
	/*$('.change-task.previous').click(function(){
		
		var a=$('.task_container .active').index();
		if (a>0) a=a-1; else a=$('.task_container .item').length-1;
		console.log(a);
		a=a+1;
		$.each($('.pagination li'),function(t){
			$(this).removeClass('active');
		});
		$('.pagination .item'+a).addClass('active');
		
	});*/

	$('.change-task.next').click(function(){
		if (checkSlide()){
			var a=$('.task_container .active').index();
			if (a<$('.task_container .item').length-1) {
				a=a+1;
				$('.carousel').carousel(a);
			//$('.pagination .item'+a).addClass('active');
			} 
			else {
				alert('No more domain names in this task');
			}
			$.each($('.pagination li'),function(t){
					$(this).removeClass('active');
			});	
			$('.pagination .item'+a).addClass('active');
			}
		else{
		alert('Not all the fields are filled');		
			}
	});
	  /*  $(".pagination a").click(function() {
        if (!$(this).parent().hasClass("previous") && !$(this).parent().hasClass("next")) {
            $(this).parent().siblings("li").removeClass("active");
            $(this).parent().addClass("active");
        }
    });
    	$('.pagination .item a').click(function(){
		var index=$(this).text()-1;
		console.log(index);
		$('.carousel').carousel(index);
	});
*/

	$('.task_container .item').last().click(function(){
		if ($(this).hasClass('active')){
			$('.pagination').hide();
			$('.submitresults').show();
		}else{
			$('.submitresults').hide();
			$('.pagination').show();
		}
		
	});
		
	$('.start').click(function(){
			var a=$('.task_container .active').index();
				a=a+1;
				$('.carousel').carousel(a);
			//$('.pagination .item'+a).addClass('active');
			
			$.each($('.pagination li'),function(t){
					$(this).removeClass('active');
			});	
			$('.pagination').show();
			$('.pagination .item'+a).addClass('active');
	});
	
	
	
	});
	});
	
	if (gup('assignmentId') == "ASSIGNMENT_ID_NOT_AVAILABLE")
    {
 	$('form').css('opacity','0.3');
 	$('.instructions').append('<h1>Please accept this HIT</h1>');
  // If we're previewing, disable the button and give it a helpful message
  	document.getElementById('submitButton').disabled = true;
  	document.getElementById('submitButton').value = "You must ACCEPT the HIT before you can submit the results.";
    } else {
 		var assignmentId = $('<input/>').attr({ type: 'hidden', id: 'assignmentId', name: 'assignmentId', value: gup('assignmentId'),"class": "mturk" });  
	    $("form").append(assignmentId); 
        var form = document.getElementById('mturk_form');
        if (document.referrer && ( document.referrer.indexOf('workersandbox') != -1) ) {
            $("form").attr("action",decode(gup("turkSubmitTo"))+"/mturk/externalSubmit") ;
        }
    }
      
	/*var content = data;
	 content.attachment=(content.attachment==undefined) ? '' : content.attachment;
	 content.time_ago = data.dt_create.fromNow();
	 content.dt_create=content.dt_create.valueOf();
	 content.text = wrapLinks(shorten(data.message + ' ' + data.description),data.social_network);
	 content.social_icon = options.plugin_folder + 'img/' + data.social_network + '-icon-24.png';
	 if (template!=undefined)
	 placeTemplate(template(content),data);
	 else
	 $.get(options.template,function(template_html){
	 template = doT.template(template_html);
	 placeTemplate(template(content),data);
	 });
	 */
}); 