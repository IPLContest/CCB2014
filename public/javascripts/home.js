
$(document).ready(function () {
		$("#signUp").click(function(){
		var self = $(this);
		if($(this).html() == "Log In"){
			$("#signIn").fadeOut(1000,function(){
				$("#loginHeader").html("Log In");
				$("#signin-btn").html("Log In");
				$(".newUserLink").show();
				self.html("Sign Up");
				$("#signin_form").attr('action','loginUser');
				$("#signin_form .err_msg").html('');
				$("#signIn").fadeIn(1000,function(){
				});
			});
		}else{
			$("#signIn").fadeOut(1000,function(){
				$("#loginHeader").html("Sign Up");
				$("#signin-btn").html("Sign Up");
				$(".newUserLink").hide();
				self.html("Log In");
				$("#signin_form").attr('action','insertUser');
				$("#signin_form .err_msg").html('');
				$("#signIn").fadeIn(1000,function(){
				});
			});
		}
	});
	
	$(".playerListDropDown a.selection").click(function(){

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
	
	$(".playerListDropDown ul li").click(function(){
		
		$(this).closest("form").find("#player").val($(this).find("a").attr('data-team-id'));
		$(this).closest("div").find("a.selection label").html($(this).find("a").html());
		$(this).closest("div").find("ul").hide();
	});

});
