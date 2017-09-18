function View () {
	this.map = $("#map")[0]
	this.ctx = map.getContext('2d')
	this.ww = map.width
	this.hh = map.height
	this.w = this.ww / game.puzzle.width
	this.h = this.hh / game.puzzle.height
}

View.prototype.drawEmptyPuzzle = function() {
	view.drawBackground();
	view.drawBorder();
}

View.prototype.drawPuzzle = function() {
	this.clearCanvas();
	this.drawBackground();
	this.drawGrid();
	this.eraseLine();
	this.drawBorder();
	this.drawStartEnd();
}

View.prototype.drawBlindPuzzle = function() {
	this.drawBlackBackground();
	this.drawCursor();
}

View.prototype.clearCanvas = function() {
	this.ctx.clearRect(0, 0, this.ww, this.hh)
}

View.prototype.drawBackground = function() {
	this.ctx.fillStyle = game.backgroundColor
	this.ctx.fillRect(0, 0, this.ww, this.hh)
}

View.prototype.drawBlackBackground = function() {
	this.ctx.fillStyle = "black"
	this.ctx.fillRect(0, 0, this.ww, this.hh)
}

View.prototype.drawGrid = function() {
	this.ctx.beginPath();
	for(i = 1; i<game.puzzle.width * game.puzzle.height - 1; i++) {
		this.ctx.moveTo(0, this.h * i)
		this.ctx.lineTo(this.ww, this.h * i)
		this.ctx.moveTo(this.w * i, 0)
		this.ctx.lineTo(this.w * i, this.hh)
		this.ctx.strokeStyle = "rgb(0,0,0)"
		this.ctx.lineWidth=game.gridLineWidth
	}
	this.ctx.stroke();
}

View.prototype.eraseLine = function() {
	this.ctx.beginPath();
	for(i = 0; i<game.puzzle.width * game.puzzle.height; i++) {
		x = i % game.puzzle.width
		y = Math.floor(i / game.puzzle.width)

		if((game.puzzle.map[i] & 1) == 1) {
			this.ctx.moveTo(this.w * x, this.h * y + game.gridLineWidth/2)
			this.ctx.lineTo(this.w * x, this.h * (y+1) - game.gridLineWidth/2)
		}
		if((game.puzzle.map[i] & 2) == 2) {
			this.ctx.moveTo(this.w * x + game.gridLineWidth/2, this.h * y)
			this.ctx.lineTo(this.w * (x+1) - game.gridLineWidth/2, this.h * y)
		}
		if((game.puzzle.map[i] & 4) == 4) {
			this.ctx.moveTo(this.w * (x + 1), this.h * y + game.gridLineWidth/2)
			this.ctx.lineTo(this.w * (x + 1), this.h * (y+1) - game.gridLineWidth/2)
		}
		if((game.puzzle.map[i] & 8) == 8) {
			this.ctx.moveTo(this.w * x + game.gridLineWidth/2, this.h * (y+1))
			this.ctx.lineTo(this.w * (x+1) - game.gridLineWidth/2, this.h * (y+1))
		}
	}
	this.ctx.strokeStyle = game.backgroundColor
	this.ctx.lineWidth = game.gridLineWidth + 1
	this.ctx.stroke();
}

View.prototype.drawBorder = function() {
	this.ctx.lineWidth = game.borderLineWidth
	this.ctx.strokeStyle = "rgb(0,0,0)"
	this.ctx.strokeRect(0, 0, this.ww, this.hh)
}

View.prototype.drawStartEnd = function() {
	// draw startPoint
	startX = game.puzzle.startPoint.x
	startY = game.puzzle.startPoint.y
	this.ctx.fillStyle = "blue"
	this.ctx.fillRect(startX * this.w + this.w/4, startY * this.h + this.w/4, this.w/2, this.h/2)

	// draw endPoint
	endX = game.puzzle.endPoint.x
	endY = game.puzzle.endPoint.y
	this.ctx.fillStyle = "red"
	this.ctx.fillRect(endX * this.w + this.w/4, endY * this.h + this.w/4, this.w/2, this.h/2)
}

View.prototype.drawCursor = function() {
	this.ctx.fillStyle = "white"
	this.ctx.fillRect(game.cursor.x * this.w + this.w/4, game.cursor.y * this.h + this.w/4, this.w/2, this.h/2)
}

// function model () {
// }
//

function GameEngine (width, height) {
	this.backgroundColor = "rgb(255,240,240)"
	this.borderLineWidth = 4 
	this.gridLineWidth = 2
	this.startTime = $.now()
	this.puzzleWidth = width
	this.puzzleHeight = height
	this.constructPuzzleMethod = deadPuzzle // default: deadPuzzle
	this.puzzle = {
		width: width,
		height: height,
		map: Array(width * height), 
		startPoint: {x:0, y:0}, 
		endPoint: {x:width-1, y:height -1}
	}
	this.state = 0
	this.cursor = {x: 0, y: 0}

	this.FPS = 25
	this.engine = setInterval(() => {
		// console.log(this.state)
		if(this.state == 0) {
			this.constructNewPuzzle();
			this.resetCursor();
			// console.log(this.puzzle)
			this.state = 1
		}

		// view
		if(this.state == 1) {
			view.drawEmptyPuzzle();
		}
		else if(this.state == 2) {
			if($.now() - this.startTime < 1000) view.drawPuzzle();
			else view.drawBlindPuzzle();
		}
	}, 1000 / this.FPS)
}

