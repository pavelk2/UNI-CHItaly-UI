//GET url pars


function gup(name) {
	var regexS = "[\\?&]" + name + "=([^&#]*)";
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


function decode(strToDecode) {
	var encoded = strToDecode;     
	if (encoded==null)
		return "";
	return unescape(encoded.replace(/\+/g, " "));
}

$(document).ready(function() { 
	//if we are not in Mturk don't to anythin     
	if (gup('hitId')==null)   {  
		console.log("not in MTURK");
		return;                
		}
	else {        
		$("form input[type=submit]").attr("value", "Submit to MTurk");
      }

	//
	// Check if the worker is PREVIEWING the HIT or if they've ACCEPTED the HIT
	//
	if (gup('assignmentId') == "ASSIGNMENT_ID_NOT_AVAILABLE") {
		// If we're previewing, disable the button and give it a helpful message
		$("form").find(':input').prop("disabled",true);    
		var msg=  "You must ACCEPT the HIT before you can submit the results."
		$("form input[type=submit]").attr("value", msg);
		$('body').prepend("<h1 style=\"color:red\">"+msg+"</h1>")
	}

	//this should automatically find the form.  
	$("form input[type=submit]").click(

	function() {                       
		 $("form input[type=submit]").prop("disabled",true); 
		 $("form input[type=submit]").attr("value", "Sending data, please wait");    
		var action = $("form").attr("action");
		//add hitid and assignmentID to form data.
		// hit id is not of mturk class, so it's not stored twice in MTURK results
		var hitId = $('<input/>').attr({ type: 'hidden', id: 'hitID', name: 'hitID', value: gup('hitId')}) ;
	    $("form").append(hitId);    
		var wokerId = $('<input/>').attr({ type: 'hidden', id: 'workerID', name: 'workerID', value: gup('workerId')});  
		$("form").append(wokerId);
		//assignmetID is of mturk class, so it's store. This is mandatory from MTurk
		var assignmentId = $('<input/>').attr({ type: 'hidden', id: 'assignmentId', name: 'assignmentId', value: gup('assignmentId'),"class": "mturk" });  
	    $("form").append(assignmentId); 




		//do an asyn post here  with all the form data to the original URL.
	   	 $.ajax({
			  type: 'POST',
			  url: action,
			  data: $("form").serialize(),
			  success: function(data){                       
								// if the post replies with some data we add them to the form.
								//this is the form that will be sent to MTurk
			                    $.each($.parseJSON(data), function(i,el) {   
									   var input = $('<input/>').attr({ type: 'hidden', id: el.id, name: el.id, value: el.value, "class": "mturk" }) ;
									   $("form").append(input);
								    });
			            },
			  async:false
			});         
			var csrftoken = "'"+ gup("csrf") + "'";


		    //send to croco 
			var fields = $('form input:not(.mturk) ');
			fields.prop("disabled", true);    
			//re-enable wokrerId, hitId   untill we don't use separated classes.
			hitId.prop("disabled", false);    
			workerId.prop("disabled", false); 
			var task_instance_uuid = gup('uuid');       
			var url=decode(gup('ccl'))+'/mt/taskinstance/' + task_instance_uuid + '/finish/';
			//cross domain must be async, so everything is in the success function. 
			$.ajax({    
				  type: 'GET',
				  url:  url,       
				  dataType: 'jsonp',  
				  data: $("form").serialize(), 
				 success: function(data){ 
					$("form").attr("action",decode(gup("turkSubmitTo"))+"/mturk/externalSubmit") ;
					//disable wokrerId, hitId
					hitId.prop("disabled", true);    
					workerId.prop("disabled", true);
					$("form").submit();
				 },  
				 beforeSend: function(xhr, settings) {
			            xhr.setRequestHeader("X-CSRFToken", csrftoken);
			   		}, 		
				jsonp: 'jsonp'	 
				});    

		//disable all the fields that does not have to send to mturk.         

		//this disable also the send, so we have to submit the form to mturk            
		//here the form is sent to mturk.
	});
});