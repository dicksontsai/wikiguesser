var attempts = $("#attempts").text();

$('#start').click(function (event) {
	console.log("Start button is clicked");
	$('#start').hide();
	$('#intro').hide();
	$('#loading').show();
	$('#guess').show();
	$('#submit').show();
	$.ajax({
		url: "http://localhost:3000/api/start"
	}).done(function (data) {
		console.log(data);
		$('#loading').hide();
		$('#hints').append("<p>"+data['hint1']+"</p>");
		$('#id').val(data['_id']);
	});
});