function View () {
	this.map = $("#map")[0];
	this.ctx = map.getContext('2d');
	this.ww = map.width;
	this.hh = map.height;
	this.w = this.ww / game.puzzleWidth;
	this.h = this.hh / game.puzzleHeight;
}

View.prototype.drawPuzzle = function() {
	this.clearCanvas();
	this.drawBackground();
	this.drawGrid();
	this.eraseLine();
	this.drawStartEnd();
}

View.prototype.clearCanvas = function() {
	this.ctx.clearRect(0, 0, this.ww, this.hh)
}

View.prototype.drawBackground = function() {
	this.ctx.fillStyle = game.backgroundColor;
	this.ctx.fillRect(0, 0, this.ww, this.hh);
	this.ctx.lineWidth = game.borderLineWidth;
	this.ctx.strokeStyle = "rgb(0,0,0)";
	this.ctx.strokeRect(0, 0, this.ww, this.hh);
}

View.prototype.drawBlackBackground = function() {
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0, 0, this.ww, this.hh);
}

View.prototype.drawGrid = function() {
	this.ctx.beginPath();
	for(i = 1; i<game.puzzleWidth * game.puzzleHeight - 1; i++) {
		this.ctx.moveTo(0, this.h * i);
		this.ctx.lineTo(this.ww, this.h * i);
		this.ctx.moveTo(this.w * i, 0);
		this.ctx.lineTo(this.w * i, this.hh);
		this.ctx.strokeStyle = "rgb(0,0,0)";
		this.ctx.lineWidth=game.gridLineWidth;
	}
	this.ctx.stroke();
}

View.prototype.eraseLine = function() {
	this.ctx.beginPath();
	for(i = 0; i<game.puzzleWidth * game.puzzleHeight; i++) {
		x = i % game.puzzleWidth;
		y = Math.floor(i / game.puzzleWidth);

		if((game.puzzle.map[i] & 1) == 1) {
			this.ctx.moveTo(this.w * x, this.h * y + game.gridLineWidth/2);
			this.ctx.lineTo(this.w * x, this.h * (y+1) - game.gridLineWidth/2);
		}
		if((game.puzzle.map[i] & 2) == 2) {
			this.ctx.moveTo(this.w * x + game.gridLineWidth/2, this.h * y);
			this.ctx.lineTo(this.w * (x+1) - game.gridLineWidth/2, this.h * y);
		}
		if((game.puzzle.map[i] & 4) == 4) {
			this.ctx.moveTo(this.w * (x + 1), this.h * y + game.gridLineWidth/2);
			this.ctx.lineTo(this.w * (x + 1), this.h * (y+1) - game.gridLineWidth/2);
		}
		if((game.puzzle.map[i] & 8) == 8) {
			this.ctx.moveTo(this.w * x + game.gridLineWidth/2, this.h * (y+1));
			this.ctx.lineTo(this.w * (x+1) - game.gridLineWidth/2, this.h * (y+1));
		}
	}
	this.ctx.strokeStyle = game.backgroundColor;
	this.ctx.lineWidth = game.gridLineWidth + 1;
	this.ctx.stroke();
}

View.prototype.drawStartEnd = function() {
	// draw startPoint
	startX = game.puzzle.startPoint % game.puzzleWidth
	startY = Math.floor(game.puzzle.startPoint / game.puzzleWidth)
	this.ctx.fillStyle = "blue";
	this.ctx.fillRect(startX * this.w, startY * this.h, this.w, this.h);

	// draw endPoint
	endX = game.puzzle.endPoint % game.puzzleWidth
	endY = Math.floor(game.puzzle.endPoint / game.puzzleWidth)
	this.ctx.fillStyle = "red";
	this.ctx.fillRect(endX * this.w, endY * this.h, this.w, this.h);
}

// function model () {
// }
//

function GameEngine (width, height) {
	this.backgroundColor = "rgb(255,240,240)";
	this.borderLineWidth = 3
	this.gridLineWidth = 2
	this.startTime = $.now()

	this.puzzleWidth = width
	this.puzzleHeight = height
	this.puzzle = {map: Array(width * height), startPoint: 0, endPoint: width * height -1}
	this.constructPuzzleMethod = randomPuzzle
	this.state = 0;
	this.FPS = 25;

	this.engine = setInterval(() => {
		console.log(this.state)
		if(this.state == 0) {
			this.constructNewPuzzle()
			console.log(this.puzzle)
			this.state = 1
		}

		if(this.state == 1) {
			view.drawBackground();
		}
		else if(this.state == 2) {
			if($.now() - this.startTime < 1000) view.drawPuzzle()
			else view.drawBlackBackground()
		}
	}, 1000 / this.FPS)
}

GameEngine.prototype.startGame = function() {

	var self = this

	// coonstruct puzzle
	this.constructNewPuzzle()

	// set model, show puzzle

	// count down

	// update View
	$(document).keydown(function(e) {
		// console.log(e.keyCode)

		switch (e.keyCode) {
			case 32:	// space	
				switch (self.state) {
					case 1:
						self.state = 2
						self.startTime = $.now()
						break
					case 2:
						self.state = 0
						break
				}
		}
	})
}

GameEngine.prototype.constructNewPuzzle = function() {
	// do something

	// construct puzzle
	this.puzzle = this.constructPuzzleMethod(this.puzzleWidth, this.puzzleHeight, this.startPoint, this.endPoint);

	// check something
}

deadPuzzle = function(width, height) {
	return { 
		map: [
			0,1,5,8,0,0,
			8,1,2,8,0,0,
			8,2,8,1,0,0,
			0,2,5,0,0,0,
			0,0,0,0,0,0],
		startPoint: 0,
		endPoint: 15,
	}
}

randomPuzzle = function(width, height, startPoint, endPoint) {
	startPoint = Math.floor(Math.random() * width * height);
	endPoint = Math.floor(Math.random() * (width * height - 1));
	if(endPoint >= startPoint ) endPoint++; 

	return { 
		map: [ 
			0,1,5,8,0,0,
			8,1,2,8,0,0,
			8,2,8,1,0,0,
			0,2,5,0,0,0,
			0,0,0,0,0,0],
		startPoint: startPoint,
		endPoint: endPoint,
	}
}

// GameEngine.prototype.stopGame = function() {
//     clearInterval(this.engine);
// }

var game = new GameEngine(6, 5);
var view = new View();
game.startGame();