GameEngine.prototype.startGame = function() {

	var self = this

	// coonstruct puzzle
	this.constructNewPuzzle();

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
				break
			case 37:
				if(self.state == 2 && self.canMoveLeft(self.cursor)) self.cursor.x--
				break
			case 38:
				if(self.state == 2 && self.canMoveUp(self.cursor)) self.cursor.y--
				break
			case 39:
				if(self.state == 2 && self.canMoveRight(self.cursor)) self.cursor.x++
				break
			case 40:
				if(self.state == 2 && self.canMoveDown(self.cursor)) self.cursor.y++
				break
		}
	})
}

GameEngine.prototype.constructNewPuzzle = function() {
	// do something

	// construct puzzle
	this.puzzle = this.constructPuzzleMethod(this.puzzleWidth, this.puzzleHeight)

	// check something
}

GameEngine.prototype.resetCursor = function() {
	this.cursor.x = this.puzzle.startPoint.x
	this.cursor.y = this.puzzle.startPoint.y
}

GameEngine.prototype.canMoveLeft = function(pos) {
	currIdx = pos.x + pos.y * this.puzzle.width
	return (this.puzzle.map[currIdx] & 1) == 1
}

GameEngine.prototype.canMoveUp = function(pos) {
	currIdx = pos.x + pos.y * this.puzzle.width
	return (this.puzzle.map[currIdx] & 2) == 2
}

GameEngine.prototype.canMoveRight = function(pos) {
	currIdx = pos.x + pos.y * this.puzzle.width
	return (this.puzzle.map[currIdx] & 4) == 4
}

GameEngine.prototype.canMoveDown = function(pos) {
	currIdx = pos.x + pos.y * this.puzzle.width
	return (this.puzzle.map[currIdx] & 8) == 8
}

// GameEngine.prototype.noWall = function(curr, next) {
//     currIdx = curr.x * this.puzzle.width + curr.y
//     if(curr.x - 1 = next.x)
//         return (this.puzzle.map[currIdx] & 1) == 1
//     if(curr.y - 1 = next.y)
//         return (this.puzzle.map[currIdx] & 2) == 2
//     if(curr.x + 1 = next.x)
//         return (this.puzzle.map[currIdx] & 8) == 4
//     if(curr.y + 1 = next.y)
//         return (this.puzzle.map[currIdx] & 8) == 8
// }

deadPuzzle = function(width, height) {
	return { 
		width: width,
		height: height,
		map: [
			4,5,13,9,0,0,
			12,9,2,10,0,0,
			10,10,12,3,0,0,
			2,6,7,1,0,0,
			0,0,0,0,0,0],
		startPoint: {x:0, y:0},
		endPoint: {x:width-1, y:height-1},
	}
}

randomPuzzle = function(width, height) {
	startPointIdx = Math.floor(Math.random() * width * height)
	endPointIdx = Math.floor(Math.random() * (width * height - 1))
	if(endPointIdx >= startPointIdx ) endPointIdx++ 
	
	startPoint = {
		x: startPointIdx % width,
		y: Math.floor(startPointIdx / width),
	}
	endPoint = {
		x: endPointIdx % width,
		y: Math.floor(endPointIdx / width),
	}

	map = Array(width * height)
	for(i=0; i<width*height; i++){
		map[i] = 0
	}
	for(i=0; i<width; i++) {
		for(j=0; j<height-1; j++){
			if(Math.floor(Math.random() * 2)==1) {
				map[i+j*width] += 8
				map[i+(j+1)*width] += 2
			}
		}
	}
	for(i=0; i<height; i++) {
		for(j=0; j<width-1; j++){
			if(Math.floor(Math.random() * 2)==1) {
				map[i+j*width] += 4
				map[(i+1)+j*width] += 1
			}
		}
	}

	return { 
		width: this.puzzleWidth,
		height: this.puzzleHeight,
		map: map, 
		startPoint: startPoint,
		endPoint: endPoint,
	}
}

randomBfsPuzzle = function(width, height) {
	startPointIdx = Math.floor(Math.random() * width * height)
	endPointIdx = Math.floor(Math.random() * (width * height - 1))
	if(endPointIdx >= startPointIdx ) endPointIdx++ 

	startPoint = {
		x: startPointIdx % width,
		y: Math.floor(startPointIdx / width),
	}
	endPoint = {
		x: endPointIdx % width,
		y: Math.floor(endPointIdx / width),
	}

	map = Array(width * height)
	for(i=0; i<width*height; i++){
		map[i] = 0
	}

	


	return { 
		width: this.puzzleWidth,
		height: this.puzzleHeight,
		map: map, 
		startPoint: startPoint,
		endPoint: endPoint,
	}
}

// GameEngine.prototype.stopGame = function() {
//     clearInterval(this.engine)
// }

var game = new GameEngine(6, 5);
var view = new View();

game.constructPuzzleMethod = randomPuzzle;
// game.constructPuzzleMethod = randomBfsPuzzle;
game.startGame();
