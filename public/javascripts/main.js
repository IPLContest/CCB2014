$(document).ready(function(){
	$.ajax({
		url : 'userpoints',
		dataType: 'json',
		headers: { 
			Accept : "application/json"
		},
		success: function (response) {
			var html = "";
			$.each(response,function(){
				var name = $(this)[0].first_name + " "+ $(this)[0].last_name ;
				html += "<li><label title='"+name+"' class='name'>"+name+"</label><label class='points'>"+$(this)[0].totalPoints+"</label></li>";
			});
			
			$(".sectionbody ul").html(html);
		}
	});
	
	$.ajax({
		url : 'fetchMatches',
		dataType: 'json',
		headers: { 
			Accept : "application/json"
		},
		success: function (response) {
			$.each(response.match,function(){
					$.ajax({
						url : 'fetchMatchDetails',
						data : {"match_id" : $(this)[0].match_id},
						success: function (response) {
						$("#matchData").append(response);
						}
					});
				
			});
		}
	});
	
	
	$("body").delegate("#Predict-btn","click",function(e){
		e.preventDefault();
		var self = $(this);
		if($(this).closest('form').find("#player").val() == 0 && typeof $(this).closest('form').find("input[name=team]:checked").val() === "undefined"){
			$("#err_msg_label").html("Atleast Winner Or Man Of The Match should be selected !!!");
			return;
		}
		$.ajax({
		url : 'addUserMatchInfo',
		dataType: 'json',
		type : 'post',
		headers: { 
			Accept : "application/json"
		},
		data :{
			"matchid" :$(this).closest('form').find("#matchid").val(),
			"player" :$(this).closest('form').find("#player").val(),
			"team" : $(this).closest('form').find("input[name=team]:checked").val()
		},
		success: function (response) {
			self.closest('form').find(".error_msg").html("<label id='succ_msg_label'>"+response.statusmessage+"</label>");
		}
		});
		
	});
});