$(document).ready(function(){
	
	
	$.ajax({
		url : 'mypoints',
		dataType: 'json',
		headers: { 
			Accept : "application/json"
		},
		success: function (response) {
			var html = "";
			$.each(response,function(){				
				alert($(this)[0].totalPoints));
				$("#username").append(" | My Points: " + $(this)[0].totalPoints+" ");
			
			});
		}
	});	
	
});