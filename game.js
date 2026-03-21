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
const REMOVAL_DISTANCE_FROM_PLAYER = 90;
const TEXT_REMOVE_ZONE_X = 260;
const TEXT_REMOVE_ZONE_Y = 95;

const dustArray = [];

var playerDirection = 270;
var movingInReverse = false;
var timer = 0;
var timerSecs = 0;
var timerMins = 0;
var gameMode = 'startScreen';
var initialising = true;

var player;
var dustGroup;
var textBackground;
var timeTrialStartButton;
var freeRoamStartButton;
var userInterfaceGroup;
var wallsGroup;


/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	// Debug
	//p5play.renderStats = true;

	// Best Time Setup
	if (localStorage.getItem('bestTimeTimer') == null) {
		localStorage.setItem('bestTimeMins', 5);
		localStorage.setItem('bestTimeSecs', 0);
		localStorage.setItem('bestTimeTimer', 300);
	}

	// Canvas
	cnv = createCanvas(windowWidth -4,  windowHeight -4);
	cnv.position((windowWidth/2) - (width/2), (windowHeight/2) - (height/2));

	// User Interface Group
	userInterfaceGroup = new Group();

	// Buttons
	timeTrialStartButton = new Sprite(width/2, height/2-40, 400, 60, 'kinematic');
	timeTrialStartButton.color = '#1f8f28';
	timeTrialStartButton.textSize = 30;
	timeTrialStartButton.text = 'Start Time Trial';
	userInterfaceGroup.add(timeTrialStartButton);

	freeRoamStartButton = new Sprite(width/2, height/2+40, 400, 60, 'kinematic');
	freeRoamStartButton.color = '#2269ac';
	freeRoamStartButton.textSize = 30;
	freeRoamStartButton.text = 'Start Free Roam';
	userInterfaceGroup.add(freeRoamStartButton);

	// Title Text 
	titleBox = new Sprite(width/2, height/4, 600, 100, 'kinematic');
	titleBox.color = 'white';
	titleBox.textSize = 50;
	titleBox.text = 'Vacuuming Simulator';
	userInterfaceGroup.add(titleBox);

	// In Game Score
	textBackground = new Sprite(2+TEXT_REMOVE_ZONE_X/2, 2+TEXT_REMOVE_ZONE_Y/2, TEXT_REMOVE_ZONE_X, TEXT_REMOVE_ZONE_Y, 'kinematic');
	textBackground.color = 'white';
	textBackground.visible = false;

	// Post Game Score
	scoreBox = new Sprite(width/2, height/2, 350, 200, 'none');
	scoreBox.color = 'white';
	scoreBox.visible = false;

	// Player
	player = new Sprite(width/2, height/2, 120, 60, 'dynamic');
	player.color = 'cyan';
	player.text = "Front >";
    player.textSize = 40;
    player.textColor = 'white';
	player.rotation = playerDirection;
	player.direction = playerDirection;
	player.visible = false;

	// Collision Walls
	wallsGroup = new Group();
	wallLH = new Sprite(1, height/2, 1, height, 'kinematic');
	wallLH.color = 'black';
	wallsGroup.add(wallLH);
	wallRH = new Sprite(width-1, height/2, 1, height, 'kinematic');
	wallRH.color = 'black';
	wallsGroup.add(wallRH);
	wallTop = new Sprite(width/2, 1, width, 1, 'kinematic');
	wallTop.color = 'black';
	wallsGroup.add(wallTop);
	wallBot = new Sprite(width/2, height-1, width, 1, 'kinematic');
	wallBot.color = 'black';
	wallsGroup.add(wallBot);
	wallsGroup.visible = false;
}


