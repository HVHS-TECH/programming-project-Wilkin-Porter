/*******************************************************/
// P5.play: game.js
// Vacuuming Simulator Main Script
// Written by Wilkin Porter - Term 1 2026
// I'm writing 'color' in the code but 'colour' in comments
/*******************************************************/


/*******************************************************/
// Global Variables, Constants and Arrays
/*******************************************************/

const PLAYER_MOVEMENT_SPEED = 6;
const PLAYER_ROTATION_SPEED = 1.7;
const DUST_TO_SPAWN = 10000;
const DUST_SIZE = 6;
const WALL_DUST_SPAWNING_OFFSET = 6;
const REMOVAL_RADIUS = 60;

const dustArray = []

var playerDirection = 270;
var movingInReverse = false;

var player;
var dustGroup;


/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	// Debug
	p5play.renderStats = true;

	// Canvas
	cnv = createCanvas(windowWidth -4,  windowHeight -4);
	cnv.position((windowWidth/2) - (width/2), (windowHeight/2) - (height/2));

	//Player
	player = new Sprite(width/2, height/2, 120, 60, 'd');
	player.color = 'cyan';
	player.text = "Front >";
    player.textSize = 40;
    player.textColor = 'white';

	// Collision Walls
	wallLH  = new Sprite(1, height/2, 1, height, 'k');
	wallLH.color = 'black';
	wallRH  = new Sprite(width-1, height/2, 1, height, 'k');
	wallRH.color = 'black';
	wallTop = new Sprite(width/2, 1, width, 1, 'k');
	wallTop.color = 'black';
	wallBot = new Sprite(width/2, height-1, width, 1, 'k');
	wallBot.color = 'black';

	spawnDust(DUST_TO_SPAWN);
}


/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	background('lightgrey'); 
	drawDust();
	//console.log(calculateDustLeft());
	console.log(player.rotation);

	if (kb.pressing('left')) {
		if (movingInReverse == false) {
			playerDirection = playerDirection - PLAYER_ROTATION_SPEED;
		} else {
			playerDirection = playerDirection + PLAYER_ROTATION_SPEED;
		}
	};
	if (kb.pressing('right')) {
		if (movingInReverse == false) {
			playerDirection = playerDirection + PLAYER_ROTATION_SPEED;
		} else {
			playerDirection = playerDirection - PLAYER_ROTATION_SPEED;
		}
	};
	
	// Update the player rotation
	player.rotation = playerDirection;
	player.direction = playerDirection;

	if (kb.pressing('up')) {
		player.speed = PLAYER_MOVEMENT_SPEED;
	};
	if (kb.pressing('down')) {    
		player.speed = -PLAYER_MOVEMENT_SPEED;
		movingInReverse = true;
	};

	if (kb.released('up')) {    
		player.speed = 0;
	};
	if (kb.released('down')) {    
		player.speed = 0;
		movingInReverse = false;
	};

	removeDust();
}


/*******************************************************/
// spawnDustArray()
/*******************************************************/
function spawnDust(dustToSpawn) {
	for (var i = 0; i < dustToSpawn; i++) {
		dustArray.push({
			xPos: random(WALL_DUST_SPAWNING_OFFSET, width-WALL_DUST_SPAWNING_OFFSET), 
			yPos: random(WALL_DUST_SPAWNING_OFFSET, height-WALL_DUST_SPAWNING_OFFSET), 
			color: random(['#633a0e', '#855624', '#2e1a05']),
			visible: true
		});
	}

	removeDust();
	
	while (calculateDustLeft() < DUST_TO_SPAWN) {
		for (var i = 0; i < dustArray.length; i++) {
			if (dustArray[i].visible == false) {
				dustArray[i].xPos = random(WALL_DUST_SPAWNING_OFFSET, width-WALL_DUST_SPAWNING_OFFSET);
				dustArray[i].yPos = random(WALL_DUST_SPAWNING_OFFSET, height-WALL_DUST_SPAWNING_OFFSET);
				dustArray[i].visible = true;
			} 
		}
		removeDust();
	}
	
}


/*******************************************************/
// drawDust()
/*******************************************************/
function drawDust() {
	for (var i = 0; i < dustArray.length; i++) {
		if (dustArray[i].visible == true) {
			stroke(dustArray[i].color);
			strokeWeight(DUST_SIZE);
			point(dustArray[i].xPos, dustArray[i].yPos);
		}
	}

	// Reset stroke size and colour
	stroke('black');
	strokeWeight(1);
}


/*******************************************************/
// drawDust()
/*******************************************************/
function calculateDustLeft() {
	var dustLeft = 0;
	for (var i = 0; i < dustArray.length; i++) {
		if (dustArray[i].visible == true) {
			dustLeft++;
		}
	}

	return dustLeft;
}


/*******************************************************/
// removeDust()
/*******************************************************/
function removeDust() {
	for (var i = 0; i < dustArray.length; i++) {
		if (
			dustArray[i].xPos >= player.x - REMOVAL_RADIUS && 
			dustArray[i].xPos <= player.x + REMOVAL_RADIUS && 
			dustArray[i].yPos >= player.y - REMOVAL_RADIUS && 
			dustArray[i].yPos <= player.y + REMOVAL_RADIUS 
		){
			dustArray[i].visible = false;
		} 
	}
}


/*******************************************************/
//  END OF APP
/*******************************************************/