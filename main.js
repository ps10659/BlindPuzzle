var canvas = document.getElementById('Canvas');
var context = canvas.getContext('2d');
var width = 480;
var height = 360;
context.beginPath();
context.moveTo(40,70);
context.lineTo(400,200);
context.stroke();
//
function view () {
}

function model () {
}

function GameEngine (size) {
	this.size = size
	this.startTime = null
	this.mapTree = null
}

var game = new GameEngine(3);
game.startTime = $.now()
GameEngine.prototype.starGame = function() {
	// construct puzzle

	// set model, show puzzle

	// count down
	// setInterval(function(){
	//     // do
	// }, 30)
}

$(function() {

	var cursor = '<div id="cursor"></div>';
	$("#map").append(cursor)

	$(document).keydown(function(e) {
		var position = $("#cursor").position();
		alert(e.KeyCode);
		// alert(position);

		switch (e.KeyCode)
		{
			case 37:	// left
				$("#cursor").css('left', position.left - 20 + 'px');
				break;

			case 38:	// up
				$("#cursor").css('top', position.top - 20 + 'px');
				break;

			case 39:	// right
				$("#cursor").css('left', position.left + 20 + 'px');
				break;

			case 40:	// down
				$("#cursor").css('top', position.top + 20 + 'px');
				break;
		}
	});
});