/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	background('lightgrey'); 

	if (gameMode == 'timeTrial') {
		while (initialising == true) {
			player.rotation = playerDirection;
			player.direction = playerDirection;
			spawnDust(DUST_TO_SPAWN);

			textBackground.y = 2+TEXT_REMOVE_ZONE_Y/2
			textBackground.scale.y = 1;
			
			player.visible = true;
			wallsGroup.visible = true;
			userInterfaceGroup.visible = false;
			userInterfaceGroup.collider = 'none';
			scoreBox.visible = false;
			textBackground.visible = true;
			initialising = false;
		}

		handleInput();
		drawDust();
		removeDust();
		allSprites.draw();
		displayText('both'); // Pass 'dust' for dust remaining only and pass 'both' for both dust and the timer 

		if (calculateDustLeft() == 0) {
			initialising = true;
			gameMode = 'endScreen';
		}

		return;
	}

	if (gameMode == 'freeRoam') {
		while (initialising == true) {
			player.rotation = playerDirection;
			player.direction = playerDirection;
			spawnDust(DUST_TO_SPAWN);

			//textBackground = new Sprite(2+TEXT_REMOVE_ZONE_X/2, (2+TEXT_REMOVE_ZONE_Y/2)-15, TEXT_REMOVE_ZONE_X, TEXT_REMOVE_ZONE_Y-30, 'k');
			//textBackground.color = 'white';
			textBackground.y = 2+TEXT_REMOVE_ZONE_Y/4
			textBackground.scale.y = 0.5;

			player.visible = true;
			wallsGroup.visible = true;
			userInterfaceGroup.visible = false;
			userInterfaceGroup.collider = 'none';
			scoreBox.visible = false;
			textBackground.visible = true;
			initialising = false;
		}

		handleInput();
		drawDust();
		removeDust();
		allSprites.draw();
		displayText('dust'); // Pass 'dust' for dust remaining only and pass 'both' for both dust and the timer 

		if (calculateDustLeft() == 0) {
			dustArray.length = 0;
			spawnDust(DUST_TO_SPAWN);
		}

		return;
	}
	
	if (gameMode == 'startScreen') {
		if (timeTrialStartButton.mouse.presses('left')) {
			initialising = true;
			gameMode = 'timeTrial';
		}

		if (freeRoamStartButton.mouse.presses('left')) {
			initialising = true;
			gameMode = 'freeRoam';
		}

		return;
	}

	if (gameMode == 'endScreen') {
		while (initialising == true) {
			playerDirection = 270;
			player.rotation = playerDirection;
			player.direction = playerDirection;

			timeTrialStartButton.y = height/1.3-40;
			freeRoamStartButton.y = height/1.3+40;	

			scoreBox.textSize = 30;
			if (parseInt(localStorage.getItem('bestTimeTimer')) > timer) {
				localStorage.setItem('bestTimeMins', timerMins);
				localStorage.setItem('bestTimeSecs', timerSecs);
				localStorage.setItem('bestTimeTimer', timer);
			}

			if (parseInt(localStorage.getItem('bestTimeMins')) < 1) {
				if (timerMins < 1) {
					scoreBox.text = 
					'Your Time:\n' + timerSecs + 's' + 
					'\nBest Time:\n' + localStorage.getItem('bestTimeSecs') + 's';
				} else {
					scoreBox.text = 
					'Your Time:\n' + timerMins + 'm ' + timerSecs + 's' + 
					'\nBest Time:\n' + localStorage.getItem('bestTimeSecs')  + 's';
				}
			} else {
				if (timerMins < 1) {
					scoreBox.text = 
					'Your Time:\n' + timerSecs + 's' + 
					'\nBest Time:\n' + localStorage.getItem('bestTimeMins') + 'm ' + localStorage.getItem('bestTimeSecs') + 's';
				} else {
					scoreBox.text = 
					'Your Time:\n' + timerMins + 'm ' + timerSecs + 's' + 
					'\nBest Time:\n' + localStorage.getItem('bestTimeMins') + 'm ' + localStorage.getItem('bestTimeSecs') + 's';
				}
			}
			

			player.visible = false;
			wallsGroup.visible = false;
			userInterfaceGroup.visible = true;
			userInterfaceGroup.collider = 'kinematic';
			scoreBox.visible = true;
			textBackground.visible = false;
			initialising = false;
		}

		if (timeTrialStartButton.mouse.presses('left')) {
			initialising = true;
			gameMode = 'timeTrial';
		}

		if (freeRoamStartButton.mouse.presses('left')) {
			initialising = true;
			gameMode = 'freeRoam';
		}
	}
}


/*******************************************************/
// handleInput()
/*******************************************************/
function handleInput() {
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
	xPosDustRemovalCircle = player.x + cos(player.rotation) * REMOVAL_DISTANCE_FROM_PLAYER;
	yPosDustRemovalCircle = player.y + sin(player.rotation) * REMOVAL_DISTANCE_FROM_PLAYER;

	// Debug
	noFill();
	stroke('purple');
	circle(xPosDustRemovalCircle, yPosDustRemovalCircle, REMOVAL_RADIUS*2); 
	fill('black')
	stroke('black');
	//console.log('x pos' + xPosDustRemovalCircle + 'x pos player' + player.x)
	//console.log('y pos' + yPosDustRemovalCircle + 'y pos player' + player.y)

	for (var i = 0; i < dustArray.length; i++) {
		if (((dustArray[i].xPos - xPosDustRemovalCircle) ** 2) + ((dustArray[i].yPos - yPosDustRemovalCircle) ** 2) < (REMOVAL_RADIUS ** 2)) {
			dustArray[i].visible = false;
		}

		if (gameMode == 'timeTrial' && initialising == true) {
			if (dustArray[i].xPos < TEXT_REMOVE_ZONE_X + WALL_DUST_SPAWNING_OFFSET && dustArray[i].yPos < TEXT_REMOVE_ZONE_Y + WALL_DUST_SPAWNING_OFFSET) {
				dustArray[i].visible = false;
			}
		}
		
		if (gameMode == 'freeRoam' && initialising == true) {
			if (dustArray[i].xPos < TEXT_REMOVE_ZONE_X + WALL_DUST_SPAWNING_OFFSET && dustArray[i].yPos < TEXT_REMOVE_ZONE_Y/2 + WALL_DUST_SPAWNING_OFFSET) {
				dustArray[i].visible = false;
			}
		}
	}
}


/*******************************************************/
// displayTextAndTimer()
/*******************************************************/
function displayText(displayMode) {
	textBackground.textSize = 30;

	if (calculateDustLeft() !== 0 && frameCount % 60 == 0) {
		timer++;
		timerSecs = timer % 60;
		timerMins = Math.trunc(timer / 60);
	}

	if (displayMode == 'both') {
		if (timerMins < 1) {
			textBackground.text = "Dust Left: " + calculateDustLeft() + "\nTime: " + timerSecs + 's', 20, 40;
		} else {
			textBackground.text = "Dust Left: " + calculateDustLeft() + "\nTime: " + timerMins + 'm ' + timerSecs + 's', 20, 40;
		}
	} else {
		textBackground.text = "Dust Left: " + calculateDustLeft(), 20, 40;
	}
	
	
}


/*******************************************************/
//  END OF APP
/*******************************************************/