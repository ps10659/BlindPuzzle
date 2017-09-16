function view () {
	var map = document.getElementById('map');
	var ctx = map.getContext('2d');

	// clear canvas for redrawing
	ctx.clearRect(0, 0, map.width, map.height);

	// map background
	ctx.fillStyle = game.mapBackground;
	ctx.fillRect(0, 0, map.width, map.height);

	// map border
	ctx.lineWidth = game.borderSize;
	ctx.strokeRect(0, 0, map.width, map.height);
	ctx.strokeStyle = game.mapBackground;

	// map grill
	ctx.beginPath();
	for(i = 1; i<game.mapSize; i++) {
		ctx.moveTo(0, map.height/game.mapSize*i);
		ctx.lineTo(map.width, map.height/game.mapSize*i);
		ctx.moveTo(map.width/game.mapSize*i, 0);
		ctx.lineTo(map.width/game.mapSize*i, map.height);
		ctx.strokeStyle = "rgb(0,0,0)";
		ctx.lineWidth=game.lineSize;
	}
	ctx.closePath();
	ctx.stroke();

	// map erase line
	ctx.beginPath();
	ctx.moveTo(map.width/game.mapSize*1 + 1 , map.height/game.mapSize*2);
	ctx.lineTo(map.width/game.mapSize*2 - 1 , map.height/game.mapSize*2);	
	ctx.strokeStyle = game.mapBackground;
	ctx.lineWidth = game.lineSize + 1;
	ctx.stroke();
}


// function model () {
// }
//

function GameEngine (size) {
	this.mapSize = size
	this.mapBackground = "rgb(255,240,240)";
	this.borderSize = 3
	this.lineSize = 1
	this.startTime = $.now()
	this.mapTree = null
}

GameEngine.prototype.starGame = function() {
	// construct puzzle

	// set model, show puzzle

	// count down

	// update view
	$(document).keydown(function(e) {
		console.log(e.keyCode);

		switch (e.keyCode)
		{
			case 32:	// space	
				view();
		}
	});
}

var game = new GameEngine(4);
game.starGame();
