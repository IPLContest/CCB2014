
$(document).ready(function () {
	$(".register").click(function(e){
		e.preventDefault();
		
		location.href = "signup";
	});

	$(".forgotpassword").click(function(e){
		e.preventDefault();
		
		location.href = "forgotpassword";
	});
	
	
	$("body").delegate(".playerListDropDown a.selection" ,"click",function(){
		if($(this).parent("div").find("ul").is(':visible')){
			$(this).parent("div").find("ul").fadeOut(1000);
		}else{
			$(this).parent("div").find("ul").fadeIn(1000);
		}
		
	});
	
	$(".userstatsSection .sectionheader").click(function(){
		if($(this).parent("div").find(".sectionbody").is(':visible')){
			$(this).parent("div").find(".sectionbody").slideUp();
		}else{
			$(this).parent("div").find(".sectionbody").slideDown();
		}
		
	});
	
	$("body").delegate(".playerListDropDown ul li","click",function(){
		$(this).closest("form").find("#player").val($(this).find("a").attr('data-team-id'));
		$(this).closest("div").find("a.selection label").html($(this).find("a").html());
		$(this).closest("div").find("ul").hide();
	});

});
