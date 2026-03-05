/*******************************************************/
// P5.play: game.js
// Vacuuming Simulator Main Script
// Written by Wilkin Porter - Term 1 2026
/*******************************************************/

/*******************************************************/
// Global Variables + Constants
/*******************************************************/

var playerDirection = 270;
var movingInReverse = false;

const PLAYER_MOVEMENT_SPEED = 6;
const PLAYER_ROTATION_SPEED = 1.7;
const DUST_TO_SPAWN = 10000;
const DUST_SIZE = 6;

/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	// Canvas
	cnv = createCanvas(windowWidth -4,  windowHeight -4);
	cnv.position((windowWidth/2) - (width/2), (windowHeight/2) - (height/2));

	//Player
	player = new Sprite(width/2, height/2, 120, 60);
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
		player.rotation = playerDirection;
		player.direction = playerDirection;
	};
	if (kb.released('down')) {    
		player.speed = 0;
		player.rotation = playerDirection;
		player.direction = playerDirection;
		movingInReverse = false;
	};

	console.log(frameRate());
}


/*******************************************************/
// spawnDust()
/*******************************************************/
function spawnDust(dustToSpawn) {
	dustGroup = new Group();
	//dustGroup.collides(player, removeDust);

	for (i = 0; i < dustToSpawn; i++) {
		dust = new Sprite(random(10, width-10), random(10, height-10), DUST_SIZE, DUST_SIZE, 'n');
        //dust.color = random(['#633a0e', '#855624', '#2e1a05']);
		dust.color = 'black';
		dustGroup.add(dust);
	}
}


/*******************************************************/
// removeDust()
/*******************************************************/
function removeDust(dustCollidedWith) {
	dustCollidedWith.remove();
}


/*******************************************************/
//  END OF APP
/*******************************************************/