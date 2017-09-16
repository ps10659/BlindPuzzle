function View () {
	var map = $("#map")[0];
	var ctx = map.getContext('2d');

	// variables
	ww = map.width;
	w = ww / game.mapSize;
	hh = map.height;
	h = hh / game.mapSize;

	// clear canvas for redrawing
	ctx.clearRect(0, 0, ww, hh);

	// draw  background
	ctx.fillStyle = game.mapBackground;
	ctx.fillRect(0, 0, ww, hh);

	// draw border
	ctx.lineWidth = game.borderLineWidth;
	ctx.strokeStyle = "rgb(0,0,0)";
	ctx.strokeRect(0, 0, ww, hh);

	// draw grill
	ctx.beginPath();
	for(i = 1; i<game.squareNum - 1; i++) {
		ctx.moveTo(0, h * i);
		ctx.lineTo(ww, h * i);
		ctx.moveTo(w * i, 0);
		ctx.lineTo(w * i, hh);
		ctx.strokeStyle = "rgb(0,0,0)";
		ctx.lineWidth=game.grillLineWidth;
	}
	ctx.stroke();

	// erase line
	ctx.beginPath();
	debugger
	for(i = 0; i<game.squareNum; i++) {
		x = i%4;
		y = Math.floor(i/4);

		if((game.puzzle[i] & 1) == 1) {
				ctx.moveTo(w * x, h * y + game.grillLineWidth);
				ctx.lineTo(w * x, h * (y+1) - game.grillLineWidth);
		}
		if((game.puzzle[i] & 2) == 2) {
				ctx.moveTo(w * x + game.grillLineWidth, h * y);
				ctx.lineTo(w * (x+1) - game.grillLineWidth, h * y);
		}
		if((game.puzzle[i] & 4) == 4) {
				ctx.moveTo(w * (x + 1), h * y + game.grillLineWidth);
				ctx.lineTo(w * (x + 1), h * (y+1) - game.grillLineWidth);
		}
		if((game.puzzle[i] & 8) == 8) {
				ctx.moveTo(w * x + game.grillLineWidth, h * (y+1));
				ctx.lineTo(w * (x+1) - game.grillLineWidth, h * (y+1));
		}
	}
	ctx.strokeStyle = game.mapBackground;
	ctx.lineWidth = game.grillLineWidth + 1;
	ctx.stroke();
}


// function model () {
// }
//


function GameEngine (size) {
	this.mapSize = size
	this.mapBackground = "rgb(255,240,240)";
	this.borderLineWidth = 3
	this.grillLineWidth = 1
	this.startTime = $.now()
	this.squareNum = Math.pow(size, 2) 
	this.puzzle = Array[Math.pow(size, 2)]
}

GameEngine.prototype.starGame = function() {
	// construct puzzle
	// random start point and end point
	// if length too short, re construct
	n = game.squareNum;
	startPoint = Math.floor(Math.random() * n);
	endPoint = Math.floor(Math.random() * (n-1));
	if(endPoint >= startPoint ) endPoint++; 
	
	this.puzzle = [0,1,5,8,8,1,2,8,8,2,8,1,0,2,5,0]

	// set model, show puzzle

	// count down

	// update View
	$(document).keydown(function(e) {
		console.log(e.keyCode);

		switch (e.keyCode) {
			case 32:	// space	
				View();
		}
	});
}

var game = new GameEngine(4);
game.starGame();
