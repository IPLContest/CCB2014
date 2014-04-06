// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/userpoints', function( data ) {
	tableContent ='<table border="1"><th>User name</th><th>Points table</th>'
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td>'+ this.first_name+' '+ this.last_name + '</td>';
      tableContent += '<td>' + this.totalPoints + '</td>';     
      tableContent += '</tr>';
    });
	tableContent += '</table>'
	userListData = data;
	
    // Inject the whole content string into our existing HTML table
    $("div").html(tableContent);	
  });
};