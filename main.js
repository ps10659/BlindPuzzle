function View () {
	this.map = $("#map")[0];
	this.ctx = map.getContext('2d');
	this.ww = map.width;
	this.hh = map.height;
	this.w = this.ww / game.mapSize;
	this.h = this.hh / game.mapSize;
}

View.prototype.drawPuzzle = function() {
	this.clearCanvas();
	this.drawBackground();
	this.drawGrid();
	this.eraseLine();
}

View.prototype.clearCanvas = function() {
	this.ctx.clearRect(0, 0, this.ww, this.hh)
}

View.prototype.drawBackground = function() {
	this.ctx.fillStyle = game.mapBackground;
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
	for(i = 1; i<game.squareNum - 1; i++) {
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
	for(i = 0; i<game.squareNum; i++) {
		x = i%4;
		y = Math.floor(i/4);

		if((game.puzzle[i] & 1) == 1) {
				this.ctx.moveTo(this.w * x, this.h * y + game.gridLineWidth/2);
				this.ctx.lineTo(this.w * x, this.h * (y+1) - game.gridLineWidth/2);
		}
		if((game.puzzle[i] & 2) == 2) {
				this.ctx.moveTo(this.w * x + game.gridLineWidth/2, this.h * y);
				this.ctx.lineTo(this.w * (x+1) - game.gridLineWidth/2, this.h * y);
		}
		if((game.puzzle[i] & 4) == 4) {
				this.ctx.moveTo(this.w * (x + 1), this.h * y + game.gridLineWidth/2);
				this.ctx.lineTo(this.w * (x + 1), this.h * (y+1) - game.gridLineWidth/2);
		}
		if((game.puzzle[i] & 8) == 8) {
				this.ctx.moveTo(this.w * x + game.gridLineWidth/2, this.h * (y+1));
				this.ctx.lineTo(this.w * (x+1) - game.gridLineWidth/2, this.h * (y+1));
		}
	}
	this.ctx.strokeStyle = game.mapBackground;
	this.ctx.lineWidth = game.gridLineWidth + 1;
	this.ctx.stroke();
}

// function model () {
// }
//

function GameEngine (size) {
	this.mapSize = size
	this.mapBackground = "rgb(255,240,240)";
	this.borderLineWidth = 3
	this.gridLineWidth = 2
	this.startTime = $.now()
	this.squareNum = Math.pow(size, 2) 
	this.puzzle = Array[Math.pow(size, 2)]
	this.startPoint
	this.endPoint
	this.constructPuzzleMethod = deadPuzzle // or randomPuzzle
	this.state = 0;
	this.FPS = 25;

	this.engine = setInterval(() => {
		console.log(this.state)
		if(this.state == 0) {
			view.drawBackground();
		}
		else if(this.state == 1) {
			view.drawPuzzle();

			if($.now() - this.startTime > 1000) this.state = 2;
		}
		else if(this.state == 2) {
			view.drawBlackBackground();
		}
	}, 1000 / this.FPS);
}

GameEngine.prototype.startGame = function() {

	var self = this;
	
	// coonstruct puzzle
	this.constructPuzzle();

	// set model, show puzzle

	// count down

	// update View
	$(document).keydown(function(e) {
		console.log(e.keyCode);

		switch (e.keyCode) {
			case 32:	// space	
				switch (self.state) {
					case 0:
						self.state = 1;
						self.startTime = $.now();
						break;
					case 2:
						self.state = 0;
						break;
				}
		}
	});
}

GameEngine.prototype.constructPuzzle = function() {
	// do something
	this.startPoint = Math.floor(Math.random() * this.squareNum);
	this.endPoint = Math.floor(Math.random() * (this.squareNum-1));
	if(this.endPoint >= this.startPoint ) this.endPoint++; 
	
	// construct puzzle
	this.puzzle = this.constructPuzzleMethod(this.mapSize, this.startPoint, this.endPoint);

	// check something
}

deadPuzzle = function(size, startPoint, endPoint) {
	return [0,1,5,8,8,1,2,8,8,2,8,1,0,2,5,0]
}

randomPuzzle = function(size, startPoint, endPoint) {
	return [0,1,5,8,8,1,2,8,8,2,8,1,0,2,5,0]
}

// GameEngine.prototype.stopGame = function() {
//     clearInterval(this.engine);
// }

var game = new GameEngine(4);
var view = new View();
game.startGame();
