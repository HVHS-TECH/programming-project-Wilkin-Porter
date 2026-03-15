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

const dustArray = []

var playerDirection = 270;
var movingInReverse = false;
var dustAmount = DUST_TO_SPAWN;

var player;
var dustGroup;
var hitbox;


/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	// Debug
	p5play.renderStats = true;
	//world.velocityIterations = 2;
	//world.positionIterations = 1;

	// Canvas
	cnv = createCanvas(windowWidth -4,  windowHeight -4);
	//cnv.position((windowWidth/2) - (width/2), (windowHeight/2) - (height/2));

	//Player
	player = new Sprite(width/2, height/2, 120, 60, 'k');
	player.color = 'cyan';
	player.text = "Front >";
    player.textSize = 40;
    player.textColor = 'white';

	// Hitbox
	hitbox = new Sprite(width/2, height/2, 120, 60, 'k');
	hitbox.color = 'purple';


	// Collision Walls
	wallLH  = new Sprite(1, height/2, 1, height, 'k');
	wallLH.color = 'black';
	wallRH  = new Sprite(width-1, height/2, 1, height, 'k');
	wallRH.color = 'black';
	wallTop = new Sprite(width/2, 1, width, 1, 'k');
	wallTop.color = 'black';
	wallBot = new Sprite(width/2, height-1, width, 1, 'k');
	wallBot.color = 'black';

	//spawnDust(DUST_TO_SPAWN);
	spawnDustArray(DUST_TO_SPAWN);
}


/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	background('lightgrey'); 
	drawDust();

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

	// Update the hitbox position
	hitbox.x = player.x;
	hitbox.y = player.y;
	hitbox.rotation = playerDirection + 90;
}


/*******************************************************/
// spawnDust()
/*******************************************************/
function spawnDust(dustToSpawn) {
	dustGroup = new Group();

	// Collisions
	//dustGroup.overlaps(hitbox, moveDust);


	for (i = 0; i < dustToSpawn; i++) {
		dust = new Sprite(random(10, width-10), random(10, height-10), DUST_SIZE, DUST_SIZE, 'k');
        dust.color = random(['#633a0e', '#855624', '#2e1a05']);
		dustGroup.add(dust);
	}
}


/*******************************************************/
// spawnDustArray()
/*******************************************************/
function spawnDustArray(dustToSpawn) {
	for (i = 0; i < dustToSpawn; i++) {
		dustArray.push({
			xPos: random(WALL_DUST_SPAWNING_OFFSET, width-WALL_DUST_SPAWNING_OFFSET), 
			yPos: random(WALL_DUST_SPAWNING_OFFSET, height-WALL_DUST_SPAWNING_OFFSET), 
			color: random(['#633a0e', '#855624', '#2e1a05'])
		});
	}
}


/*******************************************************/
// drawDust()
/*******************************************************/
function drawDust() {
	for (var dust of dustArray) {
		stroke(dust.color);
		strokeWeight(DUST_SIZE);
		point(dust.xPos, dust.yPos);
	}

	// Reset stroke size and colour
	stroke('black');
	strokeWeight(1);
}


/*******************************************************/
// moveDust()
/*******************************************************/
function moveDust(dustOverlapping) {
	dustOverlapping.moveTowards(hitbox, 0.05); 
	console.log('collidiong awefasfhakfda');
	/*if (dustGroup.overlaps(player)) {
		removeDust;
	} */
}


/*******************************************************/
// removeDust()
/*******************************************************/
/*function removeDust(dustoverlapping) {
	dustOverlapping.moveTowards(hitbox); 
	dustAmount--;
	console.log(dustAmount);
}


/*******************************************************/
//  END OF APP
/*******************************************************/